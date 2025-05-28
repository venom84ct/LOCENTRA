import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ChatWindow from "./ChatWindow";

interface MessagingSystemProps {
  user: any;
  userType: "tradie" | "homeowner";
}

const MessagingSystem: React.FC<MessagingSystemProps> = ({ user, userType }) => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConversations = async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select("*, tradie:tradie_id(*), homeowner:homeowner_id(*)")
        .or(`tradie_id.eq.${user.id},homeowner_id.eq.${user.id}`)
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Failed to load conversations:", error);
      } else {
        setConversations(data);
        if (data.length > 0) setSelectedConversation(data[0]);
      }
      setLoading(false);
    };

    loadConversations();
  }, [user.id]);

  if (loading) return <div>Loading conversation...</div>;
  if (conversations.length === 0) return <div>No conversations yet.</div>;

  return (
    <div className="flex border rounded-lg shadow-sm overflow-hidden">
      {/* Left: Conversation List */}
      <aside className="w-1/3 border-r bg-white">
        <div className="p-2 font-semibold border-b">Conversations</div>
        {conversations.map((conv) => {
          const otherParty =
            userType === "tradie" ? conv.homeowner : conv.tradie;
          return (
            <div
              key={conv.id}
              className={`p-3 border-b hover:bg-gray-100 cursor-pointer ${
                selectedConversation?.id === conv.id ? "bg-gray-100" : ""\              }`}
              onClick={() => setSelectedConversation(conv)}
            >
              <p className="font-medium">{otherParty?.first_name || "User"}</p>
              <p className="text-xs text-muted-foreground truncate">
                {conv.subject || "No subject"}
              </p>
            </div>
          );
        })}
      </aside>

      {/* Right: Chat window */}
      <main className="w-2/3 bg-gray-50">
        {selectedConversation && (
          <ChatWindow
            user={user}
            conversation={selectedConversation}
            userType={userType}
          />
        )}
      </main>
    </div>
  );
};

export default MessagingSystem;

