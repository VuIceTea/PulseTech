"use client";

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [localInput, setLocalInput] = useState('');
  const { messages, sendMessage, status, error } = useChat();
  const isLoading = status === 'streaming' || status === 'submitted';
  
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localInput.trim() || isLoading) return;
    sendMessage({ role: 'user', parts: [{ type: 'text', text: localInput }] });
    setLocalInput('');
  };
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <>
      {/* Nút bấm mở chat nổi */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform hover:scale-110 active:scale-95 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Mở chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Cửa sổ chat */}
      <div
        className={`fixed bottom-6 right-6 z-50 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 sm:w-[400px] ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 pointer-events-none opacity-0'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-red-600 px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Trợ lý PulseTech</h3>
              <p className="text-xs text-red-100">Luôn sẵn sàng hỗ trợ bạn</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-1 text-red-100 hover:bg-white/20 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Khung chat */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-3">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                <Bot className="w-8 h-8" />
              </div>
              <p className="text-sm">Xin chào! Mình là trợ lý AI của PulseTech.<br/>Bạn cần tư vấn sản phẩm gì hôm nay?</p>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${m.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                  {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-sm'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
                  }`}
                >
                  {m.parts ? m.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') : ''}
                </div>
              </div>
            ))
          )}
          {error && (
            <div className="flex justify-center my-2 text-xs text-red-500 bg-red-50 p-2 rounded-lg border border-red-200 text-center">
              Lỗi AI: {error.message || error.toString()}<br/>Hãy tắt Terminal (Ctrl+C) và gõ "npm run dev" để khởi động lại!
            </div>
          )}
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
              <div className="flex items-center bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-2 shadow-sm text-gray-400">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Khung nhập text */}
        <form onSubmit={onSubmit} className="border-t border-gray-100 bg-white p-3">
          <div className="flex items-end gap-2 bg-gray-50 rounded-xl border border-gray-200 p-1 focus-within:border-red-300 focus-within:ring-2 focus-within:ring-red-100 transition-all">
            <input
              className="flex-1 max-h-32 min-h-10 w-full resize-none bg-transparent px-3 py-2 text-sm text-gray-800 outline-none"
              placeholder="Nhắn tin cho trợ lý..."
              value={localInput}
              onChange={(e) => setLocalInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !localInput.trim()}
              className="mb-1 mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-600 text-white shadow-sm transition-colors hover:bg-red-700 disabled:bg-gray-300 disabled:text-gray-500"
            >
              <Send className="h-4 w-4 ml-0.5" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
