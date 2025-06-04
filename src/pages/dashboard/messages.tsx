import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Trash } from "lucide-react";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

interface Conversation {
  id: string;
  jobs: {
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
      const { data, error } = await supabase
        .from("conversations")
        .select("id, jobs(title), profile_centra_tradie(first_name, avatar_url)")
        .eq("homeowner_id", userId);

      if (!error) {
        setConversations(data || []);
      }
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
      .channel(`messages-${selectedConversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedConversationId}`,
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

  const handleDeleteConversation = async (id: string) => {
    await supabase.from("messages").delete().eq("conversation_id", id);
    await supabase.from("conversations").delete().eq("id", id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <DashboardLayout userType="homeowner" user={userId}>
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sidebar */}
        <div className="col-span-1">
          <h2 className="text-lg font-semibold mb-2">Conversations</h2>
          <div className="space-y-2">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`flex justify-between items-center p-2 rounded border cursor-pointer ${
                  selectedConversationId === conv.id
                    ? "bg-red-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <a
                  href={`/dashboard/messages?conversationId=${conv.id}`}
                  className="flex items-center gap-2 flex-1"
                >
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
                    <p className="text-xs text-muted-foreground">
                      Job: {conv.jobs?.title || "Untitled"}
                    </p>
                  </div>
                </a>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDeleteConversation(conv.id)}
                >
                  <Trash size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Message Panel */}
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
