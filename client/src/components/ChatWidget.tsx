
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
    date?: string;
    status?: "sent" | "delivered" | "read";
}

// --- Theme ---
const THEME = {
    userBubble: "bg-[#005c4b] text-[#E9EDEF]",
    botBubble: "bg-[#202c33] text-[#E9EDEF]",
    dateBadge: "bg-[#1f2c34] text-[#8696a0] shadow-sm",
};

// --- Sound Effects ---
const playSound = (type: "send" | "receive") => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === "send") {
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        } else {
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        }
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
        console.error("Audio play failed", e);
    }
};

// --- Sub-components ---

const MessageStatus = ({ status }: { status?: "sent" | "delivered" | "read" }) => {
    if (!status) return null;
    const color = status === "read" ? "#53bdeb" : "currentColor";
    return (
        <span className="ml-1 flex items-center" title={status}>
            {status === "sent" && <svg viewBox="0 0 16 15" width="11" height="11"><path d="M15.01 3.316l-7.38 7.38c-.4.4-.88.59-1.36.59-.49 0-.98-.2-1.36-.59L1.48 7.3c-.78-.78-.78-2.05 0-2.83.78-.78 2.05-.78 2.83 0l2.05 2.06 6.02-6.03c.79-.78 2.06-.78 2.84 0 .78.79.78 2.05-.21 2.81z" fill="currentColor" fillOpacity="0.5" /></svg>}
            {(status === "delivered" || status === "read") && <svg viewBox="0 0 16 15" width="16" height="15"><path d="M15.01 3.316l-7.38 7.38c-.4.4-.88.59-1.36.59-.49 0-.98-.2-1.36-.59L1.48 7.3c-.78-.78-.78-2.05 0-2.83.78-.78 2.05-.78 2.83 0l2.05 2.06 6.02-6.03c.79-.78 2.06-.78 2.84 0 .78.79.78 2.05-.21 2.81z" fill={color} /><path d="M15.01 3.316l-7.38 7.38c-.4.4-.88.59-1.36.59-.49 0-.98-.2-1.36-.59L1.48 7.3c-.78-.78-.78-2.05 0-2.83.78-.78 2.05-.78 2.83 0l2.05 2.06 6.02-6.03c.79-.78 2.06-.78 2.84 0 .78.79.78 2.05-.21 2.81z" fill={color} transform="translate(5,0)" /></svg>}
        </span>
    );
};

const TypingIndicator = () => (
    <div className="flex items-end gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#8a7224] flex items-center justify-center shrink-0 border border-white/5 text-[10px] font-bold text-black font-sans">AI</div>
        <div className="flex gap-1.5 p-4 bg-[#2A2A2A] rounded-2xl rounded-bl-sm items-center h-[42px] shadow-md">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
        </div>
    </div>
);

