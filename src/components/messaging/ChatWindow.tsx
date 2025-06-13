import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Paperclip, Send } from "lucide-react";

interface ChatWindowProps {
  user: any;
  conversation: any;
  messages: any[];
  onSendMessage: (text: string, imageFile?: File) => void;
  isLoadingMessages: boolean;
  userType: "centraResident" | "tradie";
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  user,
  conversation,
  messages,
  onSendMessage,
  isLoadingMessages,
  userType,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const tradie =
    userType === "centraResident"
      ? conversation?.tradie_profile
      : conversation?.resident_profile;

  const jobTitle = conversation?.job?.title || "Job";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim() === "" && !image) return;
    onSendMessage(newMessage.trim(), image || undefined);
    setNewMessage("");
    setImage(null);
  };

  const isHomeowner = userType === "centraResident";
  const receivedAnyMessages =
    isHomeowner &&
    messages.some((msg) => msg.sender_id !== user?.id && msg.type === "text");

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={tradie?.avatar_url || `https://robohash.org/${tradie?.id}`}
            />
            <AvatarFallback>
              {tradie?.first_name?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">
              {tradie?.first_name} {tradie?.last_name}
            </div>
            <div className="text-sm text-muted-foreground">{jobTitle}</div>
          </div>
        </div>
        {isHomeowner && receivedAnyMessages && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              window.open(`/public/profile/${tradie?.id}`, "_blank");
            }}
          >
            View Profile
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {isLoadingMessages ? (
          <p className="text-center text-muted-foreground">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-muted-foreground">No messages yet</p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender_id === user?.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 rounded-lg max-w-xs ${
                  msg.sender_id === user?.id
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.image_url && (
                  <img
                    src={msg.image_url}
                    alt="sent"
                    className="rounded mb-1 max-h-40"
                  />
                )}
                {msg.text}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-white flex items-center gap-2">
        <label htmlFor="image-upload" className="cursor-pointer">
          <Paperclip className="w-5 h-5 text-muted-foreground" />
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setImage(file);
          }}
        />
        <Input
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <Button onClick={handleSend}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatWindow;
