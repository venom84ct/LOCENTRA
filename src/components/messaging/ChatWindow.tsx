import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatWindowProps {
  user: any;
  selectedConversation: any;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ user, selectedConversation }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const messageSound = new Audio("/notify.mp3");

  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", selectedConversation.id)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(data);

        // Mark all as read on load
        const unreadIds = data
          .filter((m) => m.sender_id !== user.id && !m.is_read)
          .map((m) => m.id);

        if (unreadIds.length) {
          await supabase
            .from("messages")
            .update({ is_read: true })
            .in("id", unreadIds);
        }
      }
    };

    fetchMessages();
  }, [selectedConversation, user.id]);

  useEffect(() => {
    const msgChannel = supabase
      .channel("realtime:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedConversation?.id}`,
        },
        async (payload) => {
          const newMsg = payload.new;
          setMessages((prev) => [...prev, newMsg]);

          if (newMsg.sender_id !== user.id) {
            messageSound.play();

            // Mark as read immediately
            await supabase
              .from("messages")
              .update({ is_read: true })
              .eq("id", newMsg.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(msgChannel);
    };
  }, [selectedConversation?.id, user.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    await supabase.from("messages").insert({
      conversation_id: selectedConversation.id,
      sender_id: user.id,
      message: newMessage,
      tradie_id: selectedConversation.tradie_id,
      homeowner_id: selectedConversation.homeowner_id,
    });

    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => {
          const isOwn = msg.sender_id === user.id;
          const isUnread = !msg.is_read && !isOwn;

          return (
            <div
              key={msg.id}
              className={`p-3 rounded max-w-[70%] ${
                isOwn
                  ? "bg-blue-100 self-end text-right"
                  : `bg-gray-100 self-start text-left ${isUnread ? "border-l-4 border-blue-400" : ""}`
              }`}
            >
              {msg.message && <p>{msg.message}</p>}
              {msg.image_url && (
                <img
                  src={msg.image_url}
                  className="mt-2 rounded max-h-48"
                  alt="attachment"
                />
              )}
              <div className="text-xs text-gray-500 mt-1">
                {new Date(msg.created_at).toLocaleTimeString()}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="border-t p-3 flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
};

export default ChatWindow;
