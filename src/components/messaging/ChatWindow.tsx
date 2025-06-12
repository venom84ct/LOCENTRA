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
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversation.id}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation.id]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    await supabase.from("messages").insert({
      conversation_id: conversation.id,
      sender_id: user.id,
      message: newMessage.trim(),
      is_read: false,
    });

    setNewMessage("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const filePath = `${conversation.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("chat-images")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload failed:", uploadError.message);
      return;
    }

    const { data: publicData } = supabase.storage
      .from("chat-images")
      .getPublicUrl(filePath);

    if (!publicData?.publicUrl) {
      console.error("Failed to get public URL");
      return;
    }

    await supabase.from("messages").insert({
      conversation_id: conversation.id,
      sender_id: user.id,
      image_url: publicData.publicUrl,
      is_read: false,
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded max-w-[75%] ${
              msg.sender_id === user.id ? "bg-blue-100 ml-auto" : "bg-white"
            }`}
          >
            {msg.message && <p>{msg.message}</p>}
            {msg.image_url && (
              <img
                src={msg.image_url}
                alt="sent"
                className="max-w-xs rounded mt-2 border"
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
