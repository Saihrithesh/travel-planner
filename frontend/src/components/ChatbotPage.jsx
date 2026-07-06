import React, { useState, useEffect, useRef } from "react";
import { Send, Trash2, Copy, Check, Sparkles, MessageSquare, Compass, ShieldAlert, ArrowRight, User, MapPin, BadgeCheck, HelpCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";

function ChatbotPage() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("roamy_chat_history");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error("Failed to parse saved chat history", err);
      }
    }
    
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const name = user?.name ? user.name.split(" ")[0] : "";
    const greeting = name ? `Hello, ${name}! ` : "Hello! ";

    return [
      {
        id: "init",
        role: "assistant",
        content: `${greeting}I'm Roamy, your travel AI co-pilot. ✈️\n\nI can plan itineraries, suggest hotels/restaurants, advise budgets, pack bags, and check visa rules in short!\n\nHow can I help you?`
      }
    ];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const messagesEndRef = useRef(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("roamy_chat_history", JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const starterPrompts = [
    {
      title: "Custom Itinerary",
      desc: "3 days in Tokyo",
      prompt: "Create a short 3-day itinerary for Tokyo, Japan, with bullet point activities and food recommendations."
    },
    {
      title: "Budget Estimate",
      desc: "Switzerland solo",
      prompt: "Estimate a compact budget breakdown table for a 5-day solo trip to Switzerland."
    },
    {
      title: "Packing Advisor",
      desc: "Iceland in winter",
      prompt: "Suggest a short bulleted packing list and weather advice for Iceland in December."
    },
    {
      title: "Visa Requirements",
      desc: "Bali tourist visa",
      prompt: "What are the tourist visa rules and entry requirements for a US citizen visiting Bali, Indonesia?"
    }
  ];

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    setErrorMsg(null);
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const historyToSend = [...messages, userMessage].map(({ role, content }) => ({ role, content }));
      const response = await api.post("/chat", { messages: historyToSend });
      
      if (response.data?.status === "success" && response.data?.data?.message) {
        const assistantMessage = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: response.data.data.message.content
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error("Invalid response structure from backend");
      }
    } catch (err) {
      console.error("Chatbot response error:", err);
      setErrorMsg(err.response?.data?.message || "Failed to communicate with Roamy.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    if (!showConfirmReset) {
      setShowConfirmReset(true);
      // Auto-reset confirmation state after 4 seconds of inactivity
      setTimeout(() => setShowConfirmReset(false), 4000);
      return;
    }

    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const name = user?.name ? user.name.split(" ")[0] : "";
    const greeting = name ? `Hello, ${name}! ` : "Hello! ";

    const initialMessage = [
      {
        id: "init",
        role: "assistant",
        content: `${greeting}I'm Roamy, your travel AI co-pilot. ✈️\n\nI can plan itineraries, suggest hotels/restaurants, advise budgets, pack bags, and check visa rules in short!\n\nHow can I help you?`
      }
    ];
    setMessages(initialMessage);
    localStorage.setItem("roamy_chat_history", JSON.stringify(initialMessage));
    setErrorMsg(null);
    setShowConfirmReset(false);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Custom Inline Markdown parser supporting **bold** and `code`
  const parseInlineStyles = (str) => {
    const segments = [];
    const backtickParts = str.split("`");
    
    backtickParts.forEach((part, index) => {
      const isCode = index % 2 === 1;
      if (isCode) {
        segments.push(
          <code key={`code-${index}`} className="px-1.5 py-0.5 rounded bg-white/10 text-neutral-200 font-mono text-[11px] sm:text-xs border border-white/5">
            {part}
          </code>
        );
      } else {
        const boldRegex = /\*\*(.*?)\*\*/g;
        let lastIdx = 0;
        let match;
        
        while ((match = boldRegex.exec(part)) !== null) {
          if (match.index > lastIdx) {
            segments.push(part.substring(lastIdx, match.index));
          }
          segments.push(<strong key={`bold-${index}-${match.index}`} className="font-extrabold text-white">{match[1]}</strong>);
          lastIdx = boldRegex.lastIndex;
        }
        if (lastIdx < part.length) {
          segments.push(part.substring(lastIdx));
        }
      }
    });
    
    return segments.length > 0 ? segments : str;
  };

  // Custom renderer for markdown content with support for ordered lists
  const renderContent = (text) => {
    if (!text) return null;
    const lines = text.split("\n");
    const elements = [];
    let currentTable = null;
    let currentList = null;
    let currentOrderedList = null;

    const flushTable = (key) => {
      if (currentTable) {
        elements.push(
          <div key={key} className="overflow-x-auto my-3.5 rounded-xl border border-white/5 bg-neutral-950/45 shadow-inner">
            <table className="min-w-full divide-y divide-white/10 text-xs sm:text-sm">
              <thead className="bg-white/5">
                <tr>
                  {currentTable.headers.map((h, i) => (
                    <th key={i} className="px-3.5 py-2.5 text-left font-extrabold text-neutral-300 uppercase tracking-wider">
                      {parseInlineStyles(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {currentTable.rows.map((row, ri) => (
                  <tr key={ri} className="hover:bg-white/5 transition-colors duration-250">
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-3.5 py-2 text-neutral-300 font-medium whitespace-pre-wrap">
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
          <ul key={key} className="list-disc pl-6 space-y-1 my-3 text-neutral-300 text-xs sm:text-sm font-medium">
            {currentList.map((item, idx) => (
              <li key={idx}>{parseInlineStyles(item)}</li>
            ))}
          </ul>
        );
        currentList = null;
      }
    };

    const flushOrderedList = (key) => {
      if (currentOrderedList) {
        elements.push(
          <ol key={key} className="list-decimal pl-6 space-y-1.5 my-3 text-neutral-300 text-xs sm:text-sm font-medium">
            {currentOrderedList.map((item, idx) => (
              <li key={idx}>{parseInlineStyles(item)}</li>
            ))}
          </ol>
        );
        currentOrderedList = null;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const uniqueKey = `line-${elements.length}-${i}`;

      // 1. Table
      if (line.startsWith("|")) {
        flushList(uniqueKey + "-list");
        flushOrderedList(uniqueKey + "-ordered-list");
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

      // 2. Unordered Lists
      if (line.startsWith("- ") || line.startsWith("* ")) {
        flushOrderedList(uniqueKey + "-ordered-list");
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

      // 3. Ordered Lists
      const orderedMatch = line.match(/^(\d+)\.\s+(.*)$/);
      if (orderedMatch) {
        flushList(uniqueKey + "-list");
        const itemText = orderedMatch[2].trim();
        if (!currentOrderedList) {
          currentOrderedList = [itemText];
        } else {
          currentOrderedList.push(itemText);
        }
        continue;
      } else {
        flushOrderedList(uniqueKey + "-ordered-list");
      }

      // 4. Headings
      if (line.startsWith("#")) {
        const hashCount = (line.match(/^#+/) || [""])[0].length;
        const headerText = line.replace(/^#+\s*/, "").trim();
        if (hashCount === 1) {
          elements.push(<h1 key={uniqueKey} className="text-lg sm:text-xl font-black text-white mt-5 mb-2.5 tracking-tight">{parseInlineStyles(headerText)}</h1>);
        } else if (hashCount === 2) {
          elements.push(<h2 key={uniqueKey} className="text-base sm:text-lg font-extrabold text-white mt-4.5 mb-2 tracking-tight border-b border-white/5 pb-1">{parseInlineStyles(headerText)}</h2>);
        } else {
          elements.push(<h3 key={uniqueKey} className="text-sm font-bold text-white mt-3.5 mb-1.5 tracking-tight">{parseInlineStyles(headerText)}</h3>);
        }
        continue;
      }

      if (line === "") continue;

      // 5. Default Paragraph
      elements.push(
        <p key={uniqueKey} className="text-xs sm:text-sm text-neutral-300 font-medium leading-relaxed my-1.5">
          {parseInlineStyles(line)}
        </p>
      );
    }

    const finalKey = `final-${elements.length}`;
    flushTable(finalKey + "-table");
    flushList(finalKey + "-list");
    flushOrderedList(finalKey + "-ordered-list");

    return elements;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:grid md:grid-cols-12 md:gap-6 h-[calc(100vh-110px)] sm:h-[calc(100vh-130px)]">
      
      {/* LEFT COLUMN: Identity & Info Panel (Desktop only, 4 cols) */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:flex md:col-span-4 flex-col gap-5 h-full overflow-y-auto pr-1"
      >
        {/* Roamy AI Profile Card */}
        <div className="border border-white/10 rounded-2xl bg-glass p-5 shadow-lg relative overflow-hidden backdrop-blur-xl shrink-0">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-white/10 rounded-2xl blur-md group-hover:blur-lg transition-all animate-pulse" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-white/20 text-black shadow-xl">
                <Compass className="h-8 w-8 animate-spin" style={{ animationDuration: "12s" }} />
              </div>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-black" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-black text-white tracking-tight">Roamy</h2>
              <p className="text-xs text-neutral-400 font-bold">Your AI Travel Co-Pilot</p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-[10px] font-bold">
              <BadgeCheck className="h-3 w-3" />
              <span>Gemini Engine Active</span>
            </div>
          </div>
        </div>

        {/* Travel Scope checklist */}
        <div className="border border-white/10 rounded-2xl bg-glass p-5 shadow-lg backdrop-blur-xl flex-grow overflow-y-auto">
          <h3 className="text-xs font-black text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4 text-neutral-400" />
            <span>Scope of Expertise</span>
          </h3>
          
          <ul className="space-y-3 text-xs text-slate-400 font-semibold leading-normal">
            <li className="flex gap-2 items-start">
              <span className="text-neutral-200 mt-0.5">•</span>
              <span><strong>Itineraries:</strong> Get curated daily lists of highlights.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-neutral-200 mt-0.5">•</span>
              <span><strong>Budget Tables:</strong> Receive estimated breakdowns.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-neutral-200 mt-0.5">•</span>
              <span><strong>Hotels & Dining:</strong> Get highly rated local recommendations.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-neutral-200 mt-0.5">•</span>
              <span><strong>Visa Rules:</strong> Understand entry rules & policies.</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="text-neutral-200 mt-0.5">•</span>
              <span><strong>Packing Logs:</strong> Get weather-adapted bag items.</span>
            </li>
          </ul>

          <div className="mt-6 p-3 rounded-xl bg-white/5 border border-white/5 flex gap-2 items-start">
            <AlertCircle className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-500 leading-normal">
              Roamy operates strictly within travel topics. Non-travel questions will be politely declined.
            </p>
          </div>
        </div>

        {/* Reset Chat Control */}
        {messages.length > 1 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClear}
            className={`flex items-center justify-center gap-2 border rounded-xl px-4 py-3 text-xs font-bold transition-all cursor-pointer shadow-md shrink-0 duration-300
              ${showConfirmReset 
                ? "border-rose-500 bg-rose-600 text-white animate-pulse" 
                : "border-rose-500/20 hover:border-rose-500/40 bg-rose-950/20 hover:bg-rose-950/45 text-rose-200"
              }`}
          >
            <Trash2 className="h-4 w-4" />
            <span>{showConfirmReset ? "Click again to confirm" : "Reset History"}</span>
          </motion.button>
        )}
      </motion.div>

      {/* RIGHT COLUMN: Main Chat Console (Mobile: 12 cols, Desktop: 8 cols) */}
      <div className="flex-1 md:col-span-8 flex flex-col h-full overflow-hidden">
        
        {/* Compact Mobile Header (Hidden on Desktop) */}
        <div className="flex md:hidden items-center justify-between border border-white/10 rounded-2xl bg-glass p-3 shadow-md backdrop-blur-xl mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black shadow-md">
              <Compass className="h-4.5 w-4.5" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white leading-none">Roamy</h1>
              <span className="text-[9px] text-slate-400 font-bold">AI Travel Co-Pilot</span>
            </div>
          </div>

          {messages.length > 1 && (
            <button
              onClick={handleClear}
              className={`p-2 border rounded-xl transition-all duration-300 font-bold text-xs flex items-center gap-1
                ${showConfirmReset 
                  ? "border-rose-500 bg-rose-600 text-white animate-pulse" 
                  : "border-white/10 bg-white/5 text-neutral-400 hover:text-rose-400 hover:border-rose-500/30"
                }`}
            >
              <Trash2 className="h-3.5 w-3.5" />
              {showConfirmReset && <span className="text-[9px]">Confirm?</span>}
            </button>
          )}
        </div>

        {/* Primary Chat Box */}
        <div className="flex-1 overflow-y-auto rounded-3xl bg-glass border-glass p-4 sm:p-6 shadow-2xl relative flex flex-col min-h-0">
          
          {/* Scrollable messages log */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                >
                  {/* Bubble icon */}
                  <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center border text-xs font-bold shadow-md
                    ${msg.role === "user" 
                      ? "bg-white/10 border-white/20 text-neutral-200" 
                      : "bg-white text-black border-white"
                    }`}
                  >
                    {msg.role === "user" ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                  </div>

                  {/* Message box */}
                  <div className="group relative">
                    <div className={`rounded-2xl px-4 py-3 shadow-md text-left 
                      ${msg.role === "user" 
                        ? "bg-neutral-900/60 border border-white/10 text-white rounded-tr-none" 
                        : "bg-glass-card border-glass text-neutral-200 rounded-tl-none"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <p className="text-xs sm:text-sm font-semibold leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <div className="markdown-body">
                          {renderContent(msg.content)}
                        </div>
                      )}
                    </div>

                    {/* Copy Button overlay */}
                    {msg.role === "assistant" && msg.id !== "init" && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="absolute -bottom-5 right-1 flex items-center gap-0.5 text-[9px] text-neutral-500 hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Bouncing Loader */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 max-w-[80%] mr-auto"
                >
                  <div className="h-8 w-8 rounded-full bg-white text-black border border-white shrink-0 flex items-center justify-center shadow-md">
                    <Sparkles className="h-4 w-4 animate-spin" />
                  </div>
                  <div className="rounded-2xl px-4 py-3.5 bg-glass-card border-glass rounded-tl-none flex items-center gap-1.5 shadow-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* Welcome Dashboard (Only when 1 message is present) */}
          {messages.length === 1 && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="my-auto py-4 text-center max-w-xl mx-auto space-y-6"
            >
              <div className="space-y-2">
                <div className="inline-flex p-3.5 rounded-2xl bg-white/5 border border-white/10 text-neutral-300 shadow-md">
                  <Compass className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">I'm Roamy, your travel AI.</h2>
                <p className="text-xs sm:text-sm text-slate-400 font-semibold leading-relaxed">
                  Plan itineraries, forecast travel budgets, get packing tips, or ask visa regulations. Choose a quick start prompt below:
                </p>
              </div>

              {/* Categorized Prompts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
                {starterPrompts.map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSend(item.prompt)}
                    className="flex flex-col justify-between items-start rounded-2xl border border-white/10 hover:border-white/25 bg-neutral-950/45 p-4 transition-all cursor-pointer group hover:bg-white/5 shadow-md"
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-black text-white tracking-tight flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-neutral-400 group-hover:text-white transition-colors" />
                        {item.title}
                      </span>
                      <p className="text-[10px] text-slate-400 font-bold">{item.desc}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-neutral-500 group-hover:text-white transition-colors mt-4">
                      <span>Ask Roamy</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Error notifications */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 border border-rose-500/20 rounded-xl bg-rose-950/45 p-3 text-rose-200 text-xs sm:text-sm mt-3 shadow-lg"
          >
            <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0" />
            <span className="flex-1 font-medium">{errorMsg}</span>
            <button 
              onClick={() => setErrorMsg(null)}
              className="text-xs font-bold underline hover:text-white cursor-pointer"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        {/* Floating Input Dock */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2 items-center mt-3 shrink-0"
        >
          <div className="flex-1 flex items-center bg-glass border-glass rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-white/10 transition-all shadow-md">
            <input
              type="text"
              placeholder="Where are we traveling? Ask Roamy about budgets, itineraries, packing, visas..."
              className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-11 w-11 sm:h-[48px] sm:w-[48px] items-center justify-center rounded-xl bg-white hover:bg-neutral-200 text-black shadow-lg shadow-white/5 transition-all shrink-0 cursor-pointer disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          </motion.button>
        </form>
      </div>

    </div>
  );
}

export default ChatbotPage;
