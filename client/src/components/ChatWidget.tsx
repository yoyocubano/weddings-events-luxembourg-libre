import React, { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ChatWidget() {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [sessionId, setSessionId] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Auto-scroll management - OPTIMIZED
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const userIsScrollingRef = useRef(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastMessageTime = useRef<number>(0);

    // Initialize Session ID
    useEffect(() => {
        setSessionId(Math.random().toString(36).substring(2, 15));
    }, []);

    // Initialize greeting
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{ role: "assistant", content: t("chat.greeting") }]);
        } else if (messages.length === 1 && messages[0].role === "assistant") {
            setMessages([{ role: "assistant", content: t("chat.greeting") }]);
        }
    }, [t, messages.length]);

    // Check if user is near bottom (within 150px)
    const isNearBottom = useCallback(() => {
        if (!messagesContainerRef.current) return true;
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        return scrollHeight - scrollTop - clientHeight < 150;
    }, []);

    // Intelligent scroll to bottom - OPTIMIZED
    const scrollToBottom = useCallback((force = false) => {
        if (!messagesContainerRef.current) return;
        
        // Don't auto-scroll if user is manually scrolling (unless forced)
        if (userIsScrollingRef.current && !force) return;

        requestAnimationFrame(() => {
            if (messagesContainerRef.current) {
                messagesContainerRef.current.scrollTo({
                    top: messagesContainerRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            }
        });
    }, []);

    // Detect user manual scroll - OPTIMIZED
    const handleScroll = useCallback(() => {
        if (!messagesContainerRef.current) return;

        // Clear previous timeout
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        // If near bottom, user is not manually scrolling
        if (isNearBottom()) {
            userIsScrollingRef.current = false;
        } else {
            userIsScrollingRef.current = true;
            
            // After 2 seconds of no scroll, resume auto-scroll
            scrollTimeoutRef.current = setTimeout(() => {
                userIsScrollingRef.current = false;
            }, 2000);
        }
    }, [isNearBottom]);

    // Auto-scroll on new messages - OPTIMIZED
    useEffect(() => {
        if (isOpen && messages.length > 0) {
            setTimeout(() => scrollToBottom(), 100);
        }
    }, [messages, isLoading, isOpen, scrollToBottom]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const now = Date.now();
        if (now - lastMessageTime.current < 2000) return;

        if (!inputValue.trim() || isLoading) return;
        lastMessageTime.current = now;

        const userMsg: Message = { role: "user", content: inputValue };
        setMessages((prev) => [...prev, userMsg]);
        setInputValue("");
        setIsLoading(true);

        try {
            const apiMessages = [...messages, userMsg]
                .filter(m => m.content && !m.content.startsWith('[[SUBMIT'))
                .map(m => ({ role: m.role, content: m.content }));

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            const response = await fetch("/.netlify/functions/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: apiMessages,
                    language: i18n.language || "en"
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                if (response.status === 429 || response.status === 503) {
                    const errorMsg = i18n.language?.startsWith("es")
                        ? "⏳ Estoy recibiendo muchas consultas. Por favor, espera unos segundos."
                        : "⏳ High traffic. Please wait a few seconds.";
                    setMessages((prev) => [...prev, { role: "assistant", content: errorMsg }]);
                    return;
                }
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            const assistantText = data.content || data.text || t("chat.connecting");

            setMessages((prev) => [...prev, { role: "assistant", content: assistantText }]);

        } catch (error: any) {
            console.error("Chat error:", error);
            let errorMsg = t("chat.error");
            if (error.name === 'AbortError') {
                errorMsg = i18n.language?.startsWith("es") 
                    ? "La respuesta tarda demasiado. Intenta de nuevo." 
                    : "Response timed out. Please try again.";
            }
            setMessages((prev) => [...prev, { role: "assistant", content: errorMsg }]);
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                const input = document.querySelector('input[name="chat-input"]') as HTMLInputElement;
                if (input) input.focus();
            }, 100);
        }
    };

    const handleConfirmInquiry = async (dataStr: string) => {
        setIsLoading(true);
        try {
            const data = JSON.parse(dataStr);
            const { submitInquiry } = await import("@/lib/api");
            const res = await submitInquiry({
                name: data.name,
                email: data.email || "provided-in-chat@example.com",
                eventType: data.eventType || "other",
                eventDate: data.eventDate || null,
                phone: data.phone || null,
                message: "From Chat: " + (data.message || "No details")
            });

            if (res.success) {
                setMessages(prev => [...prev, { 
                    role: "assistant", 
                    content: "✅ Inquiry sent successfully! We will contact you soon." 
                }]);
            } else {
                setMessages(prev => [...prev, { 
                    role: "assistant", 
                    content: "❌ Failed to send. Please try the contact form." 
                }]);
            }
        } catch (e) {
            setMessages(prev => [...prev, { 
                role: "assistant", 
                content: "❌ Error processing inquiry." 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const renderMessage = (msg: Message, idx: number) => {
        const isInquiry = msg.content.includes("[[SUBMIT_INQUIRY:");

        if (isInquiry && msg.role === 'assistant') {
            const match = msg.content.match(/\[\[SUBMIT_INQUIRY: (.*?)\]\]/);
            if (match) {
                const jsonStr = match[1];
                let inquiries: any = {};
                try { 
                    inquiries = JSON.parse(jsonStr); 
                } catch (e) { 
                    console.error('Error parsing inquiry JSON:', e);
                }

                return (
                    <div key={idx} className="flex justify-start w-full animate-message-in">
                        <div className="bg-card text-card-foreground p-4 rounded-xl mb-4 text-sm border border-border shadow-md w-[85%]">
                            <h4 className="font-semibold mb-3 flex items-center gap-2 text-primary">
                                <span>📋</span> {t("inquiry.confirm_details", "Confirm Details")}
                            </h4>

                            <div className="space-y-2 mb-4">
                                <div className="grid grid-cols-[80px_1fr] gap-2 items-start">
                                    <span className="text-muted-foreground text-xs uppercase tracking-wider font-medium mt-0.5">
                                        {t("form.name", "Name")}:
                                    </span>
                                    <span className="font-medium">{inquiries.name || "N/A"}</span>
                                </div>

                                {inquiries.email && (
                                    <div className="grid grid-cols-[80px_1fr] gap-2 items-start">
                                        <span className="text-muted-foreground text-xs uppercase tracking-wider font-medium mt-0.5">
                                            Email:
                                        </span>
                                        <span className="break-all">{inquiries.email}</span>
                                    </div>
                                )}

                                <div className="grid grid-cols-[80px_1fr] gap-2 items-start">
                                    <span className="text-muted-foreground text-xs uppercase tracking-wider font-medium mt-0.5">
                                        {t("form.event_type", "Event")}:
                                    </span>
                                    <span className="capitalize">{inquiries.eventType || "Wedding"}</span>
                                </div>

                                {inquiries.eventDate && (
                                    <div className="grid grid-cols-[80px_1fr] gap-2 items-start">
                                        <span className="text-muted-foreground text-xs uppercase tracking-wider font-medium mt-0.5">
                                            {t("form.date", "Date")}:
                                        </span>
                                        <span>{inquiries.eventDate}</span>
                                    </div>
                                )}
                            </div>

                            <Button
                                size="sm"
                                onClick={() => handleConfirmInquiry(jsonStr)}
                                disabled={isLoading}
                                className="w-full font-semibold shadow-sm"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                                        {t("common.sending", "Sending...")}
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" /> 
                                        {t("inquiry.send", "Confirm & Send Request")}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                );
            }
        }

        return (
            <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-message-in`}
            >
                <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm break-words overflow-wrap-anywhere ${
                        msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : "bg-muted text-foreground rounded-bl-none border border-border"
                    }`}
                    style={{
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                        hyphens: 'auto'
                    }}
                >
                    <ReactMarkdown
                        className="prose prose-sm dark:prose-invert max-w-none"
                        style={{
                            wordBreak: 'break-word',
                            overflowWrap: 'anywhere',
                            maxWidth: '100%'
                        }}
                        components={{
                            p: ({ node, ...props }) => (
                                <p className="mb-2 last:mb-0 break-words w-full" {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                                <ul className="list-disc pl-4 mb-2" {...props} />
                            ),
                            ol: ({ node, ...props }) => (
                                <ol className="list-decimal pl-4 mb-2" {...props} />
                            ),
                            li: ({ node, ...props }) => (
                                <li className="mb-1" {...props} />
                            ),
                            strong: ({ node, ...props }) => (
                                <span className="font-bold text-primary/90" {...props} />
                            )
                        }}
                    >
                        {msg.content}
                    </ReactMarkdown>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-2 sm:bottom-6 sm:right-24">
            {isOpen && (
                <Card className="w-[340px] sm:w-[380px] h-[500px] sm:h-[550px] flex flex-col shadow-2xl border-primary/20 animate-in slide-in-from-bottom-5 fade-in duration-300 bg-background/95 backdrop-blur-sm overflow-hidden">
                    {/* Header */}
                    <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex justify-between items-center shrink-0">
                        <div>
                            <h3 className="font-serif font-bold">{t("chat.title")}</h3>
                            <p className="text-xs opacity-90">{t("chat.subtitle")}</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-primary-foreground hover:bg-white/20 h-8 w-8"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Messages - OPTIMIZED CORE */}
                    <div 
                        ref={messagesContainerRef}
                        onScroll={handleScroll}
                        className="flex-1 overflow-y-auto overflow-x-hidden p-4 chat-messages-area"
                        style={{
                            minHeight: 0,
                            scrollBehavior: 'smooth',
                            overscrollBehavior: 'contain'
                        }}
                    >
                        <div className="flex flex-col min-h-full justify-end gap-4">
                            {messages.map((msg, idx) => renderMessage(msg, idx))}
                            
                            {isLoading && (
                                <div className="flex justify-start animate-message-in">
                                    <div className="bg-muted text-muted-foreground rounded-2xl rounded-bl-none px-4 py-3 text-sm flex items-center gap-2 border border-border">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Typing...
                                    </div>
                                </div>
                            )}
                            
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-border bg-background rounded-b-lg shrink-0">
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <Input
                                name="chat-input"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={t("chat.placeholder", "Ask about our services...")}
                                className="flex-1"
                                disabled={isLoading}
                                autoComplete="off"
                            />
                            <Button 
                                type="submit" 
                                size="icon" 
                                disabled={isLoading || !inputValue.trim()}
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </Card>
            )}

            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="lg"
                className="h-14 w-14 rounded-full chat-widget-fab"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </Button>
        </div>
    );
}
