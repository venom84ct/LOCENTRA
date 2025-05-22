import React, { useState, useEffect } from "react";
import MessageList from "./MessageList";
import MessageThread from "./MessageThread";

interface User {
  id: string;
  name: string;
  avatar: string;
  role: "homeowner" | "tradie" | "centraResident";
}

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

interface BasicMessagingSystemProps {
  userType: "centraResident" | "tradie";
  userId: string;
  userName: string;
  userAvatar: string;
}

const BasicMessagingSystem: React.FC<BasicMessagingSystemProps> = ({
  userType,
  userId,
  userName,
  userAvatar,
}) => {
  const [contacts, setContacts] = useState<MessageContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<MessageContact | null>(
    null,
  );

  const currentUser: User = {
    id: userId,
    name: userName,
    avatar: userAvatar,
    role: userType === "centraResident" ? "centraResident" : "tradie",
  };

  // Load mock data based on user type
  useEffect(() => {
    let mockContacts: MessageContact[] = [];

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
          role: "tradie",
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
          role: "tradie",
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
          role: "tradie",
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
          role: "centraResident",
        },
        {
          id: "homeowner2",
          name: "Lisa Taylor",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
          lastMessage: "Can you provide a quote for fixing my kitchen sink?",
          timestamp: "2023-06-12T09:15:00",
          unread: false,
          jobTitle: "Kitchen Sink Replacement",
          role: "centraResident",
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
          role: "centraResident",
        },
      ];
    }

    // Set contacts and select the first one
    setContacts(mockContacts);
    if (mockContacts.length > 0) {
      setSelectedContact(mockContacts[0]);
    }
  }, [userType]);

  const handleSelectContact = (contact: MessageContact) => {
    setSelectedContact(contact);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Contacts List */}
      <div className="md:col-span-1">
        <MessageList
          contacts={contacts}
          onSelectContact={handleSelectContact}
          selectedContactId={selectedContact?.id}
        />
      </div>

      {/* Message Thread */}
      <div className="md:col-span-2">
        {selectedContact ? (
          <MessageThread
            currentUser={currentUser}
            recipient={selectedContact}
            jobTitle={selectedContact.jobTitle}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-white rounded-md border">
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
      </div>
    </div>
  );
};

export default BasicMessagingSystem;
