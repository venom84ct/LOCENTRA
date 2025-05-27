import React, { useEffect, useState } from "react";
import ChatWindow from "@/components/messaging/ChatWindow";
import MessageInput from "@/components/messaging/MessageInput";
import { supabase } from "@/lib/supabaseClient";

const MessagesPage = () => {
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFirstConversation = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("conversations")
        .select("id")
        .or(`tradie_id.eq.${user.id},homeowner_id.eq.${user.id}`)
        .order("created_at", { ascending: true })
        .limit(1)
        .single();

      if (data?.id) setConversationId(data.id);
    };

    fetchFirstConversation();
  }, []);

  if (!conversationId) return <div className="p-4">Loading conversation...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-6 space-y-4">
      <ChatWindow conversationId={conversationId} />
      <MessageInput conversationId={conversationId} />
    </div>
  );
};

export default MessagesPage;
