import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

interface Conversation {
  id: string;
  job_id: string;
  homeowner_id: string;
  tradie_id: string;
  job_title?: string;
}

interface Props {
  userId: string;
  userName: string;
  userAvatar?: string;
  userType: "tradie" | "homeowner";
}

const MessagingSystem = ({ userId, userName, userAvatar, userType }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async () => {
    if (!userId) return;

    const field = userType === "tradie" ? "tradie_id" : "homeowner_id";

    const { data, error } = await supabase
      .from("conversations")
      .select("id, job_id, jobs(title)")
      .eq(field, userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading conversations", error.message);
      return;
    }

    const mapped = data.map((c) => ({
      id: c.id,
      job_id: c.job_id,
      tradie_id: c.tradie_id,
      homeowner_id: c.homeowner_id,
      job_title: c.jobs?.title || "",
    }));

    setConversations(mapped);
    if (!activeConversationId && mapped.length > 0) {
      setActiveConversationId(mapped[0].id);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading messages", error.message);
      return;
    }

    setMessages(data || []);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchConversations();
  }, [userId]);

  useEffect(() => {
    if (!activeConversationId) return;
    fetchMessages(activeConversationId);

    const channel = supabase
      .channel(`messages-${activeConversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${activeConversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConversationId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !userId || !activeConversationId) return;

    const conv = conversations.find((c) => c.id === activeConversationId);

    const { error } = await supabase.from("messages").insert({
      conversation_id: activeConversationId,
      sender_id: userId,
      message: newMessage.trim(),
      tradie_id: conv?.tradie_id ?? null,
      homeowner_id: conv?.homeowner_id ?? null,
      is_read: false,
    });

    if (!error) {
      setNewMessage("");
    }
  };

  const isFirstMessage =
    messages.length === 1 && messages[0]?.sender_id === userId;

  return (
    <div className="flex gap-6">
      {/* Conversation List */}
      <div className="w-1/3 border rounded bg-white p-4 h-[600px] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-2">Conversations</h2>
        {conversations.map((c) => (
          <div
            key={c.id}
            onClick={() => setActiveConversationId(c.id)}
            className={`p-2 mb-2 cursor-pointer rounded ${
              c.id === activeConversationId
                ? "bg-primary text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {c.job_title ? `Job: ${c.job_title}` : `Job ID: ${c.job_id}`}
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="flex-1 border rounded bg-white p-4 flex flex-col h-[600px]">
        <h2 className="text-lg font-semibold mb-2">Messages</h2>
        <div className="flex-1 overflow-y-auto space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-sm px-4 py-2 rounded-lg ${
                msg.sender_id === userId
                  ? "bg-red-100 ml-auto"
                  : "bg-gray-100"
              }`}
            >
              {msg.message}
            </div>
          ))}

          {isFirstMessage && (
            <p className="text-center text-muted-foreground text-sm mt-2">
              You’ve sent a message. To unlock the chat, please wait for the
              Centra Resident to reply.
            </p>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="flex gap-2 mt-4">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button onClick={handleSend} disabled={!newMessage.trim()}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessagingSystem;
