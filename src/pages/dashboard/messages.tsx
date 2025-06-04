import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { supabase } from "@/lib/supabaseClient";
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
  job: {
    title: string;
  };
  profile_centra_tradie: {
    first_name: string;
    avatar_url: string;
  };
}

const HomeownerMessagesPage = () => {
  const [searchParams] = useSearchParams();
  const selectedConversationId = searchParams.get("conversationId");

  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [newMessage, setNewMessage] = useState("");
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
        .select("id, job(title), profile_centra_tradie(first_name, avatar_url)")
        .eq("homeowner_id", userId);

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

      if (!error) {
        setMessages(data || []);
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    };

    fetchMessages();

    const channel = supabase
      .channel(`conversation-${selectedConversationId}`)
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

    if (!error) {
      setNewMessage("");
    }
  };

  return (
    <DashboardLayout userType="centraResident">
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sidebar */}
        <div className="col-span-1">
          <h2 className="text-lg font-semibold mb-2">Conversations</h2>
          <div className="space-y-2">
            {conversations.map((conv) => (
              <a
                key={conv.id}
                href={`/dashboard/messages?conversationId=${conv.id}`}
                className={`block p-2 rounded border ${
                  selectedConversationId === conv.id
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={conv.profile_centra_tradie?.avatar_url} />
                    <AvatarFallback>
                      {conv.profile_centra_tradie?.first_name?.[0] || "T"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {conv.profile_centra_tradie?.first_name || "Tradie"}
                    </p>
                    <p className="text-xs text-muted-foreground">Job: {conv.job?.title || "Untitled"}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Chat Panel */}
        <div className="col-span-2">
          <h2 className="text-lg font-semibold mb-2">Messages</h2>
          <div className="border rounded p-4 bg-white h-[500px] overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`my-2 max-w-sm px-4 py-2 rounded-lg ${
                  msg.sender_id === userId ? "bg-red-100 ml-auto" : "bg-gray-100"
                }`}
              >
                {msg.message}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="flex gap-2 mt-4">
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
      </div>
    </DashboardLayout>
  );
};

export default HomeownerMessagesPage;
