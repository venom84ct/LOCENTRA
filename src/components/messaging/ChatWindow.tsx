// src/components/messaging/ChatWindow.tsx
import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Paperclip, SendHorizontal } from "lucide-react";
import useSound from "use-sound";
import messageSound from "@/assets/sounds/message.mp3";

interface Message {
  id: string;
  message: string;
  sender_id: string;
  image_url?: string;
  timestamp: string;
  is_read: boolean;
}

interface Conversation {
  id: string;
  job_title: string;
  other_user_id: string;
  other_user_name: string;
  other_user_avatar?: string;
  unread_count: number;
}

interface ChatWindowProps {
  conversation: Conversation | null;
  userId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [play] = useSound(messageSound);

  useEffect(() => {
    if (!conversation) return;
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversation.id)
        .order("timestamp", { ascending: true });

      if (!error) {
        setMessages(data);
        await supabase
          .from("messages")
          .update({ is_read: true })
          .eq("conversation_id", conversation.id)
          .eq("receiver_id", userId);
      }
    };

    fetchMessages();
  }, [conversation, userId]);

  useEffect(() => {
    if (!conversation) return;
    const channel = supabase
      .channel(`conversation-${conversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        async (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          if (payload.new.sender_id !== userId) {
            play();
            await supabase
              .from("messages")
              .update({ is_read: true })
              .eq("id", payload.new.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation, userId, play]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage && !imageFile) return;

    let imageUrl = null;
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const filePath = `${conversation?.id}/${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from("chat-images")
        .upload(filePath, imageFile);
      if (!error) {
        imageUrl = supabase.storage
          .from("chat-images")
          .getPublicUrl(filePath).data.publicUrl;
      }
      setImageFile(null);
    }

    await supabase.from("messages").insert({
      conversation_id: conversation?.id,
      sender_id: userId,
      message: newMessage || "",
      image_url: imageUrl,
    });

    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b">
        <Avatar>
          <AvatarImage src={conversation?.other_user_avatar} />
          <AvatarFallback>{conversation?.other_user_name?.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold">{conversation?.other_user_name}</div>
          <div className="text-xs text-muted-foreground">{conversation?.job_title}</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs rounded p-2 ${
              msg.sender_id === userId
                ? "ml-auto bg-blue-100 text-right"
                : "mr-auto bg-gray-100"
            } ${!msg.is_read && msg.sender_id !== userId ? "ring-2 ring-pink-400" : ""}`}
          >
            {msg.message && <p>{msg.message}</p>}
            {msg.image_url && (
              <img
                src={msg.image_url}
                alt="chat"
                className="w-full mt-1 rounded"
              />
            )}
            <div className="text-[10px] text-gray-400 mt-1">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t flex items-center gap-2">
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <label className="cursor-pointer">
          <Paperclip className="h-5 w-5" />
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) =>
              setImageFile(e.target.files ? e.target.files[0] : null)
            }
          />
        </label>
        <Button onClick={handleSendMessage} variant="default">
          <SendHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatWindow;
