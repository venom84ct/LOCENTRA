import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { Image as ImageIcon } from "lucide-react";

interface MessageInputProps {
  conversationId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ conversationId }) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<{tradie_id:string;homeowner_id:string} | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
    };
    fetchUser();
    const fetchConversation = async () => {
      const { data } = await supabase
        .from("conversations")
        .select("tradie_id, homeowner_id")
        .eq("id", conversationId)
        .single();
      setConversation(data as any);
    };
    fetchConversation();
  }, []);

  const sendMessage = async () => {
    if (!message && !file || !currentUserId) return;
    setLoading(true);

    let imageUrl = null;

    if (file) {
      const fileExt = file.name.split(".").pop();
      const filePath = `chat/${Date.now()}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from("chat-images")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Image upload failed", uploadError);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("chat-images")
        .getPublicUrl(filePath);

      imageUrl = urlData?.publicUrl;
    }

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: currentUserId,
      content: message,
      image_url: imageUrl,
      tradie_id: conversation?.tradie_id ?? null,
      homeowner_id: conversation?.homeowner_id ?? null,
      is_read: false,
    });

    if (error) {
      console.error("Message send failed", error);
    }

    setMessage("");
    setFile(null);
    setLoading(false);
  };

  if (!currentUserId) return <div className="p-4">Loading...</div>;

  return (
    <div className="flex gap-2 items-center mt-4">
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1"
      />
      <label className="cursor-pointer">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <ImageIcon className="h-5 w-5 mx-2" />
      </label>
      <Button onClick={sendMessage} disabled={loading || (!message && !file)}>
        Send
      </Button>
    </div>
  );
};

export default MessageInput;
