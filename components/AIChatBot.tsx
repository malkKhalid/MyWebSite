
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { generateAIResponse } from '../services/geminiService';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIChatBot: React.FC = () => {
  const { language, knowledgeBase, addPendingQuestion, settings } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    {
      role: 'ai',
      text: language === 'ar'
        ? 'مرحباً! أنا المساعد الذكي ل م. ملك البنا. كيف يمكنني مساعدتك اليوم ؟'
        : 'Hello! I am Malk\'s AI Assistant. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    // Pass settings.aiContext to the service
    const result = await generateAIResponse(userMsg, knowledgeBase, language, settings.aiContext);

    setIsLoading(false);

    if (result.confidence) {
      setMessages(prev => [...prev, { role: 'ai', text: result.text }]);
    } else {
      // Fallback: Add to pending questions which triggers notification
      addPendingQuestion(userMsg);
      const fallbackMsg = language === 'ar'
        ? "أعتذر، ليس لدي إجابة دقيقة لهذا السؤال حالياً. لقد قمت بتدوين سؤالك وإرساله لم. ملك البنا وسيتم الرد عليك قريباً."
        : "I apologize, I don't have that specific information right now. I've sent your question to Eng. Malk and he will review it soon.";
      setMessages(prev => [...prev, { role: 'ai', text: fallbackMsg }]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 ${language === 'ar' ? 'left-6' : 'right-6'} z-40 bg-maroon text-white p-4 rounded-full shadow-lg shadow-maroon/30 flex items-center justify-center gap-2 group border border-lavender/50`}
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-lavender opacity-0 group-hover:opacity-20 animate-pulse transition-opacity"></div>
        <Bot className="w-6 h-6" />
        <span className="hidden md:inline font-medium text-sm">
          {language === 'ar' ? 'اسأل المساعد الذكي' : 'Ask AI Assistant'}
        </span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bottom-24 ${language === 'ar' ? 'left-4 sm:left-6' : 'right-4 sm:right-6'} z-50 w-[90vw] sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[500px]`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-maroon to-[#6b0b28] p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Bot className="w-6 h-6" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full border border-maroon"></div>
                </div>
                <div>
                  <h3 className="font-bold text-sm">Malk's AI</h3>
                  <p className="text-[10px] opacity-80 flex items-center gap-1">
                    <span className="w-1 h-1 bg-white rounded-full animate-pulse"></span>
                    Powered by Gemini
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${msg.role === 'user'
                    ? 'bg-maroon text-white rounded-br-none'
                    : 'bg-white text-anthracite dark:text-black border border-gray-100 rounded-bl-none'
                    }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                    <Loader2 className="w-5 h-5 animate-spin text-lavender" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={language === 'ar' ? 'اكتب سؤالك هنا...' : 'Type your question...'}
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-maroon focus:ring-1 focus:ring-maroon focus:outline-none text-sm transition-all"
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={`absolute top-1/2 -translate-y-1/2 ${language === 'ar' ? 'left-2' : 'right-2'} p-2 rounded-lg transition-colors ${input.trim() && !isLoading ? 'text-maroon hover:bg-maroon/10' : 'text-gray-300'
                    }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatBot;
