import React, { useEffect, useState, useRef } from "react";
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

interface Conversation {
  id: string;
  job_id: string;
  homeowner_id: string;
  tradie_id: string;
}

interface Props {
  userId: string;
  userType: "tradie" | "homeowner";
  userName: string;
  userAvatar?: string;
}

const SimpleMessagingSystem = ({ userId, userType, userName, userAvatar }: Props) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId) return;

    const loadConversations = async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .or(`homeowner_id.eq.${userId},tradie_id.eq.${userId}`)
        .order("created_at", { ascending: false });

      if (!error && data) setConversations(data);
    };

    loadConversations();
  }, [userId]);

  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", selectedConversation.id)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(data);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel(`conversation-${selectedConversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedConversation.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    await supabase.from("messages").insert({
      conversation_id: selectedConversation.id,
      sender_id: userId,
      message: newMessage.trim(),
    });

    setNewMessage("");
  };

  const isFirstMessageOnly = messages.length === 1 && messages[0]?.sender_id === userId;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white border rounded p-4 h-[500px] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-2">Conversations</h2>
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => setSelectedConversation(conv)}
            className={`cursor-pointer p-2 rounded mb-2 border ${
              selectedConversation?.id === conv.id ? "bg-primary/10" : "hover:bg-muted"
            }`}
          >
            Job #{conv.job_id}
          </div>
        ))}
      </div>

      <div className="md:col-span-2">
        <div className="bg-white border rounded p-4 h-[500px] flex flex-col">
          {selectedConversation ? (
            <>
              <div className="flex-1 overflow-y-auto">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`my-2 max-w-sm px-4 py-2 rounded-lg ${
                      msg.sender_id === userId ? "bg-blue-100 ml-auto" : "bg-gray-100"
                    }`}
                  >
                    {msg.message}
                  </div>
                ))}
                {isFirstMessageOnly && (
                  <div className="text-center text-muted-foreground text-sm mt-4">
                    You've sent a message. Wait for the Centra Resident to reply to unlock the chat.
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              <div className="flex gap-2 mt-4">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  disabled={isFirstMessageOnly && userType === "tradie"}
                />
                <Button
                  onClick={handleSend}
                  disabled={!newMessage.trim() || (isFirstMessageOnly && userType === "tradie")}
                >
                  Send
                </Button>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-sm">Select a conversation to view messages.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleMessagingSystem;
