import {
  AlertCircle,
  Bot,
  HelpCircle,
  Loader2,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  Send,
  Square,
  User,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useTenant } from "../contexts/TenantContext";
import { useIsMobile } from "../hooks/use-mobile";
import {
  aiService,
  ChatMessage,
  TicketSuggestion,
} from "../services/aiService";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

type ChatbotSize = "normal" | "expanded" | "fullpage";

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized?: boolean;
  onMinimize?: () => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({
  isOpen,
  onClose,
  isMinimized: _isMinimized = false,
  onMinimize,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingTicket, setPendingTicket] = useState<TicketSuggestion | null>(
    null
  );
  const [chatbotSize, setChatbotSize] = useState<ChatbotSize>("normal");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { currentTenant } = useTenant();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isOpen && user?.id) {
      loadChatHistory();
    }
  }, [isOpen, user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-expand on mobile for better UX
  useEffect(() => {
    if (isMobile && isOpen && chatbotSize === "normal") {
      setChatbotSize("expanded");
    }
  }, [isMobile, isOpen, chatbotSize]);

  const loadChatHistory = async () => {
    if (!user?.id) return;

    try {
      const history = await aiService.getChatHistory(user.id);
      setMessages(history);
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const saveChatHistory = async (newMessages: ChatMessage[]) => {
    if (!user?.id) return;

    try {
      await aiService.saveChatHistory(user.id, newMessages);
    } catch (error) {
      console.error("Error saving chat history:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText || inputMessage.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: text,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Add typing indicator
      const typingMessage: ChatMessage = {
        id: "typing",
        type: "assistant",
        content: "",
        timestamp: new Date(),
        isTyping: true,
      };
      setMessages([...newMessages, typingMessage]);

      // Generate AI response
      const response = await aiService.generateResponse(text, messages);

      // Remove typing indicator and add actual response
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response,
        timestamp: new Date(),
      };

      const finalMessages = [...newMessages, aiMessage];
      setMessages(finalMessages);
      await saveChatHistory(finalMessages);

      // Check if this might be a ticket
      const ticketSuggestion = aiService.analyzeForTicket(text);
      if (ticketSuggestion && ticketSuggestion.confidence > 0.3) {
        setPendingTicket(ticketSuggestion);
      }
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };

      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);
      await saveChatHistory(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const createTicket = async () => {
    if (!pendingTicket || !user?.id || !currentTenant?.id) return;

    try {
      const ticketId = await aiService.createTicket(
        currentTenant.id,
        user.id,
        pendingTicket
      );

      toast.success("Ticket created successfully!", {
        description: `Ticket #${ticketId} has been created and assigned to the appropriate team.`,
      });

      const confirmMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "assistant",
        content: `Great! I've created ticket #${ticketId} for your ${pendingTicket.category.toLowerCase()} issue. The ticket has been assigned ${
          pendingTicket.priority
        } priority and will be handled by the appropriate team.`,
        timestamp: new Date(),
      };

      const finalMessages = [...messages, confirmMessage];
      setMessages(finalMessages);
      await saveChatHistory(finalMessages);
      setPendingTicket(null);
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Failed to create ticket", {
        description:
          "Please try again or create a ticket manually from the Complaints section.",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "How do I pay maintenance fees?",
    "How do I book the gym?",
    "How do I register a visitor?",
    "How do I raise a complaint?",
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getSizeClasses = () => {
    // On mobile, always use full width except for normal size
    if (isMobile) {
      switch (chatbotSize) {
        case "normal":
          return "w-full max-w-[95vw] h-[500px] max-h-[70vh] bottom-16 left-2 right-2";
        case "expanded":
        case "fullpage":
          return "w-screen h-screen bottom-0 left-0 right-0 rounded-none";
        default:
          return "w-full max-w-[95vw] h-[500px] max-h-[70vh] bottom-16 left-2 right-2";
      }
    }

    // Desktop sizes
    switch (chatbotSize) {
      case "normal":
        return "w-96 h-[500px] bottom-16 right-4";
      case "expanded":
        return "w-[500px] h-[700px] bottom-16 right-4";
      case "fullpage":
        return "w-screen h-screen bottom-0 right-0 rounded-none";
      default:
        return "w-96 h-[500px] bottom-16 right-4";
    }
  };

  const getContentClasses = () => {
    switch (chatbotSize) {
      case "fullpage":
        return "max-w-4xl mx-auto";
      default:
        return "";
    }
  };

  const toggleSize = () => {
    const sizes: ChatbotSize[] = ["normal", "expanded", "fullpage"];
    const currentIndex = sizes.indexOf(chatbotSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    setChatbotSize(sizes[nextIndex]);
  };

  const formatMessage = (content: string) => {
    return content.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed ${
        chatbotSize === "fullpage"
          ? "inset-0 z-50 bg-black/50 backdrop-blur-sm"
          : ""
      } transition-all duration-300`}
    >
      <Card
        className={`fixed ${getSizeClasses()} shadow-2xl border-0 bg-white dark:bg-gray-900 z-50 transition-all duration-300 ease-in-out ${
          chatbotSize === "fullpage" ? "border-none" : "rounded-xl"
        } ${
          isMobile && chatbotSize !== "fullpage" ? "mx-2" : ""
        } flex flex-col overflow-hidden`}
      >
        <CardHeader className="pb-3 pt-3 px-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Bot className="w-5 h-5 text-blue-600" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  AI Assistant
                </CardTitle>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Always here to help
                </p>
              </div>
              <Badge
                variant="secondary"
                className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                BETA
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSize}
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                title={`Switch to ${
                  chatbotSize === "normal"
                    ? "expanded"
                    : chatbotSize === "expanded"
                    ? "fullpage"
                    : "normal"
                } view`}
              >
                {chatbotSize === "normal" ? (
                  <Maximize2 className="w-4 h-4" />
                ) : chatbotSize === "expanded" ? (
                  <Square className="w-4 h-4" />
                ) : (
                  <Minimize2 className="w-4 h-4" />
                )}
              </Button>
              {onMinimize && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMinimize}
                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                  title="Minimize"
                >
                  <Minus className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900 text-red-600"
                title="Close"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent
          className={`p-0 flex flex-col ${getContentClasses()} h-full overflow-hidden`}
        >
          <div className="flex-1 overflow-hidden">
            <ScrollArea
              className={`h-full ${
                chatbotSize === "fullpage" ? "px-6" : "px-4"
              }`}
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <div className="relative mb-4">
                    <Bot className="w-16 h-16 text-blue-600 animate-pulse" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                    </div>
                  </div>
                  <h3 className="font-bold text-xl text-gray-800 dark:text-gray-200 mb-2">
                    {getGreeting()}! Welcome to AI Assistant
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                    I'm here to help you with society management questions,
                    create tickets for issues, and provide instant support 24/7.
                  </p>
                  <div className="w-full max-w-md">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-3">
                      Try asking me about:
                    </p>
                    <div className="grid gap-2">
                      {quickQuestions.map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs h-10 justify-start hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                          onClick={() => sendMessage(question)}
                        >
                          <HelpCircle className="w-4 h-4 mr-2 text-blue-600" />
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 py-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.type === "user"
                          ? "flex-row-reverse"
                          : "flex-row"
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                          message.type === "user"
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                            : "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {message.type === "user" ? (
                          <User className="w-5 h-5" />
                        ) : (
                          <Bot className="w-5 h-5" />
                        )}
                      </div>
                      <div
                        className={`flex-1 ${
                          message.type === "user" ? "text-right" : "text-left"
                        }`}
                      >
                        <div
                          className={`inline-block p-4 rounded-2xl max-w-md shadow-sm ${
                            message.type === "user"
                              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                              : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          {message.isTyping ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span className="text-sm">Typing...</span>
                            </div>
                          ) : (
                            <p className="text-sm leading-relaxed">
                              {formatMessage(message.content)}
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>
          </div>

          {pendingTicket && (
            <div className="flex-shrink-0">
              <Separator className="bg-gradient-to-r from-yellow-200 to-yellow-300" />
              <div
                className={`${
                  chatbotSize === "fullpage" ? "mx-6" : "mx-4"
                } my-2 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-l-4 border-yellow-400 rounded-r-lg shadow-sm`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-800 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 text-sm mb-1">
                      Create Support Ticket?
                    </h4>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-2">
                      <span className="font-medium">
                        {pendingTicket.category}
                      </span>{" "}
                      •{" "}
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200">
                        {pendingTicket.priority.toUpperCase()}
                      </span>
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        onClick={createTicket}
                        className="h-7 text-xs bg-yellow-600 hover:bg-yellow-700 text-white"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Create Ticket
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPendingTicket(null)}
                        className="h-7 text-xs border-yellow-400 text-yellow-700 hover:bg-yellow-100 dark:text-yellow-300 dark:border-yellow-600"
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div
            className={`flex-shrink-0 p-3 ${
              chatbotSize === "fullpage" ? "max-w-4xl mx-auto" : ""
            }border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900`}
          >
            <div className="flex gap-2 items-center p-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 ${
                    isLoading ? "animate-pulse" : ""
                  }`}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Bot className="w-4 h-4 text-blue-600" />
                </span>
              </div>
              <Button
                size="sm"
                onClick={() => sendMessage()}
                disabled={isLoading || !inputMessage.trim()}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            {chatbotSize === "fullpage" && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Press Enter to send • AI responses are generated and may not
                always be accurate
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chatbot;
