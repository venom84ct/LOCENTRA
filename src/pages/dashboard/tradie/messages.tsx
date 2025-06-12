import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  image_url?: string;
  created_at: string;
  is_read: boolean;
}

interface Conversation {
  id: string;
  jobs: {
    title: string;
  }[];
  profile_centra_resident: {
    first_name: string;
    avatar_url: string;
  }[];
}

const TradieMessagesPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedConversationId = searchParams.get("conversationId");

  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data } = await supabase.auth.getUser();
      const uid = data.user?.id || null;
      setUserId(uid);

      if (uid) {
        const { data: profileData } = await supabase
          .from("profile_centra_tradie")
          .select("*")
          .eq("id", uid)
          .single();
        setProfile(profileData);
      }
    };
    fetchUserAndProfile();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchConversations = async () => {
      const { data } = await supabase
        .from("conversations")
        .select(
          "id, jobs(title), profile_centra_resident(first_name, avatar_url)"
        )
        .eq("tradie_id", userId);

      if (data) setConversations(data as Conversation[]);
    };

    fetchConversations();
  }, [userId]);

  useEffect(() => {
    if (!selectedConversationId || !userId) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", selectedConversationId)
        .order("created_at", { ascending: true });

      if (data) {
        setMessages(data);
        await supabase
          .from("messages")
          .update({ is_read: true })
          .eq("conversation_id", selectedConversationId)
          .neq("sender_id", userId);
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
  }, [selectedConversationId, userId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !userId || !selectedConversationId) return;

    await supabase.from("messages").insert({
      conversation_id: selectedConversationId,
      sender_id: userId,
      message: newMessage.trim(),
      is_read: false,
    });

    setNewMessage("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedConversationId || !userId) return;

    const filePath = `${selectedConversationId}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("chat-images")
      .upload(filePath, file);

    if (uploadError) return console.error("Upload failed:", uploadError.message);

    const { data } = supabase.storage.from("chat-images").getPublicUrl(filePath);

    await supabase.from("messages").insert({
      conversation_id: selectedConversationId,
      sender_id: userId,
      image_url: data.publicUrl,
      is_read: false,
    });
  };

  const handleDeleteConversation = async (id: string) => {
    await supabase.from("messages").delete().eq("conversation_id", id);
    await supabase.from("conversations").delete().eq("id", id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (selectedConversationId === id) navigate("/dashboard/tradie/messages");
  };

  return (
    <DashboardLayout userType="tradie" user={profile}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sidebar */}
        <div className="col-span-1">
          <h2 className="text-lg font-semibold mb-2">Conversations</h2>
          <div className="space-y-2">
            {conversations.map((conv) => (
              <div key={conv.id} className="relative group">
                <a
                  href={`/dashboard/tradie/messages?conversationId=${conv.id}`}
                  className={`block p-2 rounded border ${
                    selectedConversationId === conv.id
                      ? "bg-[#ffe6e6] text-black"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={
                          conv.profile_centra_resident?.[0]?.avatar_url ||
                          `https://robohash.org/${conv.id}`
                        }
                      />
                      <AvatarFallback>
                        {conv.profile_centra_resident?.[0]?.first_name?.[0] || "H"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {conv.profile_centra_resident?.[0]?.first_name || "Homeowner"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Job: {conv.jobs?.[0]?.title || "Untitled"}
                      </p>
                    </div>
                  </div>
                </a>
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 hidden group-hover:inline"
                  onClick={() => handleDeleteConversation(conv.id)}
                  title="Delete conversation"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
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
                {msg.message && <p>{msg.message}</p>}
                {msg.image_url && (
                  <img
                    src={msg.image_url}
                    alt="chat image"
                    className="mt-2 max-w-xs rounded"
                  />
                )}
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
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              hidden
            />
            <Button onClick={() => fileInputRef.current?.click()}>📷</Button>
            <Button onClick={handleSend} disabled={!newMessage.trim()}>
              Send
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TradieMessagesPage;
