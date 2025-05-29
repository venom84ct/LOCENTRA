import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatWindowProps {
  conversation: any;
  currentUserId: string;
  userType: "tradie" | "centraResident";
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  currentUserId,
  userType,
}) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversation.id)
        .order("created_at");

      setMessages(data || []);
    };

    fetchMessages();

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          if (payload.new.conversation_id === conversation.id) {
            setMessages((prev) => [...prev, payload.new]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    await supabase.from("messages").insert({
      conversation_id: conversation.id,
      sender_id: currentUserId,
      text: newMessage,
    });

    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-md max-w-sm ${
              msg.sender_id === currentUserId
                ? "bg-blue-100 self-end"
                : "bg-gray-100 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="p-4 border-t flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
};

export default ChatWindow;
