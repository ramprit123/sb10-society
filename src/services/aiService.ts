import axios from "axios";
import { supabase } from "../lib/supabase";

export interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
}

export interface TicketSuggestion {
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  title: string;
  description: string;
  confidence: number;
}

// Common FAQs for society management
const DEFAULT_FAQS: FAQItem[] = [
  {
    id: "1",
    question: "How do I pay maintenance fees?",
    answer:
      "You can pay maintenance fees through the Payments section in your dashboard. We accept online payments via UPI, credit card, or net banking.",
    category: "Payments",
    keywords: ["maintenance", "fee", "payment", "pay", "bill"],
  },
  {
    id: "2",
    question: "How do I book amenities like gym or club house?",
    answer:
      "Go to the Facilities section in your dashboard. Select the amenity you want to book, choose your preferred date and time, and submit your booking request.",
    category: "Facilities",
    keywords: ["book", "amenity", "gym", "club", "facilities", "reservation"],
  },
  {
    id: "3",
    question: "How do I register a visitor?",
    answer:
      "You can register visitors through the Visitor Logs section. Enter their details and expected visit time. You can also generate a visitor pass.",
    category: "Security",
    keywords: ["visitor", "guest", "register", "pass", "entry"],
  },
  {
    id: "4",
    question: "How do I raise a complaint?",
    answer:
      'Go to the Complaints section, click on "New Complaint", fill in the details including category, priority, and description. You can also attach photos if needed.',
    category: "Complaints",
    keywords: ["complaint", "issue", "problem", "report", "maintenance"],
  },
  {
    id: "5",
    question: "How do I check my maintenance bill?",
    answer:
      "Visit the Maintenance Bills section in your dashboard. You can view current and past bills, download receipts, and track payment status.",
    category: "Billing",
    keywords: ["bill", "maintenance", "receipt", "statement", "balance"],
  },
  {
    id: "6",
    question: "How do I update my contact information?",
    answer:
      "Go to Settings > Profile to update your contact information, emergency contacts, and other personal details.",
    category: "Profile",
    keywords: ["profile", "contact", "update", "phone", "email", "address"],
  },
  {
    id: "7",
    question: "What are the society rules and regulations?",
    answer:
      "You can find all society rules and regulations in the Documents section. Common rules include noise restrictions after 10 PM, parking guidelines, and pet policies.",
    category: "Rules",
    keywords: ["rules", "regulations", "policy", "guidelines", "bylaws"],
  },
  {
    id: "8",
    question: "How do I participate in society meetings?",
    answer:
      "Check the Meetings section for upcoming meetings. You can RSVP online and view meeting agendas. Virtual meetings links are also provided when available.",
    category: "Meetings",
    keywords: ["meeting", "agenda", "participate", "vote", "rsvp"],
  },
];

class AIServiceError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "AIServiceError";
  }
}

export class AIService {
  private readonly API_URL = "https://openrouter.ai/api/v1/chat/completions";
  private readonly API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "";
  private readonly MODEL = "anthropic/claude-3-haiku";

  constructor() {
    if (!this.API_KEY) {
      console.warn(
        "OpenRouter API key not found. Please set VITE_OPENROUTER_API_KEY in your environment variables."
      );
    }
  }

  // Search FAQs based on user query
  searchFAQs(query: string): FAQItem[] {
    const searchTerms = query.toLowerCase().split(" ");

    return DEFAULT_FAQS.filter((faq) => {
      const allText = `${faq.question} ${faq.answer} ${faq.keywords.join(
        " "
      )}`.toLowerCase();
      return searchTerms.some((term) => allText.includes(term));
    }).sort((a, b) => {
      // Sort by relevance (simple keyword matching)
      const aMatches = searchTerms.filter((term) =>
        `${a.question} ${a.answer} ${a.keywords.join(" ")}`
          .toLowerCase()
          .includes(term)
      ).length;
      const bMatches = searchTerms.filter((term) =>
        `${b.question} ${b.answer} ${b.keywords.join(" ")}`
          .toLowerCase()
          .includes(term)
      ).length;
      return bMatches - aMatches;
    });
  }

