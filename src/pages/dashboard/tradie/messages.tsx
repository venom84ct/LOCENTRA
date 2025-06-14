import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

const TradieMessagesPage = () => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserId(data.user.id);
        setUser(data.user);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchConversations = async () => {
      const { data } = await supabase
        .from("conversations")
        .select(`id, jobs(title), profile_centra_resident(id, first_name, avatar_url)`)
        .eq("tradie_id", userId);

      if (data) {
        setConversations(data);
        const defaultConvoId = searchParams.get("conversationId");
        const defaultConvo = data.find((c) => c.id === defaultConvoId);
        if (defaultConvo) setSelectedConversation(defaultConvo);
      }
    };

    fetchConversations();
  }, [userId]);

  useEffect(() => {
    if (!selectedConversation?.id) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", selectedConversation.id)
        .order("created_at", { ascending: true });

      if (data) {
        setMessages(data);
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });

        // Mark messages as read
        await supabase
          .from("messages")
          .update({ is_read: true })
          .eq("conversation_id", selectedConversation.id)
          .neq("sender_id", userId);

        // Update tradie_read_at timestamp
        await supabase
          .from("conversations")
          .update({ tradie_read_at: new Date().toISOString() })
          .eq("id", selectedConversation.id);
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
  }, [selectedConversation, userId]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    await supabase.from("messages").insert({
      conversation_id: selectedConversation.id,
      sender_id: userId,
      message: newMessage.trim(),
    });

    setNewMessage("");
  };

  const deleteConversation = async (id) => {
    await supabase.from("conversations").delete().eq("id", id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (selectedConversation?.id === id) {
      setSelectedConversation(null);
      setMessages([]);
    }
  };

  return (
    <DashboardLayout userType="tradie" user={user}>
      <div className="p-6 flex space-x-6">
        {/* Sidebar */}
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
                  <AvatarImage
                    src={
                      convo.profile_centra_resident?.avatar_url ||
                      `https://robohash.org/${convo.profile_centra_resident?.id}`
                    }
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
                    Job: {convo.jobs?.title || "Untitled"}
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

        {/* Message Panel */}
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
                {msg.message}
                {msg.image_url && (
                  <img
                    src={msg.image_url}
                    alt="attachment"
                    className="mt-2 rounded max-w-xs"
                  />
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="mt-4 flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={!selectedConversation}
            />
            <Button
              onClick={handleSend}
              disabled={!newMessage.trim() || !selectedConversation}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TradieMessagesPage;
