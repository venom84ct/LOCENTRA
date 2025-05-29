import React from "react";

const ChatList = ({ conversations, onSelect, selectedId }: any) => {
  return (
    <div className="w-1/3 border-r bg-white overflow-y-auto">
      <h2 className="text-lg font-bold p-4">Chats</h2>
      <ul>
        {conversations.map((c: any) => (
          <li
            key={c.id}
            onClick={() => onSelect(c)}
            className={`p-4 cursor-pointer hover:bg-gray-100 ${
              c.id === selectedId ? "bg-gray-200" : ""
            }`}
          >
            <div className="font-semibold">{c.jobs?.title || "Job Chat"}</div>
            <div className="text-sm text-gray-500">Chat ID: {c.id}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;

