import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import SimpleMessageList, { MessageContact } from "./SimpleMessageList";
import SimpleMessageThread, { Message } from "./SimpleMessageThread";

interface MessagingSystemProps {
  userType: "centraResident" | "tradie";
  userId: string;
  userName: string;
  userAvatar: string;
}

const MessagingSystem: React.FC<MessagingSystemProps> = ({
  userType,
  userId,
  userName,
  userAvatar,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [contacts, setContacts] = useState<MessageContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<MessageContact | null>(
    null,
  );
  const [messages, setMessages] = useState<Message[]>([]);

  // Load mock data based on user type
  useEffect(() => {
    let mockContacts: MessageContact[] = [];
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

  const handleSelectContact = (contact: MessageContact) => {
    setSelectedContact(contact);
    // In a real app, we would fetch messages for this contact
    // For now, we'll just use the initial messages
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
            <SimpleMessageList
              contacts={contacts}
              selectedContactId={selectedContact?.id}
              onSelectContact={handleSelectContact}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>
        </Card>
      </div>

      {/* Message Thread */}
      <div className="md:col-span-2">
        <Card className="h-full">
          {selectedContact ? (
            <SimpleMessageThread
              messages={messages}
              currentUserId={userId}
              contact={selectedContact}
              newMessage={newMessage}
              onNewMessageChange={setNewMessage}
              onSendMessage={handleSendMessage}
            />
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

export default MessagingSystem;
