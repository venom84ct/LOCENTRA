import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  jobTitle?: string;
  role: "homeowner" | "tradie" | "centraResident";
}

interface MessageListProps {
  contacts: MessageContact[];
  onSelectContact: (contact: MessageContact) => void;
  selectedContactId?: string;
}

const MessageList: React.FC<MessageListProps> = ({
  contacts,
  onSelectContact,
  selectedContactId,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
    }
  };

  const handleNewMessage = () => {
    if (contacts.length > 0) {
      onSelectContact(contacts[0]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-md border">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg mb-4">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {filteredContacts.length > 0 ? (
          <div className="divide-y">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className={cn(
                  "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                  selectedContactId === contact.id && "bg-muted",
                )}
                onClick={() => onSelectContact(contact)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback>
                        {contact.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    {contact.unread && (
                      <span className="absolute -top-1 -right-1 bg-primary w-3 h-3 rounded-full border-2 border-background"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate">{contact.name}</h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {formatTimestamp(contact.timestamp)}
                      </span>
                    </div>
                    {contact.jobTitle && (
                      <p className="text-xs text-muted-foreground truncate">
                        Re: {contact.jobTitle}
                      </p>
                    )}
                    <p
                      className={cn(
                        "text-sm truncate mt-1",
                        contact.unread
                          ? "font-medium"
                          : "text-muted-foreground",
                      )}
                    >
                      {contact.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-medium">No messages found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {searchTerm
                ? "Try a different search term"
                : "Start a conversation from your jobs"}
            </p>
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleNewMessage}
          type="button"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>
    </div>
  );
};

export default MessageList;
