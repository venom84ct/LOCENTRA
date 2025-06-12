import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";

const MessagesPage = () => {
  const [userId, setUserId] = useState<string>("");
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState<any>(null);

  const markMessagesAsRead = async () => {
    if (!selectedConversation?.id || !userId) return;
    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("conversation_id", selectedConversation.id)
      .neq("sender_id", userId)
      .eq("is_read", false);
  };

  useEffect(() => {
    const fetchUserAndConversations = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: profileData } = await supabase
        .from("profile_centra_tradie")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      const { data, error } = await supabase
        .from("conversations")
        .select(`*, jobs(id, title, assigned_tradie), profile_centra_resident(first_name, avatar_url)`)
        .eq("tradie_id", user.id);

      if (!error) setConversations(data || []);
    };

    fetchUserAndConversations();
  }, []);

  useEffect(() => {
    if (!selectedConversation?.id) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", selectedConversation.id)
        .order("created_at", { ascending: true });

      if (!error) {
        setMessages(data || []);
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        markMessagesAsRead();
      }
    };

    fetchMessages();

    const channel = supabase
      .channel(`messages-${selectedConversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedConversation.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
          markMessagesAsRead();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation]);

  const handleSend = async () => {
    if (!newMessage.trim() || !userId || !selectedConversation) return;

    const { error } = await supabase.from("messages").insert({
      conversation_id: selectedConversation.id,
      sender_id: userId,
      message: newMessage.trim(),
    });

    if (!error) {
      setNewMessage("");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId || !selectedConversation?.id) return;

    const ext = file.name.split(".").pop();
    const filePath = `chat-images/${selectedConversation.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("chat-images")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Image upload failed:", uploadError.message);
      return;
    }

    const { data } = supabase.storage.from("chat-images").getPublicUrl(filePath);

    await supabase.from("messages").insert({
      conversation_id: selectedConversation.id,
      sender_id: userId,
      image_url: data.publicUrl,
    });

    e.target.value = "";
  };

  const deleteConversation = async (id: string) => {
    const { error } = await supabase.from("conversations").delete().eq("id", id);
    if (!error) {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (selectedConversation?.id === id) {
        setSelectedConversation(null);
        setMessages([]);
      }
    }
  };

  const job = selectedConversation?.jobs;
  const isAssignedToTradie = job?.assigned_tradie === userId;
  const isUnassigned = !job?.assigned_tradie;
  const hasReceivedReply = messages.some((msg) => msg.sender_id !== userId);
  const canMessage = isAssignedToTradie || (isUnassigned && hasReceivedReply);

  return (
    <DashboardLayout userType="tradie" user={profile}>
      <div className="p-6 flex space-x-6">
        {/* Conversation List */}
        <div className="w-1/3 border rounded p-4 bg-white h-[600px] overflow-y-auto">
          <h2 className="font-semibold text-lg mb-4">Conversations</h2>
          {conversations.map((convo) => (
            <div
              key={convo.id}
              onClick={() => setSelectedConversation(convo)}
              className={`p-2 rounded cursor-pointer mb-2 flex items-center justify-between ${
                selectedConversation?.id === convo.id
                  ? "bg-red-100 text-black"
                  : "hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={convo.profile_centra_resident?.avatar_url} />
                  <AvatarFallback>
                    {convo.profile_centra_resident?.first_name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium">
                    {convo.profile_centra_resident?.first_name || "Unknown"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Job: {convo.jobs?.title || "No title"}
                  </div>
                </div>
              </div>
              <Trash2
                className="h-4 w-4 text-gray-500 hover:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConversation(convo.id);
                }}
              />
            </div>
          ))}
        </div>

        {/* Messages Panel */}
        <div className="flex-1 border rounded p-4 bg-white h-[600px] flex flex-col">
          <h2 className="font-semibold text-lg mb-2">Messages</h2>
          <div className="flex-1 overflow-y-auto space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender_id === userId ? "bg-red-100 ml-auto" : "bg-gray-100"
                }`}
              >
                {msg.message && <div>{msg.message}</div>}
                {msg.image_url && (
                  <img
                    src={msg.image_url}
                    alt="chat upload"
                    className="mt-2 rounded max-w-xs border"
                  />
                )}
              </div>
            ))}
            {!canMessage && (
              <div className="text-center text-muted-foreground text-sm mt-4">
                You cannot message anymore. The job has been assigned to another tradie.
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="mt-4 flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={!canMessage}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              hidden
              onChange={handleImageUpload}
            />
            <Button onClick={() => fileInputRef.current?.click()} disabled={!canMessage}>📷</Button>
            <Button onClick={handleSend} disabled={!newMessage.trim() || !canMessage}>
              Send
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
