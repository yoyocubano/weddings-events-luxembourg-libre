import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

// --- Types ---
interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp?: string;
}

// --- Theme Constants (Dark Luxury) ---
const THEME = {
    primary: "#D4AF37", // Gold
    bg: "bg-[#0F0F0F]", // Deep Black
    surface: "bg-[#141414]", // Slightly Lighter Black
    userBubble: "bg-[#D4AF37] text-[#000000]", // Gold bubble, Black text
    botBubble: "bg-[#2A2A2A] text-[#E5E5E5]", // Dark Gray bubble, White text
};

export default function ChatWidget() {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    // --- State with Persistence ---
    const [messages, setMessages] = useState<Message[]>(() => {
        try {
            const saved = localStorage.getItem("rebeca_chat_history");
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to load chat history", e);
            return [];
        }
    });

    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Auto-scroll refs & state
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const userScrolledRef = useRef(false);

    // --- Effects ---

    // Save to LocalStorage
    useEffect(() => {
        try {
            localStorage.setItem("rebeca_chat_history", JSON.stringify(messages));
        } catch (e) {
            console.error("Failed to save chat history", e);
        }
    }, [messages]);

    // Initial Greeting (Only if no history)
    useEffect(() => {
        if (messages.length === 0 && isOpen) {
            setIsLoading(true);
            const timer = setTimeout(() => {
                setMessages([{
                    role: "assistant",
                    content: t("chat.greeting"),
                    timestamp: getCurrentTime()
                }]);
                setIsLoading(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [isOpen, t, messages.length]); // Added messages.length to dependency array

    // Freeze body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed'; // Required for some mobile browsers
            document.body.style.width = '100%';
        } else {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        };
    }, [isOpen]);

    // Smart Auto-Scroll (Antigravity Engine 3.0 - Robust)
    const scrollToBottom = (behavior: "smooth" | "auto" = "smooth") => {
        if (messagesContainerRef.current) {
            const container = messagesContainerRef.current;
            const scroll = () => {
                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: behavior
                });
            };

            // Double reference for robustness against layout shifts (Markdown rendering)
            requestAnimationFrame(() => {
                scroll();
                // Backup scroll for slower renders
                setTimeout(scroll, 50);
                setTimeout(scroll, 150);
            });
        }
    };

    // Scroll effect when messages change or loading state changes
    useEffect(() => {
        // Only auto-scroll if user hasn't scrolled up to read history
        if (!userScrolledRef.current) {
            scrollToBottom("smooth");
        }
    }, [messages.length, isLoading, isOpen]);

    // Force scroll when chat opens
    useEffect(() => {
        if (isOpen) {
            // Instant scroll followed by smooth adjustment
            setTimeout(() => scrollToBottom("auto"), 0);
            setTimeout(() => scrollToBottom("smooth"), 100);
        }
    }, [isOpen]);

    // Scroll Handler to detect user intent
    const handleScroll = () => {
        if (!messagesContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        // If user is within 30px of bottom, we consider them "at the bottom" -> Auto-scroll enabled
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 30;
        userScrolledRef.current = !isNearBottom;
    };

    // --- Helpers ---
    const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // --- Handlers ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMsg: Message = {
            role: "user",
            content: inputValue,
            timestamp: getCurrentTime()
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputValue("");
        setIsLoading(true);
        // Explicitly trigger scroll for user message
        setTimeout(() => scrollToBottom("smooth"), 50);

        try {
            // Filter out system markers for API
            const apiMessages = [...messages, userMsg]
                .filter(m => !m.content.startsWith('[[SUBMIT'))
                .map(m => ({ role: m.role, content: m.content }));

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: apiMessages,
                    language: i18n.language || "en"
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error("Network error");

            const data = await response.json();
            const assistantText = data.content || t("chat.connecting");

            // Calculate "Human-like" typing delay
            // Min 1.5s, Max 4s, roughly 20ms per character
            const typingSpeed = Math.min(Math.max(assistantText.length * 20, 1500), 4000);

            setTimeout(() => {
                setMessages((prev) => [...prev, {
                    role: "assistant",
                    content: assistantText,
                    timestamp: getCurrentTime()
                }]);
                setIsLoading(false);
                // Explicitly trigger scroll for assistant message
                setTimeout(() => scrollToBottom("smooth"), 50);
            }, typingSpeed);

        } catch (error) {
            console.error("Chat error:", error);
            setIsLoading(false); // Immediate fail
            setMessages((prev) => [...prev, {
                role: "assistant",
                content: t("chat.error"),
                timestamp: getCurrentTime()
            }]);
        } finally {
            // Input focus logic moved to after message appears
            setTimeout(() => {
                const input = document.querySelector('input[name="chat-input"]') as HTMLInputElement;
                if (input && window.matchMedia("(min-width: 768px)").matches) input.focus();
            }, 100);
        }
    };

    const handleConfirmInquiry = async (dataStr: string) => {
        setIsLoading(true);
        try {
            const data = JSON.parse(dataStr);
            const { submitInquiry } = await import("@/lib/api");
            await submitInquiry({
                name: data.name,
                email: data.email || "provided-in-chat@example.com",
                eventType: data.eventType || "other",
                eventDate: data.eventDate || null,
                phone: data.phone || null,
                message: "From Chat: " + (data.message || "No details")
            });

            setTimeout(() => {
                setMessages(prev => [...prev, {
                    role: "assistant",
                    content: "✅ " + t("inquiry.success", "Request sent!"),
                    timestamp: getCurrentTime()
                }]);
                setIsLoading(false);
            }, 1000); // Small fixed delay for success message

        } catch (e) {
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "❌ " + t("chat.error", "Error sending request."),
                timestamp: getCurrentTime()
            }]);
            setIsLoading(false);
        }
    };

    // --- Sub-components ---

    const TypingIndicator = () => (
        <div className="flex gap-1.5 p-4 bg-[#2A2A2A] rounded-[24px] rounded-tl-sm w-fit animate-in fade-in slide-in-from-left-2 items-center h-[42px] border border-white/5 shadow-md">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
        </div>
    );

    const InquiryCard = ({ jsonStr }: { jsonStr: string }) => {
        let inquiries: any = {};
        try { inquiries = JSON.parse(jsonStr); } catch (e) { /* silent fail */ }

        return (
            <div className="flex gap-3 max-w-[90%] mb-6 animate-in slide-in-from-left-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#8a7224] flex items-center justify-center shrink-0 shadow-lg border border-white/10 mt-auto">
                    <span className="text-[10px] font-bold text-black font-sans">AI</span>
                </div>
                <div className="bg-[#1A1A1A] p-5 rounded-[20px] rounded-tl-sm border border-[#D4AF37]/30 shadow-2xl w-full">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-[#D4AF37] text-sm tracking-wide uppercase">
                        <span>📋</span> {t("inquiry.confirm_details")}
                    </h4>
                    <div className="space-y-2 mb-5 text-gray-300 text-sm">
                        <div className="flex justify-between border-b border-gray-800 pb-1">
                            <span className="text-gray-500 text-xs uppercase tracking-wider">Name</span>
                            <span>{inquiries.name || "N/A"}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-800 pb-1">
                            <span className="text-gray-500 text-xs uppercase tracking-wider">Type</span>
                            <span>{inquiries.eventType || "Event"}</span>
                        </div>
                    </div>
                    <Button
                        onClick={() => handleConfirmInquiry(jsonStr)}
                        className="w-full bg-[#D4AF37] hover:bg-[#b5952f] text-black font-bold tracking-wide transition-all active:scale-95 h-10 rounded-xl"
                    >
                        {t("inquiry.send")}
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <>
            {isOpen && (
                <>
                    {/* Backdrop - Fondo oscuro con blur mas intenso */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99]"
                        onClick={() => setIsOpen(false)} // Click cierra el chat
                    />

                    {/* Chat Widget Container - Mas grande */}
                    <div className="fixed z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300 inset-0 sm:inset-auto sm:bottom-[50%] sm:translate-y-[50%] sm:right-8 origin-bottom-right">
                        <Card className={`w-full h-full sm:w-[500px] sm:h-[90vh] md:w-[550px] flex flex-col shadow-chat-pro border border-[#D4AF37]/20 ${THEME.bg} overflow-hidden rounded-none sm:rounded-[26px]`}>
                            {/* Header */}
                            <div className="p-4 py-5 shrink-0 flex justify-between items-center border-b border-white/5 bg-[#141414]/90 backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#8a7224] flex items-center justify-center border-2 border-[#141414] shadow-md">
                                            <span className="text-sm font-bold text-black font-sans">AI</span>
                                        </div>
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#141414] rounded-full shadow-[0_0_8px_#22c55e]"></span>
                                    </div>
                                    <div>
                                        <h3 className="font-sans font-bold text-white text-base tracking-tight">Rebeca AI</h3>
                                        <p className="text-[11px] text-[#D4AF37] uppercase tracking-wider font-medium">Concierge</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-400 hover:text-white hover:bg-white/5 rounded-full w-8 h-8 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Messages Area - Core Engine (Strict Architecture) */}
                            <div
                                className="chat-messages-area flex flex-col flex-1 overflow-y-auto overflow-x-hidden relative bg-[#0F0F0F] custom-scrollbar"
                                ref={messagesContainerRef}
                                onScroll={handleScroll}
                            >
                                {/* CONTENEDOR INTERNO (EL QUE CRECE) */}
                                <div className="flex flex-col min-h-full p-4 w-full">

                                    {/* SPACER: Empuja los mensajes al fondo, pero permite scroll manual */}
                                    <div className="flex-grow" style={{ minHeight: '10px' }} />

                                    {messages.length === 0 && !isLoading && (
                                        <div className="text-center text-gray-700 text-xs py-10 uppercase tracking-widest opacity-50 select-none">
                                            Start a conversation
                                        </div>
                                    )}

                                    {messages.map((msg, idx) => {
                                        const isUser = msg.role === "user";
                                        const prevMsg = messages[idx - 1];
                                        const isSameAuthor = prevMsg && prevMsg.role === msg.role;

                                        const isInquiry = msg.content.includes("[[SUBMIT_INQUIRY:");

                                        if (isInquiry && !isUser) return <InquiryCard key={idx} jsonStr={msg.content.match(/\[\[SUBMIT_INQUIRY: (.*?)\]\]/)?.[1] || "{}"} />;

                                        return (
                                            // "THE BRICK" - This is the structural container for each message row.
                                            // It handles the vertical spacing and alignment.
                                            <div
                                                key={idx}
                                                className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} ${isSameAuthor ? 'mt-2' : 'mt-6'}`}>
                                                
                                                {/* This inner container handles the message bubble's appearance and animation. */}
                                                <div className={`flex gap-3 max-w-[85%] animate-message-in ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                                    {!isUser && (
                                                        <div className={`w-8 h-8 shrink-0 flex items-start ${isSameAuthor ? 'h-0' : ''}`}>
                                                            {!isSameAuthor && (
                                                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#8a7224] flex items-center justify-center shadow-md border border-white/5 select-none text-[10px] font-bold text-black font-sans mt-1">
                                                                    AI
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                                                        <div
                                                            className={`px-4 py-3 text-[14.5px] leading-relaxed shadow-sm break-words border border-white/5
                                                                ${isUser
                                                                    ? `${THEME.userBubble} rounded-[20px] ${isSameAuthor ? 'rounded-tr-[4px] rounded-br-[4px]' : 'rounded-br-[4px]'}`
                                                                    : `${THEME.botBubble} rounded-[20px] ${isSameAuthor ? 'rounded-tl-[4px] rounded-bl-[4px]' : 'rounded-bl-[4px]'}`
                                                                }
                                                            `}
                                                            style={{
                                                                wordBreak: 'break-word',
                                                                overflowWrap: 'anywhere',
                                                                hyphens: 'auto'
                                                            }}
                                                        >
                                                            <ReactMarkdown
                                                                className="prose prose-invert max-w-none"
                                                                components={{
                                                                    a: ({ node, ...props }) => (
                                                                        <a {...props} className="break-all underline" />
                                                                    ),
                                                                    p: ({ node, ...props }) => (
                                                                        <p {...props} style={{ margin: 0, wordBreak: 'break-word' }} />
                                                                    )
                                                                }}
                                                            >
                                                                {msg.content}
                                                            </ReactMarkdown>
                                                        </div>
                                                        {(!messages[idx + 1] || messages[idx + 1].role !== msg.role) && (
                                                            <span className={`text-[10px] text-gray-600 mt-1 select-none ${isUser ? 'mr-1' : 'ml-1'}`}>
                                                                {msg.timestamp}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {isLoading && (
                                        <div className="flex justify-start mt-6 animate-message-in">
                                            <div className="flex gap-3 items-end">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#8a7224] flex items-center justify-center shrink-0 border border-white/5 text-[10px] font-bold text-black font-sans">
                                                    AI
                                                </div>
                                                <TypingIndicator />
                                            </div>
                                        </div>
                                    )}

                                    {/* ESTE DIV ES TU ANCLA DE SCROLL FINAL */}
                                    <div ref={messagesEndRef} className="h-2 w-full shrink-0" />
                                </div>
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-[#141414] border-t border-white/10 shrink-0">
                                <form onSubmit={handleSubmit} className="flex gap-2 relative items-center">
                                    <Input
                                        name="chat-input"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder={t("chat.placeholder", "Type a message...")}
                                        className="flex-1 bg-[#222] border-none rounded-full px-5 h-12 text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#D4AF37]/50 transition-all font-light"
                                        disabled={isLoading}
                                        autoComplete="off"
                                    />
                                    <Button
                                        type="submit"
                                        size="icon"
                                        className={`rounded-full h-11 w-11 shrink-0 transition-all active:scale-95 ${inputValue.trim() ? 'bg-[#D4AF37] hover:bg-[#b5952f] text-black shadow-lg shadow-[#D4AF37]/20' : 'bg-[#2A2A2A] text-gray-500'}`}
                                        disabled={isLoading || !inputValue.trim()}
                                    >
                                        <Send className="w-5 h-5 ml-0.5" />
                                    </Button>
                                </form>
                            </div>
                        </Card>
                    </div>
                </>
            )}

            {/* Launcher Button */}
            <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[100] animate-in zoom-in duration-300">
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    size="lg"
                    className="h-16 w-16 rounded-full shadow-[0_4px_25px_rgba(212,175,55,0.3)] hover:scale-110 hover:shadow-[0_8px_35px_rgba(212,175,55,0.4)] transition-all duration-300 bg-gradient-to-tr from-[#D4AF37] to-[#b5952f] text-black border border-white/20"
                >
                    {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-8 h-8 stroke-[1.5]" />}
                </Button>
            </div>
        </>
    );
}
