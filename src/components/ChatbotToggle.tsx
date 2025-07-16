import { Bot, MessageCircle } from "lucide-react";
import React, { useState } from "react";
import Chatbot from "./Chatbot";
import { Button } from "./ui/button";

export const ChatbotToggle: React.FC = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleMinimize = () => {
    setIsMinimized(true);
    setIsChatbotOpen(false);
  };

  const handleRestore = () => {
    setIsMinimized(false);
    setIsChatbotOpen(true);
  };

  return (
    <>
      {!isChatbotOpen && !isMinimized && (
        <Button
          size="icon"
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-4 right-4 w-14 h-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 z-40 transition-all duration-300 hover:scale-110"
        >
          <Bot className="w-6 h-6 text-white animate-bounce" />
        </Button>
      )}

      {isMinimized && (
        <Button
          size="icon"
          onClick={handleRestore}
          className="fixed bottom-4 right-4 w-12 h-12 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 z-40 transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="w-5 h-5 text-white" />
        </Button>
      )}

      <Chatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        isMinimized={isMinimized}
        onMinimize={handleMinimize}
      />
    </>
  );
};

export default ChatbotToggle;
