import React, { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  HelpCircle,
  Tag,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  createdAt: Date;
  updatedAt: Date;
}

const categories = [
  "Payments",
  "Facilities",
  "Security",
  "Complaints",
  "Billing",
  "Profile",
  "Rules",
  "Meetings",
  "Maintenance",
  "Other",
];

const FAQ_MOCK_DATA: FAQ[] = [
  {
    id: "1",
    question: "How do I pay maintenance fees?",
    answer:
      "You can pay maintenance fees through the Payments section in your dashboard. We accept online payments via UPI, credit card, or net banking.",
    category: "Payments",
    keywords: ["maintenance", "fee", "payment", "pay", "bill"],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    question: "How do I book amenities like gym or club house?",
    answer:
      "Go to the Facilities section in your dashboard. Select the amenity you want to book, choose your preferred date and time, and submit your booking request.",
    category: "Facilities",
    keywords: ["book", "amenity", "gym", "club", "facilities", "reservation"],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "3",
    question: "How do I register a visitor?",
    answer:
      "You can register visitors through the Visitor Logs section. Enter their details and expected visit time. You can also generate a visitor pass.",
    category: "Security",
    keywords: ["visitor", "guest", "register", "pass", "entry"],
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "4",
    question: "How do I raise a complaint?",
    answer:
      'Go to the Complaints section, click on "New Complaint", fill in the details including category, priority, and description. You can also attach photos if needed.',
    category: "Complaints",
    keywords: ["complaint", "issue", "problem", "report", "maintenance"],
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "5",
    question: "What are the society rules and regulations?",
    answer:
      "You can find all society rules and regulations in the Documents section. Common rules include noise restrictions after 10 PM, parking guidelines, and pet policies.",
    category: "Rules",
    keywords: ["rules", "regulations", "policy", "guidelines", "bylaws"],
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-17"),
  },
];

const FAQManagement: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>(FAQ_MOCK_DATA);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "",
    keywords: "",
  });

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.keywords.some((keyword) =>
        keyword.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleSave = () => {
    if (!formData.question || !formData.answer || !formData.category) {
      return;
    }

    const keywords = formData.keywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k);

    if (editingFaq) {
      // Update existing FAQ
      setFaqs(
        faqs.map((faq) =>
          faq.id === editingFaq.id
            ? {
                ...faq,
                question: formData.question,
                answer: formData.answer,
                category: formData.category,
                keywords,
                updatedAt: new Date(),
              }
            : faq
        )
      );
    } else {
      // Create new FAQ
      const newFaq: FAQ = {
        id: Date.now().toString(),
        question: formData.question,
        answer: formData.answer,
        category: formData.category,
        keywords,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setFaqs([...faqs, newFaq]);
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      keywords: faq.keywords.join(", "),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setFaqs(faqs.filter((faq) => faq.id !== id));
  };

  const resetForm = () => {
    setEditingFaq(null);
    setFormData({
      question: "",
      answer: "",
      category: "",
      keywords: "",
    });
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Payments: "bg-green-100 text-green-800",
      Facilities: "bg-blue-100 text-blue-800",
      Security: "bg-red-100 text-red-800",
      Complaints: "bg-yellow-100 text-yellow-800",
      Billing: "bg-purple-100 text-purple-800",
      Profile: "bg-indigo-100 text-indigo-800",
      Rules: "bg-orange-100 text-orange-800",
      Meetings: "bg-pink-100 text-pink-800",
      Maintenance: "bg-teal-100 text-teal-800",
      Other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors["Other"];
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">FAQ Management</h1>
          <p className="text-gray-600 mt-2">
            Manage frequently asked questions for the AI chatbot
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingFaq ? "Edit FAQ" : "Add New FAQ"}
              </DialogTitle>
              <DialogDescription>
                {editingFaq
                  ? "Update the FAQ information."
                  : "Create a new frequently asked question."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  placeholder="Enter the question"
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="answer">Answer</Label>
                <Textarea
                  id="answer"
                  placeholder="Enter the answer"
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                <Input
                  id="keywords"
                  placeholder="e.g., payment, bill, maintenance, fee"
                  value={formData.keywords}
                  onChange={(e) =>
                    setFormData({ ...formData, keywords: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleDialogClose}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  {editingFaq ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Total FAQs</CardTitle>
            <CardDescription>All frequently asked questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {faqs.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Categories</CardTitle>
            <CardDescription>Different FAQ categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {new Set(faqs.map((faq) => faq.category)).size}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recently Updated</CardTitle>
            <CardDescription>FAQs updated today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {
                faqs.filter((faq) => {
                  const today = new Date();
                  const faqDate = new Date(faq.updatedAt);
                  return faqDate.toDateString() === today.toDateString();
                }).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* FAQ List */}
      <Card>
        <CardHeader>
          <CardTitle>FAQs ({filteredFaqs.length})</CardTitle>
          <CardDescription>
            Manage your frequently asked questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <HelpCircle className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-lg">
                          {faq.question}
                        </h3>
                        <Badge className={getCategoryColor(faq.category)}>
                          {faq.category}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{faq.answer}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <div className="flex flex-wrap gap-1">
                          {faq.keywords.map((keyword, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Created: {faq.createdAt.toLocaleDateString()} | Updated:{" "}
                        {faq.updatedAt.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(faq)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(faq.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredFaqs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <HelpCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No FAQs found matching your criteria.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQManagement;