  // Analyze user message and suggest ticket creation
  analyzeForTicket(userMessage: string): TicketSuggestion | null {
    const message = userMessage.toLowerCase();

    // Define patterns for different complaint categories
    const patterns = {
      Plumbing: {
        keywords: [
          "water",
          "leak",
          "pipe",
          "tap",
          "drainage",
          "toilet",
          "bathroom",
          "plumbing",
        ],
        priority: "high" as const,
      },
      Electrical: {
        keywords: [
          "power",
          "electricity",
          "light",
          "switch",
          "socket",
          "wiring",
          "electrical",
        ],
        priority: "medium" as const,
      },
      Maintenance: {
        keywords: [
          "repair",
          "fix",
          "broken",
          "maintenance",
          "cleaning",
          "painting",
        ],
        priority: "medium" as const,
      },
      Security: {
        keywords: [
          "security",
          "theft",
          "noise",
          "disturbance",
          "safety",
          "guard",
        ],
        priority: "high" as const,
      },
      Parking: {
        keywords: ["parking", "car", "vehicle", "space", "occupied"],
        priority: "medium" as const,
      },
      Elevator: {
        keywords: ["elevator", "lift", "stuck", "not working"],
        priority: "urgent" as const,
      },
      Sanitation: {
        keywords: ["garbage", "waste", "cleaning", "hygiene", "dustbin"],
        priority: "high" as const,
      },
    };

    let bestMatch: {
      category: string;
      priority: "low" | "medium" | "high" | "urgent";
      confidence: number;
    } | null = null;

    for (const [category, { keywords, priority }] of Object.entries(patterns)) {
      const matchCount = keywords.filter((keyword) =>
        message.includes(keyword)
      ).length;
      const confidence = matchCount / keywords.length;

      if (
        confidence > 0.1 &&
        (!bestMatch || confidence > bestMatch.confidence)
      ) {
        bestMatch = { category, priority, confidence };
      }
    }

    if (bestMatch && bestMatch.confidence > 0.2) {
      return {
        category: bestMatch.category,
        priority: bestMatch.priority,
        title:
          userMessage.substring(0, 100) +
          (userMessage.length > 100 ? "..." : ""),
        description: userMessage,
        confidence: bestMatch.confidence,
      };
    }

    return null;
  }

  // Generate AI response using OpenRouter
  async generateResponse(
    userMessage: string,
    context: ChatMessage[] = []
  ): Promise<string> {
    try {
      if (!this.API_KEY) {
        throw new AIServiceError("OpenRouter API key not configured");
      }

      // First, search for relevant FAQs
      const relevantFAQs = this.searchFAQs(userMessage);

      // If we have relevant FAQs, use them in the response
      if (relevantFAQs.length > 0) {
        const faqContext = relevantFAQs
          .slice(0, 3)
          .map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`)
          .join("\n\n");

        return this.callOpenRouter(userMessage, faqContext, context);
      }

      // If no relevant FAQs, check if it's a ticket-worthy issue
      const ticketSuggestion = this.analyzeForTicket(userMessage);
      if (ticketSuggestion && ticketSuggestion.confidence > 0.3) {
        return `I understand you're experiencing a ${ticketSuggestion.category.toLowerCase()} issue. I can help you create a ticket for this. Would you like me to automatically create a ${
          ticketSuggestion.priority
        } priority ticket titled "${ticketSuggestion.title}"?`;
      }

      // General AI response
      return this.callOpenRouter(userMessage, "", context);
    } catch (error) {
      console.error("Error generating AI response:", error);
      throw new AIServiceError(
        "Failed to generate response. Please try again."
      );
    }
  }

  private async callOpenRouter(
    userMessage: string,
    context: string,
    chatHistory: ChatMessage[] = []
  ): Promise<string> {
    const systemPrompt = `You are a helpful AI assistant for a society management system. Your role is to:
    1. Answer questions about society management features and procedures
    2. Help residents with common issues and inquiries
    3. Provide clear, concise, and helpful responses
    4. Be friendly and professional
    
    Available features in the system include:
    - Maintenance bill payments
    - Facility bookings (gym, club house, etc.)
    - Visitor registration
    - Complaint management
    - Society announcements
    - Meeting participation
    - Resident directory
    - Security management
    
    ${context ? `Relevant FAQ Information:\n${context}\n` : ""}
    
    Keep your responses helpful, concise, and relevant to society management.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...chatHistory.slice(-5).map((msg) => ({
        role: msg.type === "user" ? "user" : "assistant",
        content: msg.content,
      })),
      { role: "user", content: userMessage },
    ];

    const response = await axios.post(
      this.API_URL,
      {
        model: this.MODEL,
        messages,
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.choices || response.data.choices.length === 0) {
      throw new AIServiceError("No response from AI service");
    }

    return response.data.choices[0].message.content;
  }

  // Create ticket automatically
  async createTicket(
    societyId: string,
    residentId: string,
    suggestion: TicketSuggestion
  ): Promise<string> {
    try {
      const { data, error } = await supabase
        .from("complaints")
        .insert({
          society_id: societyId,
          resident_id: residentId,
          title: suggestion.title,
          description: suggestion.description,
          category: suggestion.category,
          priority: suggestion.priority,
          status: "open",
          submitted_date: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return data.id;
    } catch (error) {
      console.error("Error creating ticket:", error);
      throw new AIServiceError("Failed to create ticket. Please try again.");
    }
  }

  // Get chat history for a user
  async getChatHistory(userId: string): Promise<ChatMessage[]> {
    // For now, we'll use localStorage to store chat history
    // In a production app, you might want to store this in the database
    try {
      const stored = localStorage.getItem(`chat_history_${userId}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Save chat history
  async saveChatHistory(
    userId: string,
    messages: ChatMessage[]
  ): Promise<void> {
    try {
      localStorage.setItem(`chat_history_${userId}`, JSON.stringify(messages));
    } catch (error) {
      console.error("Error saving chat history:", error);
    }
  }
}

export const aiService = new AIService();
