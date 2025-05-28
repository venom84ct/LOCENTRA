import React, { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface Contact {
  id: string;
  name: string;
  avatar_url: string;
}

interface Conversation {
  id: string;
  contact: Contact;
  messages: Message[];
}

const SimpleMessagingSystem: React.FC = () => {
  const supabase = useSupabaseClient();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Simulated fetch logic
    const fetchConversations = async () => {
      // Replace this with real Supabase fetch logic
      setConversations([
        {
          id: "1",
          contact: {
            id: "u1",
            name: "John Smith",
            avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
          },
          messages: [
            {
              id: "m1",
              sender_id: "u1",
              content: "Hi, can you quote me?",
              created_at: new Date().toISOString(),
            },
          ],
        },
      ]);
    };
    fetchConversations();
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selected) return;

    const msg: Message = {
      id: Date.now().toString(),
      sender_id: "current_user_id", // Replace with actual sender ID
      content: newMessage.trim(),
      created_at: new Date().toISOString(),
    };

    const updated = {
      ...selected,
      messages: [...selected.messages, msg],
    };

    setConversations((prev) =>
      prev.map((conv) => (conv.id === updated.id ? updated : conv))
    );
    setNewMessage("");
  };

  return (
    <div className="flex border rounded-lg h-[80vh] overflow-hidden">
      {/* Contacts List */}
      <div className="w-1/3 bg-white border-r overflow-y-auto">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
              selected?.id === conv.id ? "bg-gray-100" : ""
            }`}
            onClick={() => setSelected(conv)}
          >
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={conv.contact.avatar_url} />
                <AvatarFallback>{conv.contact.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{conv.contact.name}</p>
                <p className="text-xs text-gray-500">
                  {conv.messages[conv.messages.length - 1]?.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Thread */}
      <div className="w-2/3 flex flex-col bg-gray-50">
        <div className="flex-1 p-4 overflow-y-auto space-y-2">
          {selected?.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender_id === "current_user_id"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`p-2 rounded-lg text-sm ${
                  msg.sender_id === "current_user_id"
                    ? "bg-blue-500 text-white"
                    : "bg-white border"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        {selected && (
          <div className="p-4 border-t flex space-x-2">
            <Textarea
              className="flex-1"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button onClick={sendMessage}>
              <MessageSquare className="mr-1 h-4 w-4" />
              Send
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleMessagingSystem;
