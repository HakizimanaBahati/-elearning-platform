import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AIChatAssistantProps {
  courseId?: number;
  lessonId?: number;
}

export function AIChatAssistant({ courseId, lessonId }: AIChatAssistantProps) {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: chatHistory = [] } = trpc.chat.getHistory.useQuery(
    { courseId },
    { enabled: !!courseId }
  );

  const sendMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
      setInput("");
      setIsLoading(false);
    },
    onError: () => {
      toast.error("Failed to send message");
      setIsLoading(false);
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatHistory.length > 0) {
      setMessages(
        chatHistory.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        }))
      );
    }
  }, [chatHistory]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    sendMutation.mutate({
      courseId,
      lessonId,
      content: userMessage,
    });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-slate-200">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <MessageCircle className="w-5 h-5 text-indigo-600" />
        <h3 className="font-semibold text-slate-900">AI Learning Assistant</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <MessageCircle className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-sm text-slate-600 mb-2">No messages yet</p>
            <p className="text-xs text-slate-500">Ask me anything about the course content!</p>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-slate-100 text-slate-900 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-900 px-4 py-2 rounded-lg rounded-bl-none">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 space-y-3">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
            className="text-sm"
          />
          <Button
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-slate-500 text-center">
          💡 Ask about concepts, get tips, or request explanations
        </p>
      </div>
    </div>
  );
}
