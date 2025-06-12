import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

interface SimpleMessagingSystemProps {
  userType: "homeowner" | "tradie";
  userId: string;
  userName: string;
  userAvatar: string;
}

const SimpleMessagingSystem: React.FC<SimpleMessagingSystemProps> = ({
  userType,
  userId,
  userName,
  userAvatar,
}) => {
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("conversationId");
  const jobId = searchParams.get("jobId");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const isTradie = userType === "tradie";
  const isOnlyAutoMessage =
    messages.length === 1 && messages[0].sender_id === userId;
  const lockForTradie = isTradie && isOnlyAutoMessage;

  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) return;

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (!error) {
        setMessages(data || []);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      }
    };

    fetchMessages();

    if (conversationId) {
      const channel = supabase
        .channel(`messages-${conversationId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `conversation_id=eq.${conversationId}`,
          },
          (payload) => {
            setMessages((prev) => [...prev, payload.new as Message]);
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [conversationId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !userId || !conversationId) return;

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: userId,
      message: newMessage.trim(),
      is_read: false,
    });

    if (!error) setNewMessage("");
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {jobId && (
        <div className="text-xs text-muted-foreground mb-2">
          Chat related to Job ID: <span className="font-semibold">{jobId}</span>
        </div>
      )}

      <div className="h-[500px] overflow-y-auto border rounded bg-white p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`my-2 max-w-sm px-4 py-2 rounded-lg text-sm ${
              msg.sender_id === userId
                ? "bg-red-100 ml-auto text-right"
                : "bg-gray-100"
            }`}
          >
            {msg.message}
          </div>
        ))}
        {lockForTradie && (
          <div className="text-center text-sm text-muted-foreground mt-4">
            You've sent your intro. Please wait for the Centra Resident to reply.
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 mt-4">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={lockForTradie}
        />
        <Button onClick={handleSend} disabled={!newMessage.trim() || lockForTradie}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default SimpleMessagingSystem;
