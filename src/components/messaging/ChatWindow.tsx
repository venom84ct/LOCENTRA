import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatWindowProps {
  conversation: {
    id: string;
    tradie_id: string | null;
    homeowner_id: string | null;
  };
  user: { id: string };
  userType: "tradie" | "centraResident";
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, user, userType }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* -------------------------- Load & subscribe -------------------------- */
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
        (payload) => setMessages((prev) => [...prev, payload.new])
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation.id]);

  /* --------------------------- Send a message --------------------------- */
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    await supabase.from("messages").insert({
      conversation_id: conversation.id,
      sender_id: user.id,
      message: newMessage,          // ✅ correct column name
      is_read: false,
      tradie_id: conversation.tradie_id,
      homeowner_id: conversation.homeowner_id,
    });

    setNewMessage("");
  };

  /* ------------------------- Upload an image --------------------------- */
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

    const {
      data: { publicUrl },
    } = supabase.storage.from("chat-images").getPublicUrl(filePath);

    await supabase.from("messages").insert({
      conversation_id: conversation.id,
      sender_id: user.id,
      image_url: publicUrl,
      is_read: false,
      tradie_id: conversation.tradie_id,
      homeowner_id: conversation.homeowner_id,
    });
  };

  /* ------------------------------ Render ------------------------------ */
  return (
    <div className="flex-1 flex flex-col">
      {/* message list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded ${
              msg.sender_id === user.id ? "bg-blue-100" : "bg-white"
            }`}
          >
            {msg.message && <p>{msg.message}</p>}
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

      {/* input area */}
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
