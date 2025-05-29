import React from "react";

interface ChatListProps {
  conversations: any[];
  currentUserId: string;
  setActiveConversation: (conv: any) => void;
  activeConversation: any;
}

const ChatList: React.FC<ChatListProps> = ({
  conversations,
  currentUserId,
  setActiveConversation,
  activeConversation,
}) => {
  return (
    <div className="w-64 border-r">
      <h2 className="text-xl font-bold p-4 border-b">Chats</h2>
      <ul>
        {conversations.map((conv) => {
          const isActive = conv.id === activeConversation?.id;
          return (
            <li
              key={conv.id}
              className={`p-4 cursor-pointer border-b hover:bg-gray-100 ${
                isActive ? "bg-gray-200" : ""
              }`}
              onClick={() => setActiveConversation(conv)}
            >
              Conversation {conv.id}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChatList;
