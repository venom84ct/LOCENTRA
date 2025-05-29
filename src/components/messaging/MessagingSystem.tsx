import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

const MessagingSystem = ({ user, userType }: { user: any; userType: string }) => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      const column = userType === "tradie" ? "tradie_id" : "homeowner_id";
      const { data, error } = await supabase
        .from("conversations")
        .select("*, jobs(title)")
        .eq(column, user.id);

      if (!error) setConversations(data);
    };

    fetchConversations();
  }, [user, userType]);

  return (
    <div className="flex h-full">
      <ChatList
        conversations={conversations}
        onSelect={setSelectedConversation}
        selectedId={selectedConversation?.id}
      />
      {selectedConversation ? (
        <ChatWindow user={user} conversation={selectedConversation} userType={userType} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a conversation
        </div>
      )}
    </div>
  );
};

export default MessagingSystem;
