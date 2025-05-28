import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatWindowProps {
  user: any;
  conversation: any;
  userType: "tradie" | "homeowner";
}

const ChatWindow: React.FC<ChatWindowProps> = ({ user, conversation, userType }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [canSend, setCanSend] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isTradie = userType === "tradie";

  useEffect(() => {
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversation.id)
        .order("timestamp", { ascending: true });

      if (error) {
        console.error("Failed to fetch messages:", error);
      } else {
        setMessages(data);

        if (!isTradie) {
          const tradieStarted = data.some(
            (msg) => msg.sender_id === conversation.tradie_id
          );
          setCanSend(tradieStarted);
        } else {
          setCanSend(true);
        }
      }
    };

    loadMessages();

    const channel = supabase
      .channel(`conversation-${conversation.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversation.id}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation.id, user.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const { error } = await supabase.from("messages").insert({
      conversation_id: conversation.id,
      sender_id: user.id,
      content: newMessage.trim(),
    });
    if (!error) {
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-md max-w-md ${
              msg.sender_id === user.id ? "bg-blue-100 self-end" : "bg-gray-100 self-start"
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={!canSend}
        />
        <Button onClick={sendMessage} disabled={!canSend || !newMessage.trim()}>
          Send
        </Button>
      </div>
      {!canSend && (
        <p className="text-xs text-muted-foreground">
          You can reply once the tradie sends the first message.
        </p>
      )}
    </div>
  );
};

export default ChatWindow;
