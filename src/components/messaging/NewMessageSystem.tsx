import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, MessageSquare } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  jobTitle?: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

interface NewMessageSystemProps {
  userType: "centraResident" | "tradie";
  userId: string;
  userName: string;
  userAvatar: string;
}

const NewMessageSystem: React.FC<NewMessageSystemProps> = ({
  userType,
  userId,
  userName,
  userAvatar,
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Load mock data based on user type
  useEffect(() => {
    let mockContacts: Contact[] = [];
    let initialMessages: Message[] = [];

    if (userType === "centraResident") {
      mockContacts = [
        {
          id: "tradie1",
          name: "Mike Johnson",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
          lastMessage:
            "I'll be arriving tomorrow at 9am with the new fixtures.",
          timestamp: "2023-06-14T15:30:00",
          unread: true,
          jobTitle: "Bathroom Renovation",
        },
        {
          id: "tradie2",
          name: "Sarah Williams",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
          lastMessage:
            "The electrical work is now complete. Please let me know if you have any questions.",
          timestamp: "2023-06-12T09:15:00",
          unread: false,
          jobTitle: "Electrical Rewiring",
        },
        {
          id: "tradie3",
          name: "David Chen",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
          lastMessage:
            "I've fixed the roof leak. The issue was with the flashing around the chimney.",
          timestamp: "2023-06-10T14:45:00",
          unread: false,
          jobTitle: "Emergency Roof Leak Repair",
        },
      ];

      initialMessages = [
        {
          id: "msg1",
          senderId: "tradie1",
          content:
            "Hi there! I'm interested in discussing the Bathroom Renovation you posted.",
          timestamp: "2023-06-15T10:30:00",
        },
        {
          id: "msg2",
          senderId: userId,
          content: "Great! What would you like to know about it?",
          timestamp: "2023-06-15T10:35:00",
        },
        {
          id: "msg3",
          senderId: "tradie1",
          content: "Could you provide more details about the scope of work?",
          timestamp: "2023-06-15T10:40:00",
        },
        {
          id: "msg4",
          senderId: userId,
          content:
            "Sure, I'm looking to completely renovate the main bathroom. This includes replacing the shower, toilet, and sink, as well as retiling the floor and walls.",
          timestamp: "2023-06-15T10:45:00",
        },
      ];
    } else {
      // Tradie user
      mockContacts = [
        {
          id: "homeowner1",
          name: "John Smith",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
          lastMessage: "Great! What time will you be arriving tomorrow?",
          timestamp: "2023-06-14T16:30:00",
          unread: true,
          jobTitle: "Bathroom Renovation",
        },
        {
          id: "homeowner2",
          name: "Lisa Taylor",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
          lastMessage: "Can you provide a quote for fixing my kitchen sink?",
          timestamp: "2023-06-12T09:15:00",
          unread: false,
          jobTitle: "Kitchen Sink Replacement",
        },
        {
          id: "homeowner3",
          name: "Robert Wilson",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
          lastMessage:
            "Thanks for the quick response. When can you start the job?",
          timestamp: "2023-06-10T14:45:00",
          unread: false,
          jobTitle: "Hot Water System Repair",
        },
      ];

      initialMessages = [
        {
          id: "msg1",
          senderId: "homeowner1",
          content:
            "Hi Mike, I'm interested in getting my bathroom renovated. When can you come take a look?",
          timestamp: "2023-06-14T10:30:00",
        },
        {
          id: "msg2",
          senderId: userId,
          content:
            "Hello John, I'd be happy to help with your bathroom renovation. I can come by tomorrow at 9am if that works for you?",
          timestamp: "2023-06-14T10:45:00",
        },
        {
          id: "msg3",
          senderId: "homeowner1",
          content: "Great! What time will you be arriving tomorrow?",
          timestamp: "2023-06-14T11:00:00",
        },
      ];
    }

    setContacts(mockContacts);
    setSelectedContact(mockContacts[0]);
    setMessages(initialMessages);
  }, [userType, userId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: userId,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");

    // Update the last message in contacts
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === selectedContact.id
          ? {
              ...contact,
              lastMessage: newMessage,
              timestamp: new Date().toISOString(),
            }
          : contact,
      ),
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) {
      return formatTime(timestamp);
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.jobTitle &&
        contact.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Contacts List */}
      <div className="md:col-span-1">
        <Card className="h-full flex flex-col">
          <div className="p-4 border-b">
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
                    className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${selectedContact?.id === contact.id ? "bg-muted" : ""}`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage
                            src={contact.avatar}
                            alt={contact.name}
                          />
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
                          <h3 className="font-medium truncate">
                            {contact.name}
                          </h3>
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
                          className={`text-sm truncate mt-1 ${contact.unread ? "font-medium" : "text-muted-foreground"}`}
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
        </Card>
      </div>

      {/* Message Thread */}
      <div className="md:col-span-2">
        <Card className="h-full flex flex-col">
          {selectedContact ? (
            <>
              {/* Header */}
              <div className="p-4 border-b flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage
                    src={selectedContact.avatar}
                    alt={selectedContact.name}
                  />
                  <AvatarFallback>
                    {selectedContact.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedContact.name}</h3>
                  {selectedContact.jobTitle && (
                    <p className="text-sm text-muted-foreground">
                      Re: {selectedContact.jobTitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-4"
                ref={messageContainerRef}
              >
                {messages.map((msg) => {
                  const isCurrentUser = msg.senderId === userId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                    >
                      <div className="flex max-w-[80%]">
                        {!isCurrentUser && (
                          <Avatar className="h-8 w-8 mr-2 mt-1">
                            <AvatarImage
                              src={selectedContact.avatar}
                              alt={selectedContact.name}
                            />
                            <AvatarFallback>
                              {selectedContact.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          <div
                            className={`rounded-lg p-3 ${isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                          >
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          </div>
                          <div
                            className={`text-xs text-muted-foreground mt-1 ${isCurrentUser ? "text-right" : "text-left"}`}
                          >
                            {formatTime(msg.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <textarea
                    className="flex-1 min-h-[80px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="h-10 px-4"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-4">
                <h3 className="font-medium text-lg mb-2">
                  Select a conversation
                </h3>
                <p className="text-muted-foreground">
                  Choose a contact from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default NewMessageSystem;
