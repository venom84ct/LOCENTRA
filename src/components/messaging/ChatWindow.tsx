import React, { useEffect, useRef, useState } from "react";
import { useMessages } from "@/components/messaging/useMessages";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
  conversationId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId }) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { messages } = useMessages(conversationId);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!currentUserId) return <div className="p-4">Loading...</div>;

  return (
    <ScrollArea className="h-[500px] border rounded-md bg-white p-4">
      <div className="flex flex-col gap-3">
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId;
          return (
            <div
              key={msg.id}
              className={cn("flex gap-2 items-start", isMe ? "justify-end" : "justify-start")}
            >
              {!isMe && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={msg.avatar_url || undefined} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}

              <div
                className={cn(
                  "max-w-[60%] px-3 py-2 rounded-md text-sm",
                  isMe
                    ? "bg-blue-600 text-white self-end"
                    : "bg-gray-100 text-black"
                )}
              >
                {msg.image_url && (
                  <a href={msg.image_url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={msg.image_url}
                      alt="uploaded"
                      className="mb-2 max-w-full rounded-md border"
                    />
                  </a>
                )}
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatWindow;

