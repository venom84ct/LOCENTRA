import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

interface MessagingSystemProps {
  user: any;
  userType: "tradie" | "centraResident";
}

const MessagingSystem: React.FC<MessagingSystemProps> = ({ user, userType }) => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      const { data } = await supabase
        .from("conversations")
        .select("*")
        .or(`homeowner_id.eq.${user.id},tradie_id.eq.${user.id}`);

      setConversations(data || []);
    };

    fetchConversations();
  }, [user.id]);

  return (
    <div className="flex gap-6">
      <ChatList
        conversations={conversations}
        currentUserId={user.id}
        setActiveConversation={setActiveConversation}
        activeConversation={activeConversation}
      />
      <div className="flex-1">
        {activeConversation ? (
          <ChatWindow
            conversation={activeConversation}
            currentUserId={user.id}
            userType={userType}
          />
        ) : (
          <div className="p-6 text-gray-500">Select a conversation</div>
        )}
      </div>
    </div>
  );
};

export default MessagingSystem;
