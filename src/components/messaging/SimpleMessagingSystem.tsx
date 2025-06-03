import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  conversation_id: string;
}

interface Contact {
  id: string;
  name: string;
  avatar_url: string;
}

interface Conversation {
  id: string;
  contact: Contact;
  messages: Message[];
}

const SimpleMessagingSystem: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;

      const uid = auth.user.id;
      setUserId(uid);

      const { data: convos, error: convoErr } = await supabase
        .from("conversations")
        .select("*")
        .or(`tradie_id.eq.${uid},homeowner_id.eq.${uid}`);

      if (convoErr || !convos) {
        console.error("Error loading conversations:", convoErr);
        return;
      }

      const convosWithDetails: Conversation[] = await Promise.all(
        convos.map(async (convo) => {
          const contactId =
            convo.tradie_id === uid ? convo.homeowner_id : convo.tradie_id;

          const { data: contactProfile } = await supabase
            .from(
              convo.tradie_id === uid
                ? "profile_centra_resident"
                : "profile_centra_tradie"
            )
            .select("id, first_name, avatar_url")
            .eq("id", contactId)
            .single();

          const { data: messages } = await supabase
            .from("messages")
            .select("*")
            .eq("conversation_id", convo.id)
            .order("created_at", { ascending: true });

          return {
            id: convo.id,
            contact: {
              id: contactProfile.id,
              name: contactProfile.first_name,
              avatar_url: contactProfile.avatar_url,
            },
            messages: (messages || []) as Message[],
          };
        })
      );

      setConversations(convosWithDetails);

      // ✅ Subscribe to new messages
      supabase
        .channel("realtime-messages")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
          },
          (payload) => {
            const msg = payload.new as Message;
            setConversations((prev) =>
              prev.map((conv) =>
                conv.id === msg.conversation_id
                  ? {
                      ...conv,
                      messages: [...conv.messages, msg],
                    }
                  : conv
              )
            );
          }
        )
        .subscribe();
    };

    init();
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selected || !userId) return;

    const { error } = await supabase.from("messages").insert({
      conversation_id: selected.id,
      sender_id: userId,
      content: newMessage.trim(),
    });

    if (error) {
      alert("Failed to send message");
      console.error("Send error:", error);
    } else {
      setNewMessage("");
    }
  };

  return (
    <div className="flex border rounded-lg h-[80vh] overflow-hidden">
      {/* Contacts List */}
      <div className="w-1/3 bg-white border-r overflow-y-auto">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
              selected?.id === conv.id ? "bg-gray-100" : ""
            }`}
            onClick={() => setSelected(conv)}
          >
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={conv.contact.avatar_url} />
                <AvatarFallback>
                  {conv.contact.name?.slice(0, 2) || "??"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{conv.contact.name}</p>
                <p className="text-xs text-gray-500">
                  {conv.messages[conv.messages.length - 1]?.content ||
                    "No messages yet"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Thread */}
      <div className="w-2/3 flex flex-col bg-gray-50">
        <div className="flex-1 p-4 overflow-y-auto space-y-2">
          {selected?.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender_id === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 rounded-lg text-sm ${
                  msg.sender_id === userId
                    ? "bg-blue-500 text-white"
                    : "bg-white border"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        {selected && (
          <div className="p-4 border-t flex space-x-2">
            <Textarea
              className="flex-1"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button onClick={sendMessage}>
              <MessageSquare className="mr-1 h-4 w-4" />
              Send
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleMessagingSystem;
