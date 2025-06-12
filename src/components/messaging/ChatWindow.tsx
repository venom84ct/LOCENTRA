import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ChatWindow = ({ conversation, user, userType }: any) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversation.id)
        .order("created_at", { ascending: true });

      setMessages(data || []);
    };

    fetchMessages();

    const channel = supabase
      .channel(`chat:${conversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation.id]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messagePayload = {
      conversation_id: conversation.id,
      sender_id: user.id,
      text: newMessage,
      is_read: false,
      tradie_id: userType === "tradie" ? user.id : conversation.tradie_id,
      homeowner_id: userType === "centraResident" ? user.id : conversation.homeowner_id,
    };

    await supabase.from("messages").insert(messagePayload);
    setNewMessage("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const filePath = `${conversation.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("chat-images")
      .upload(filePath, file);

    if (error) {
      console.error("Upload failed:", error.message);
      return;
    }

    const { data } = supabase.storage
      .from("chat-images")
      .getPublicUrl(filePath);

    const messagePayload = {
      conversation_id: conversation.id,
      sender_id: user.id,
      image_url: data.publicUrl,
      is_read: false,
      tradie_id: userType === "tradie" ? user.id : conversation.tradie_id,
      homeowner_id: userType === "centraResident" ? user.id : conversation.homeowner_id,
    };

    await supabase.from("messages").insert(messagePayload);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded ${msg.sender_id === user.id ? "bg-blue-100" : "bg-white"}`}
          >
            {msg.text && <p>{msg.text}</p>}
            {msg.image_url && (
              <img
                src={msg.image_url}
                alt="chat upload"
                className="max-w-xs mt-2 rounded"
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex p-4 border-t bg-white gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          hidden
        />
        <Button onClick={() => fileInputRef.current?.click()}>📷</Button>
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
};

export default ChatWindow;