const ChatMessage = ({ msg, isSameAuthor }: { msg: Message; isSameAuthor: boolean }) => {
    const isUser = msg.role === "user";
    return (
        <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 shrink-0 ${isSameAuthor ? 'invisible' : ''}`}>
                    {!isUser && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#8a7224] flex items-center justify-center shadow-md text-xs font-bold text-black font-sans">AI</div>
                    )}
                </div>
                <div className="flex flex-col">
                    <div className={`px-3.5 py-2 text-sm leading-relaxed shadow-sm break-words relative ${isUser ? THEME.userBubble : THEME.botBubble} rounded-lg`}>
                        <ReactMarkdown
                            className="prose prose-sm prose-invert max-w-none"
                            components={{
                                a: ({ ...props }) => <a {...props} className="text-blue-400 underline" />,
                                p: ({ ...props }) => <p {...props} style={{ margin: 0, padding: 0 }} />
                            }}
                        >
                            {msg.content}
                        </ReactMarkdown>
                    </div>
                    <div className={`flex items-center gap-1 mt-1.5 text-[10px] text-gray-400/80 ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <span>{msg.timestamp}</span>
                        {isUser && <MessageStatus status={msg.status} />}
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Main Widget ---
export default function ChatWidget() {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Load/Save from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem("rebeca_chat_history");
            setMessages(saved ? JSON.parse(saved) : []);
        } catch (e) { console.error("Failed to load chat history", e); }
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            try {
                localStorage.setItem("rebeca_chat_history", JSON.stringify(messages));
            } catch (e) { console.error("Failed to save chat history", e); }
        }
    }, [messages]);

    // Initial Greeting
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setIsLoading(true);
            setTimeout(() => {
                setMessages([{ role: "assistant", content: t("chat.greeting"), timestamp: getCurrentTime(), date: new Date().toISOString() }]);
                setIsLoading(false);
            }, 800);
        }
    }, [isOpen, t, messages.length]);

    // Body scroll lock
    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        if (isOpen) document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = originalStyle; };
    }, [isOpen]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const getISODate = () => new Date().toISOString();

    const formatDateDivider = (dateStr?: string) => {
        if (!dateStr) return "Today";
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === today.toDateString()) return t("chat.today", "Today");
        if (date.toDateString() === yesterday.toDateString()) return t("chat.yesterday", "Yesterday");
        return date.toLocaleDateString();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMsg: Message = { role: "user", content: inputValue, timestamp: getCurrentTime(), date: getISODate(), status: "sent" };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInputValue("");
        setIsLoading(true);
        playSound("send");

        setTimeout(() => setMessages(prev => prev.map(m => m === userMsg ? { ...m, status: "delivered" } : m)), 800);

        try {
            const apiMessages = newMessages.map(({ role, content }) => ({ role, content }));
            const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: apiMessages, language: i18n.language || "en" }) });
            if (!res.ok) throw new Error("Network error");
            const data = await res.json();

            setMessages(prev => prev.map(m => m === userMsg ? { ...m, status: "read" } : m));

            setTimeout(() => {
                setMessages(prev => [...prev, { role: "assistant", content: data.content || t("chat.error"), timestamp: getCurrentTime(), date: getISODate() }]);
                setIsLoading(false);
                playSound("receive");
            }, 1000);

        } catch (error) {
            console.error("Chat error:", error);
            setIsLoading(false);
            setMessages(prev => [...prev, { role: "assistant", content: t("chat.error"), timestamp: getCurrentTime() }]);
        }
    };

    return (
        <>
            {isOpen && (
                <>
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99]" onClick={() => setIsOpen(false)} />
                    <div className="fixed z-[100] inset-0 sm:inset-auto sm:bottom-8 sm:right-8 sm:w-[440px] sm:h-[85vh] sm:max-h-[700px] origin-bottom-right">
                        <Card className="w-full h-full flex flex-col shadow-2xl border-white/10 bg-[#0b141a] overflow-hidden sm:rounded-2xl">
                            <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")' }} />
                            <div className="p-4 shrink-0 flex justify-between items-center border-b border-white/5 bg-[#202c33]/90 backdrop-blur-sm z-10">
                                {/* Header */}
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#8a7224] flex items-center justify-center border-2 border-[#141414] shadow-md">
                                            <span className="text-sm font-bold text-black font-sans">AI</span>
                                        </div>
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#202c33] rounded-full" />
                                    </div>
                                    <div>
                                        <h3 className="font-sans font-bold text-white text-base tracking-tight">Rebeca AI</h3>
                                        <p className="text-xs text-[#D4AF37] uppercase tracking-wider font-medium">Concierge</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white rounded-full w-9 h-9" onClick={() => setIsOpen(false)}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* This is the scrolling container */}
                            <div className="flex-1 overflow-y-auto p-4">
                                {/* This is the flex container that stacks the messages */}
                                <div className="flex flex-col gap-4">
                                    {messages.map((msg, idx) => {
                                        const prevMsg = messages[idx - 1];
                                        const showDateDivider = !prevMsg || new Date(msg.date!).toDateString() !== new Date(prevMsg.date!).toDateString();
                                        const isSameAuthor = prevMsg && prevMsg.role === msg.role && !showDateDivider;

                                        // Each child of the flex container is a single DIV. This is the fix.
                                        return (
                                            <div key={idx}>
                                                {showDateDivider && (
                                                    <div className="flex justify-center mb-4 mt-2">
                                                        <span className={`${THEME.dateBadge} text-xs font-medium px-2.5 py-1 rounded-md`}>
                                                            {formatDateDivider(msg.date)}
                                                        </span>
                                                    </div>
                                                )}
                                                <ChatMessage msg={msg} isSameAuthor={isSameAuthor} />
                                            </div>
                                        );
                                    })}
                                    {isLoading && <TypingIndicator />}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>

                            <div className="p-3 bg-[#202c33] border-t border-white/10 shrink-0 z-10">
                                <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                                    <Input
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder={t("chat.placeholder", "Type a message...")}
                                        className="flex-1 bg-[#2a3942] border-none rounded-full h-11 px-5 text-base text-white placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-amber-400/80"
                                        disabled={isLoading}
                                        autoComplete="off"
                                    />
                                    <Button type="submit" size="icon" className="rounded-full h-11 w-11 shrink-0 transition-all bg-[#D4AF37] text-black" disabled={isLoading || !inputValue.trim()}>
                                        <Send className="w-5 h-5" />
                                    </Button>
                                </form>
                            </div>
                        </Card>
                    </div>
                </>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[100] h-16 w-16 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 bg-gradient-to-tr from-[#D4AF37] to-[#b5952f] text-black flex items-center justify-center border-2 border-white/30"
                aria-label="Toggle chat"
            >
                {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-8 h-8" />}
            </button>
        </>
    );
}
