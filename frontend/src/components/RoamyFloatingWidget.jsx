import React, { useState, useEffect, useRef } from "react";
import { Send, X, Sparkles, MessageSquare, Compass, Copy, Check, ShieldAlert, ArrowRight, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";

function RoamyFloatingWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const messagesEndRef = useRef(null);

  // Sync with localStorage when drawer is toggled or when loaded
  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = () => {
    const saved = localStorage.getItem("roamy_chat_history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
        return;
      } catch (err) {
        console.error("Failed to parse saved chat history", err);
      }
    }

    // Default initial greeting if no history exists
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const name = user?.name ? user.name.split(" ")[0] : "";
    const greeting = name ? `Hello, ${name}! ` : "Hello! ";

    setMessages([
      {
        id: "init",
        role: "assistant",
        content: `${greeting}I'm Roamy, your travel AI. ✈️\n\nI can plan itineraries, suggest hotels, advise budgets, or answer travel FAQs in short!\n\nHow can I help you?`
      }
    ]);
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, isOpen]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    setErrorMsg(null);
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    localStorage.setItem("roamy_chat_history", JSON.stringify(newMessages));
    setInput("");
    setLoading(true);

    try {
      const historyToSend = newMessages.map(({ role, content }) => ({ role, content }));
      const response = await api.post("/chat", { messages: historyToSend });
      
      if (response.data?.status === "success" && response.data?.data?.message) {
        const assistantMessage = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: response.data.data.message.content
        };
        const finalMessages = [...newMessages, assistantMessage];
        setMessages(finalMessages);
        localStorage.setItem("roamy_chat_history", JSON.stringify(finalMessages));
      } else {
        throw new Error("Invalid response structure from backend");
      }
    } catch (err) {
      console.error("Roamy widget error:", err);
      setErrorMsg(err.response?.data?.message || "Failed to contact Roamy.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Custom Inline Markdown parser
  const parseInlineStyles = (str) => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const segments = [];
    let cursor = 0;
    let match;
    
    while ((match = boldRegex.exec(str)) !== null) {
      if (match.index > cursor) {
        segments.push(str.substring(cursor, match.index));
      }
      segments.push(<strong key={match.index} className="font-bold text-white">{match[1]}</strong>);
      cursor = boldRegex.lastIndex;
    }
    if (cursor < str.length) {
      segments.push(str.substring(cursor));
    }
    
    return segments.length > 0 ? segments : str;
  };

  // Custom compact renderer
  const renderContent = (text) => {
    if (!text) return null;
    const lines = text.split("\n");
    const elements = [];
    let currentTable = null;
    let currentList = null;

    const flushTable = (key) => {
      if (currentTable) {
        elements.push(
          <div key={key} className="overflow-x-auto my-3 rounded-lg border border-white/10 bg-neutral-950/50 shadow-md">
            <table className="min-w-full divide-y divide-white/10 text-[11px] sm:text-xs">
              <thead className="bg-white/5">
                <tr>
                  {currentTable.headers.map((h, i) => (
                    <th key={i} className="px-3 py-2 text-left font-bold text-neutral-200 uppercase tracking-wider">
                      {parseInlineStyles(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {currentTable.rows.map((row, ri) => (
                  <tr key={ri} className="hover:bg-white/5 transition-colors">
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-3 py-2 text-neutral-300 font-medium whitespace-pre-wrap">
                        {parseInlineStyles(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        currentTable = null;
      }
    };

    const flushList = (key) => {
      if (currentList) {
        elements.push(
          <ul key={key} className="list-disc pl-5 space-y-1 my-2 text-neutral-300 text-xs sm:text-sm font-medium">
            {currentList.map((item, idx) => (
              <li key={idx}>{parseInlineStyles(item)}</li>
            ))}
          </ul>
        );
        currentList = null;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const uniqueKey = `widget-${elements.length}-${i}`;

      // 1. Table
      if (line.startsWith("|")) {
        flushList(uniqueKey + "-list");
        const cells = line.split("|")
          .map(c => c.trim())
          .filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
        
        const isSeparator = cells.every(c => c.match(/^:?-+:?$/));
        if (isSeparator) continue;

        if (!currentTable) {
          currentTable = { headers: cells, rows: [] };
        } else {
          currentTable.rows.push(cells);
        }
        continue;
      } else {
        flushTable(uniqueKey + "-table");
      }

      // 2. List Items
      if (line.startsWith("- ") || line.startsWith("* ")) {
        const itemText = line.substring(2).trim();
        if (!currentList) {
          currentList = [itemText];
        } else {
          currentList.push(itemText);
        }
        continue;
      } else {
        flushList(uniqueKey + "-list");
      }

      // 3. Headings
      if (line.startsWith("#")) {
        const hashCount = (line.match(/^#+/) || [""])[0].length;
        const headerText = line.replace(/^#+\s*/, "").trim();
        if (hashCount === 1) {
          elements.push(<h1 key={uniqueKey} className="text-base font-black text-white mt-4 mb-2 tracking-tight">{parseInlineStyles(headerText)}</h1>);
        } else if (hashCount === 2) {
          elements.push(<h2 key={uniqueKey} className="text-sm font-extrabold text-white mt-3 mb-2 tracking-tight border-b border-white/5 pb-0.5">{parseInlineStyles(headerText)}</h2>);
        } else {
          elements.push(<h3 key={uniqueKey} className="text-xs font-bold text-white mt-2 mb-1.5 tracking-tight">{parseInlineStyles(headerText)}</h3>);
        }
        continue;
      }

      if (line === "") continue;

      // 4. Paragraph
      elements.push(
        <p key={uniqueKey} className="text-xs sm:text-sm text-neutral-300 font-medium leading-relaxed my-1.5">
          {parseInlineStyles(line)}
        </p>
      );
    }

    const finalKey = `final-widget-${elements.length}`;
    flushTable(finalKey + "-table");
    flushList(finalKey + "-list");

    return elements;
  };

  const widgetStarterPrompts = [
    { label: "Japan Visa", prompt: "What are visa rules for Japan?" },
    { label: "Tokyo Budget", prompt: "Estimate budget for 3 days in Tokyo." },
    { label: "Santorini Food", prompt: "Top restaurants in Santorini?" }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Floating Chat Panel Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-[340px] sm:w-[380px] h-[480px] sm:h-[520px] max-h-[calc(100vh-110px)] rounded-2xl bg-glass border-glass shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl mb-4"
          >
            {/* Widget Header */}
            <div className="flex items-center justify-between bg-neutral-950/60 px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-black shadow-md">
                  <Compass className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-extrabold text-white">Roamy Chat</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Widget Chat Panel Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar flex flex-col min-h-0">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 max-w-[90%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                >
                  <div className={`h-6 w-6 rounded-full shrink-0 flex items-center justify-center border text-[9px] font-bold
                    ${msg.role === "user" ? "bg-white/15 border-white/20 text-neutral-200" : "bg-white text-black border-white"}`}
                  >
                    {msg.role === "user" ? <User className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
                  </div>

                  <div className="group relative text-left">
                    <div className={`rounded-xl px-3 py-2 shadow-sm text-xs sm:text-sm
                      ${msg.role === "user" 
                        ? "bg-neutral-800/80 border border-white/10 text-white rounded-tr-none" 
                        : "bg-glass-card border-glass text-neutral-200 rounded-tl-none"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <p className="whitespace-pre-wrap leading-normal font-medium">{msg.content}</p>
                      ) : (
                        <div className="markdown-body">
                          {renderContent(msg.content)}
                        </div>
                      )}
                    </div>

                    {msg.role === "assistant" && msg.id !== "init" && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="absolute -bottom-4 right-1 flex items-center gap-0.5 text-[9px] text-neutral-500 hover:text-white transition-colors cursor-pointer"
                        title="Copy reply"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="h-2.5 w-2.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-2.5 w-2.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Bouncing Dots Loader */}
              {loading && (
                <div className="flex gap-2 max-w-[80%] mr-auto">
                  <div className="h-6 w-6 rounded-full bg-white border border-white text-black shrink-0 flex items-center justify-center">
                    <Sparkles className="h-3.5 w-3.5 animate-spin" />
                  </div>
                  <div className="rounded-xl px-3 py-2.5 bg-glass-card border-glass rounded-tl-none flex items-center gap-1 shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />

              {/* Compact Starter prompts */}
              {messages.length === 1 && !loading && (
                <div className="mt-auto py-2">
                  <div className="text-center mb-3">
                    <p className="text-[10px] text-slate-500 font-bold">Quick Suggestions</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {widgetStarterPrompts.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(item.prompt)}
                        className="text-[11px] font-semibold text-neutral-300 hover:text-white border border-white/5 bg-neutral-900/50 hover:bg-white/5 rounded-xl px-3 py-2 text-left flex items-center justify-between group transition-all active:scale-[0.98] cursor-pointer shadow-sm"
                      >
                        <span>{item.label}</span>
                        <ArrowRight className="h-3 w-3 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Error alerts */}
            {errorMsg && (
              <div className="flex items-center gap-1.5 border-t border-rose-500/20 bg-rose-950/70 p-2 text-rose-200 text-[10px] sm:text-xs">
                <ShieldAlert className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                <span className="flex-1 truncate font-medium">{errorMsg}</span>
                <button 
                  onClick={() => setErrorMsg(null)}
                  className="font-bold underline cursor-pointer hover:text-white"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2 items-center p-3 border-t border-white/10 bg-neutral-950/60"
            >
              <div className="flex-1 flex items-center bg-glass border-glass rounded-xl px-3 py-2 focus-within:ring-1 focus-within:ring-white/10">
                <input
                  type="text"
                  placeholder="Ask Roamy..."
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 outline-none"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white hover:bg-neutral-200 text-black shadow-md cursor-pointer disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-2xl border border-white/20 transition-all hover:bg-neutral-200 group cursor-pointer relative"
        title="Chat with Roamy"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close-icon"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6 text-black" />
            </motion.div>
          ) : (
            <motion.div
              key="chat-icon"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center relative"
            >
              <MessageSquare className="h-6 w-6 text-black group-hover:scale-105 transition-transform" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

    </div>
  );
}

export default RoamyFloatingWidget;
