"use client";
import { useState, useEffect, useRef, FormEvent, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { FaRobot, FaPaperPlane, FaSpinner, FaMoon } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<{ type: "user" | "bot", message: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendPrompt();
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendPrompt();
    }
  };

  const sendPrompt = async () => {
    if (!prompt.trim()) return;
    setChatHistory((prev) => [...prev, { type: "user", message: prompt }]);
    setLoading(true);
    setPrompt("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      // Get the response as plain text since backend returns plain text
      const data = await res.text();

      if (!res.ok) {
        // Handle non-200 status
        setChatHistory((prev) => [
          ...prev,
          { type: "bot", message: data || "Something went wrong. Please try again." },
        ]);
        return;
      }

      // Set the chat history with the AI's text response
      setChatHistory((prev) => [...prev, { type: "bot", message: data }]);
    } catch (err) {
      console.error("Error:", err);
      setChatHistory((prev) => [...prev, { type: "bot", message: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className={`w-full h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-purple-800 via-indigo-600 to-blue-500 text-white"} p-4 sm:p-8`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div className="flex justify-between items-center mb-4 sm:mb-6">
        <motion.h1
          className="text-3xl sm:text-5xl font-extrabold flex items-center space-x-4"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <FaRobot className="text-4xl sm:text-6xl" />
          <span>AsbinAI Chat</span>
        </motion.h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 sm:p-3 bg-white text-indigo-600 rounded-full shadow-lg transition-transform duration-300 hover:scale-110 focus:outline-none"
        >
          <FaMoon className="text-xl sm:text-2xl" />
        </button>
      </motion.div>

      <div
        ref={chatContainerRef}
        className={`flex flex-col flex-grow overflow-y-auto ${darkMode ? "bg-gray-800" : "bg-white/10"} p-4 sm:p-6 rounded-lg shadow-lg space-y-4 sm:space-y-6 scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-gray-700 hover:scrollbar-thumb-indigo-400 transition-all`}
      >
        {chatHistory.map((chat, index) => (
          <motion.div
            key={index}
            className={`p-3 sm:p-4 rounded-lg shadow-md flex flex-col gap-5 max-w-[75%] sm:max-w-[70%] ${chat.type === "user" ? (darkMode ? "bg-indigo-700 text-white" : "bg-indigo-500 text-white") : (darkMode ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800")} ${chat.type === "user" ? "self-end" : "self-start"}`}
            initial={{ opacity: 0, x: chat.type === "user" ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {chat.type === "bot" ? (
              <ReactMarkdown>{chat.message}</ReactMarkdown>
            ) : (
              <span>{chat.message}</span>
            )}
          </motion.div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center mt-4 sm:mt-6 space-x-2 sm:space-x-4">
        <motion.textarea
          rows={1}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className={`flex-grow p-3 sm:p-4 ${darkMode ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"} rounded-lg shadow-lg border-none outline-none resize-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        />
        <motion.button
          type="submit"
          disabled={loading}
          className={`p-3 sm:p-4 ${darkMode ? "bg-gray-700 text-indigo-400" : "bg-white text-indigo-600"} font-bold rounded-full shadow-lg cursor-pointer transition-transform duration-300 hover:scale-110 disabled:opacity-50 flex items-center justify-center`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? <FaSpinner className="animate-spin text-xl sm:text-2xl" /> : <FaPaperPlane className="text-xl sm:text-2xl" />}
        </motion.button>
      </form>
    </motion.div>
  );
}
