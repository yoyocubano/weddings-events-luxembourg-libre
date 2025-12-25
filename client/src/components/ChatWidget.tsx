import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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

    // Initialize or update greeting when language changes
    useEffect(() => {
        // Only reset if empty or if it's the very first message
        if (messages.length === 0) {
            setMessages([{ role: "assistant", content: t("chat.greeting") }]);
        } else if (messages.length === 1 && messages[0].role === "assistant") {
            // Update the initial greeting in real-time if the user hasn't chatted yet
            setMessages([{ role: "assistant", content: t("chat.greeting") }]);
        }
    }, [t, messages.length]);

    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMsg: Message = { role: "user", content: inputValue };
        setMessages((prev) => [...prev, userMsg]);
        setInputValue("");
        setIsLoading(true);

        try {
            // Prepare message history for API (limit context if needed)
            const apiMessages = [...messages, userMsg].filter(m => m.content).map(m => ({
                role: m.role,
                content: m.content
            }));

            // Call Netlify Function
            const response = await fetch("/.netlify/functions/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: apiMessages,
                    language: i18n.language || "en" // Send current language
                }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            const assistantText = data.content || data.role === "assistant" ? data.content : t("chat.connecting");

            setMessages((prev) => [...prev, { role: "assistant", content: assistantText }]);

        } catch (error) {
            console.error("Chat error details:", error);
            // Optionally, we could show the specific error in the UI for debugging:
            // const errorMessage = error instanceof Error ? error.message : "Connection failed";
            setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I am offline at the moment. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            {isOpen && (
                <Card className="w-[350px] h-[500px] flex flex-col shadow-2xl border-primary/20 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex justify-between items-center">
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

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                        <div className="flex flex-col gap-4">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm overflow-hidden ${msg.role === "user"
                                            ? "bg-primary text-primary-foreground rounded-br-none"
                                            : "bg-muted text-foreground rounded-bl-none border border-border"
                                            }`}
                                    >
                                        <ReactMarkdown
                                            className="prose prose-sm dark:prose-invert max-w-none break-words"
                                            components={{
                                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2" {...props} />,
                                                ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                                                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                                strong: ({ node, ...props }) => <span className="font-bold text-primary/90" {...props} />
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-muted text-muted-foreground rounded-2xl rounded-bl-none px-4 py-3 text-sm flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Typing...
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Input */}
                    <div className="p-4 border-t border-border bg-background rounded-b-lg">
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask about our services..."
                                className="flex-1"
                                disabled={isLoading}
                            />
                            <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </Card>
            )}

            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="lg"
                className="h-14 w-14 rounded-full shadow-xl bg-primary text-primary-foreground hover:scale-105 transition-transform"
            >
                {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
            </Button>
        </div>
    );
}
