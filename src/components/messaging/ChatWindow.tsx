import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const markMessagesAsRead = async (conversationId: string, userId: string) => {
  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("conversation_id", conversationId)
    .not("sender_id", "eq", userId)
    .or("is_read.eq.false,is_read.is.null");
  window.dispatchEvent(new Event("refreshUnread"));
};

interface ChatWindowProps {
  conversation: {
    id: string;
    tradie_id?: string;
    homeowner_id?: string;
  };
  user: { id: string };
  userType: "tradie" | "centraResident";
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, user, userType }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log("conversation object:", conversation);

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversation.id)
        .order("created_at", { ascending: true });

      setMessages(data || []);
      if (user.id) {
        await markMessagesAsRead(conversation.id, user.id);
      }
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
        async (payload) => {
          setMessages((prev) => [...prev, payload.new]);
          if (payload.new.sender_id !== user.id) {
            await markMessagesAsRead(conversation.id, user.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation.id, user.id]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messagePayload = {
      conversation_id: conversation.id,
      sender_id: user.id,
      message: newMessage,
      is_read: false,
      tradie_id:
        userType === "tradie" ? user.id : conversation.tradie_id ?? null,
      homeowner_id:
        userType === "centraResident" ? user.id : conversation.homeowner_id ?? null,
    };

    await supabase.from("messages").insert(messagePayload);
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

    const {
      data: { publicUrl },
    } = supabase.storage.from("chat-images").getPublicUrl(filePath);

    const messagePayload = {
      conversation_id: conversation.id,
      sender_id: user.id,
      image_url: publicUrl,
      is_read: false,
      tradie_id:
        userType === "tradie" ? user.id : conversation.tradie_id ?? null,
      homeowner_id:
        userType === "centraResident" ? user.id : conversation.homeowner_id ?? null,
    };

    await supabase.from("messages").insert(messagePayload);
  };

  return (
    <div className="flex-1 flex flex-col">
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
          accept="image/*"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-gray-100 border rounded px-3 py-2 hover:bg-gray-200"
        >
          📷
        </button>
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
};

export default ChatWindow;
