import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface BasicMessagingSystemProps {
  user: any;
  userType: "tradie" | "homeowner";
}

const BasicMessagingSystem: React.FC<BasicMessagingSystemProps> = ({ user, userType }) => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select("id, homeowner_id, tradie_id, created_at")
        .or(`homeowner_id.eq.${user.id},tradie_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load conversations:", error.message);
        return;
      }

      setConversations(data || []);
      setLoading(false);
    };

    fetchConversations();
  }, [user.id]);

  if (loading) return <div className="p-4">Loading conversations...</div>;

  if (conversations.length === 0)
    return <div className="p-4 text-gray-500">No conversations found.</div>;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold mb-4">Conversations</h2>
      {conversations.map((conv) => (
        <div
          key={conv.id}
          className="border border-gray-300 rounded p-3 hover:bg-gray-50 cursor-pointer"
        >
          <div className="text-sm text-gray-600">Conversation ID: {conv.id}</div>
          <div className="text-xs text-gray-400">
            Created: {new Date(conv.created_at).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BasicMessagingSystem;
