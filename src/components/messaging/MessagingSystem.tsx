import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/hooks/useUser";
import ChatWindow from "./ChatWindow";
import { Input } from "@/components/ui/input";

const MessagingSystem = ({ userType }: { userType: "homeowner" | "tradie" }) => {
  const { user } = useUser();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .or(`tradie_id.eq.${user.id},homeowner_id.eq.${user.id}`)
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error fetching conversations:", error.message);
      } else {
        setConversations(data);
        if (data.length > 0) setSelected(data[0]);
      }
    };

    fetchConversations();
  }, [user]);

  const filteredConvos = conversations.filter((c) =>
    (c.title || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="flex border rounded-lg overflow-hidden shadow bg-white">
      <aside className="w-1/3 border-r p-4">
        <Input
          placeholder="Search messages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />
        <ul className="space-y-2">
          {filteredConvos.map((conv) => (
            <li
              key={conv.id}
              className={`p-2 rounded cursor-pointer ${
                selected?.id === conv.id ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
              onClick={() => setSelected(conv)}
            >
              <div className="font-medium">{conv.title || "Conversation"}</div>
              <div className="text-sm text-muted-foreground">
                Re: {conv.subject || "No subject"}
              </div>
            </li>
          ))}
        </ul>
      </aside>

      <div className="w-2/3">
        {selected ? (
          <ChatWindow
            user={user}
            userType={userType}
            conversation={selected}
          />
        ) : (
          <div className="p-6 text-muted-foreground">Select a conversation</div>
        )}
      </div>
    </div>
  );
};

export default MessagingSystem;
