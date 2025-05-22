import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

export interface MessageContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  jobTitle?: string;
}

interface SimpleMessageListProps {
  contacts: MessageContact[];
  selectedContactId?: string;
  onSelectContact: (contact: MessageContact) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SimpleMessageList: React.FC<SimpleMessageListProps> = ({
  contacts,
  selectedContactId,
  onSelectContact,
  searchTerm,
  onSearchChange,
}) => {
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.jobTitle &&
        contact.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const formatDate = (timestamp: string) => {
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

  return (
    <div className="h-full flex flex-col divide-y">
      {filteredContacts.length > 0 ? (
        filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className={cn(
              "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
              selectedContactId === contact.id && "bg-muted",
            )}
            onClick={() => onSelectContact(contact.id)}
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
                    {formatDate(contact.timestamp)}
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
                    contact.unread ? "font-medium" : "text-muted-foreground",
                  )}
                >
                  {contact.lastMessage}
                </p>
              </div>
            </div>
          </div>
        ))
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
  );
};

export default SimpleMessageList;
