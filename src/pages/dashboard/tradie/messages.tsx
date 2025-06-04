import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MessagesPage = () => {
  const [userId, setUserId] = useState<string>("");
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchParams] = useSearchParams();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserAndConversations = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data, error } = await supabase
        .from("conversations")
        .select(`
          *,
          jobs(title),
          profile_centra_resident(first_name, avatar_url)
        `)
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

    if (!error) setNewMessage("");
  };

  const isFirstMessage =
    messages.length === 1 && messages[0].sender_id === userId;

  return (
    <DashboardLayout userType="tradie">
      <div className="p-6 flex space-x-6">
        {/* Conversation List */}
        <div className="w-1/3 border rounded p-4 bg-white h-[600px] overflow-y-auto">
          <h2 className="font-semibold text-lg mb-4">Conversations</h2>
          {conversations.map((convo) => (
            <div
              key={convo.id}
              onClick={() => setSelectedConversation(convo)}
              className={`p-2 rounded cursor-pointer mb-2 ${
                selectedConversation?.id === convo.id
                  ? "bg-primary text-white"
                  : "hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={convo.profile_centra_resident?.avatar_url}
                  />
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
                  msg.sender_id === userId
                    ? "bg-red-100 ml-auto"
                    : "bg-gray-100"
                }`}
              >
                {msg.message}
              </div>
            ))}

            {isFirstMessage && (
              <div className="text-center text-muted-foreground text-sm mt-4">
                You’ve sent a message. To unlock the chat, please wait for the Centra Resident to reply.
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="mt-4 flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={isFirstMessage}
            />
            <Button onClick={handleSend} disabled={!newMessage.trim() || isFirstMessage}>
              Send
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
