import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

const TradieMessagesPage = () => {
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("conversationId");
  const jobId = searchParams.get("jobId");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userAvatar, setUserAvatar] = useState<string>("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) return;

      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profile_centra_tradie")
        .select("first_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (profile) {
        setUserName(profile.first_name);
        setUserAvatar(profile.avatar_url || "");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (!error) {
        setMessages(data || []);
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    };

    fetchMessages();

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !userId || !conversationId) return;

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: userId,
      message: newMessage.trim(),
    });

    if (!error) {
      setNewMessage("");
    }
  };

  const isFirstMessage = messages.length === 1 && messages[0].sender_id === userId;

  return (
    <DashboardLayout userType="tradie">
      <div className="p-4 max-w-3xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Messages</h1>

        <div className="border rounded p-4 bg-white h-[500px] overflow-y-auto">
          {jobId && (
            <div className="text-xs text-muted-foreground mb-2">
              Chat related to Job ID: <span className="font-semibold">{jobId}</span>
            </div>
          )}

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

          {isFirstMessage && (
            <div className="text-center text-muted-foreground text-sm mt-4">
              You've sent a message. To unlock the chat, please wait for the Centra Resident to reply.
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <Button onClick={handleSend} disabled={!newMessage.trim()}>
            Send
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TradieMessagesPage;
