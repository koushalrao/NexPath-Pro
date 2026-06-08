import { useState, useRef, useEffect } from "react";
import api from "../api/axios";

export default function AI() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm NexPath AI, your career advisor. Ask me about internships, resume tips, interview prep, or career roadmaps for CS students." }
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = [...messages, userMsg].filter((m) => m.role !== "assistant" || messages.indexOf(m) > 0);
      const res = await api.post("/ai/chat", { messages: history });
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.reply }]);
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <div className="max-w-3xl mx-auto w-full flex flex-col flex-1 px-6 py-10">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">AI Career Advisor</h1>
          <p className="text-gray-500">Powered by Claude · Ask anything about your CS career</p>
        </div>

        {/* Messages */}
        <div className="flex-1 flex flex-col gap-4 mb-6 overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                ${m.role === "user"
                  ? "bg-purple-600 text-white rounded-br-sm"
                  : "bg-gray-900 border border-gray-800 text-gray-200 rounded-bl-sm"}`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-gray-900 border border-gray-800">
                <div className="flex gap-1">
                  {[0,1,2].map((i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              "How do I get my first internship?",
              "What skills should I learn in 2nd year?",
              "How to prepare for TCS NQT?",
              "Review my resume for Infosys",
            ].map((s) => (
              <button key={s} onClick={() => setInput(s)}
                className="text-xs px-3 py-1.5 rounded-full bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 transition-colors">
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask about internships, resume, interviews..."
            className="flex-1 px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
          />
          <button onClick={send} disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors disabled:opacity-50">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}