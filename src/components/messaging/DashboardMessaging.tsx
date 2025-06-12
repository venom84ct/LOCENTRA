import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";

interface DashboardMessagingProps {
  userRole: "tradie" | "homeowner";
  profile: any;
}

const DashboardMessaging: React.FC<DashboardMessagingProps> = ({ userRole, profile }) => {
  const userId = profile?.id;
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId) return;
    const field = userRole === "homeowner" ? "homeowner_id" : "tradie_id";
    const select =
      userRole === "homeowner"
        ? "id, jobs(title), profile_centra_tradie(first_name, avatar_url)"
        : "*, jobs(id, title, assigned_tradie), profile_centra_resident(first_name, avatar_url)";

    const load = async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select(select)
        .eq(field, userId);

      if (!error) setConversations(data || []);
    };
    load();
  }, [userId, userRole]);

  useEffect(() => {
    if (!selectedConversation?.id) return;
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", selectedConversation.id)
        .order("created_at", { ascending: true });

      if (!error) {
        setMessages(data || []);
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    };
    fetchMessages();
    const channel = supabase
      .channel(`messages-${selectedConversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedConversation.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation]);

  const handleSend = async () => {
    if (!newMessage.trim() || !userId || !selectedConversation) return;

    const { error } = await supabase.from("messages").insert({
      conversation_id: selectedConversation.id,
      sender_id: userId,
      message: newMessage.trim(),
    });

    if (!error) setNewMessage("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId || !selectedConversation?.id) return;

    const ext = file.name.split(".").pop();
    const filePath = `chat-images/${selectedConversation.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("chat-images")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Image upload failed:", uploadError.message);
      return;
    }

    const { data } = supabase.storage.from("chat-images").getPublicUrl(filePath);

    await supabase.from("messages").insert({
      conversation_id: selectedConversation.id,
      sender_id: userId,
      image_url: data.publicUrl,
    });

    e.target.value = "";
  };

  const deleteConversation = async (id: string) => {
    await supabase.from("messages").delete().eq("conversation_id", id);
    await supabase.from("conversations").delete().eq("id", id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (selectedConversation?.id === id) {
      setSelectedConversation(null);
      setMessages([]);
    }
  };

  const job = selectedConversation?.jobs;
  const isAssignedToTradie = job?.assigned_tradie === userId;
  const isUnassigned = !job?.assigned_tradie;
  const hasReceivedReply = messages.some((msg) => msg.sender_id !== userId);
  const canMessage = userRole === "tradie" ? isAssignedToTradie || (isUnassigned && hasReceivedReply) : true;

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="col-span-1">
        <h2 className="text-lg font-semibold mb-2">Conversations</h2>
        <div className="space-y-2">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`relative group p-2 rounded border cursor-pointer ${selectedConversation?.id === conv.id ? "bg-[#ffe6e6] text-black" : "hover:bg-gray-100"}`}
              onClick={() => setSelectedConversation(conv)}
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={conv.profile_centra_tradie?.avatar_url || conv.profile_centra_resident?.avatar_url} />
                  <AvatarFallback>{conv.profile_centra_tradie?.first_name?.[0] || conv.profile_centra_resident?.first_name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{conv.profile_centra_tradie?.first_name || conv.profile_centra_resident?.first_name || "User"}</p>
                  <p className="text-xs text-muted-foreground">Job: {conv.jobs?.title || "Untitled"}</p>
                </div>
              </div>
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 hidden group-hover:inline"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConversation(conv.id);
                }}
                title="Delete conversation"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-2">
        <h2 className="text-lg font-semibold mb-2">Messages</h2>
        <div className="border rounded p-4 bg-white h-[500px] overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`my-2 max-w-sm px-4 py-2 rounded-lg ${msg.sender_id === userId ? "bg-red-100 ml-auto" : "bg-gray-100"}`}
            >
              {msg.message && <div>{msg.message}</div>}
              {msg.image_url && <img src={msg.image_url} alt="upload" className="mt-2 rounded max-w-xs border" />}
            </div>
          ))}
          {!canMessage && (
            <div className="text-center text-muted-foreground text-sm mt-4">You cannot message anymore. The job has been assigned to another tradie.</div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="flex gap-2 mt-4">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={!canMessage}
          />
          <input type="file" accept="image/*" ref={fileInputRef} hidden onChange={handleImageUpload} />
          <Button onClick={() => fileInputRef.current?.click()} disabled={!canMessage}>📷</Button>
          <Button onClick={handleSend} disabled={!newMessage.trim() || !canMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardMessaging;
