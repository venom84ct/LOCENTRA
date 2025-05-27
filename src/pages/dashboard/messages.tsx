import ChatWindow from "@/components/messaging/ChatWindow";
import MessageInput from "@/components/messaging/MessageInput";
import { useUser } from "@/hooks/useUser"; // if you have one

const MessagesPage = () => {
  const conversationId = "some-id"; // ✅ You’ll fetch or route this dynamically
  const currentUserId = user?.id;   // ✅ From Supabase auth or user hook

  return (
    <div className="max-w-3xl mx-auto mt-6 space-y-4">
      <ChatWindow conversationId={conversationId} currentUserId={currentUserId} />
      <MessageInput conversationId={conversationId} currentUserId={currentUserId} />
    </div>
  );
};

export default MessagesPage;
