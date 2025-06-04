// src/pages/dashboard/tradie/messages.tsx
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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

const TradieMessagesPage = () => {
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("conversationId");
  const jobId = searchParams.get("jobId");
  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(conversationId);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id || null);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchConversations = async () => {
      const { data } = await supabase
        .from("conversations")
        .select("*")
        .eq("tradie_id", userId)
        .order("created_at", { ascending: false });
      setConversations(data || []);
    };

    fetchConversations();
  }, [userId]);

  useEffect(() => {
    if (!selectedConversationId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", selectedConversationId)
        .order("created_at", { ascending: true });

      if (error) console.error(error.message);
      else setMessages(data || []);

      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    fetchMessages();

    const channel = supabase
      .channel(`messages-${selectedConversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${selectedConversationId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversationId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !userId || !selectedConversationId) return;

    const { error } = await supabase.from("messages").insert({
      conversation_id: selectedConversationId,
      sender_id: userId,
      message: newMessage.trim(),
    });

    if (!error) setNewMessage("");
  };

  const isWaitingReply =
    messages.length === 1 && messages[0]?.sender_id === userId;

  return (
    <DashboardLayout userType="tradie">
      <div className="flex min-h-[600px] border rounded bg-white overflow-hidden">
        {/* Conversation List */}
        <aside className="w-64 border-r p-4 overflow-y-auto bg-gray-50">
          <h2 className="text-lg font-semibold mb-4">Conversations</h2>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedConversationId(conv.id)}
              className={`p-2 rounded cursor-pointer text-sm ${
                selectedConversationId === conv.id
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              Job ID: {conv.job_id}
            </div>
          ))}
        </aside>

        {/* Message Panel */}
        <main className="flex-1 flex flex-col p-4">
          <div className="border-b pb-2 mb-2">
            <h1 className="text-xl font-bold">Messages</h1>
            {jobId && (
              <p className="text-xs text-muted-foreground">
                Chat related to Job ID: <span className="font-medium">{jobId}</span>
              </p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-sm px-4 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                  msg.sender_id === userId
                    ? "bg-red-100 ml-auto"
                    : "bg-gray-100"
                }`}
              >
                {msg.message}
              </div>
            ))}

            {isWaitingReply && (
              <div className="text-center text-sm text-muted-foreground mt-4">
                You’ve sent a message. To unlock the chat, please wait for the Centra Resident to reply.
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="flex mt-4 gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <Button onClick={handleSend} disabled={!newMessage.trim()}>
              Send
            </Button>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default TradieMessagesPage;
