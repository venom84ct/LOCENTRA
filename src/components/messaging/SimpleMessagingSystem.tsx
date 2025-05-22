import React, { useState, useEffect } from "react";
import SimpleMessageList from "./SimpleMessageList";
import SimpleMessageThread from "./SimpleMessageThread";

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

interface SimpleMessagingSystemProps {
  userType: "centraResident" | "tradie";
  userId: string;
  userName: string;
  userAvatar: string;
}

const SimpleMessagingSystem: React.FC<SimpleMessagingSystemProps> = ({
  userType,
  userId,
  userName,
  userAvatar,
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(
    null,
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Load mock contacts based on user type
  useEffect(() => {
    let mockContacts: Contact[] = [];

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
          messageStatus: "accepted",
          jobId: "job1",
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
          messageStatus: "accepted",
          jobId: "job2",
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
          messageStatus: "accepted",
          jobId: "job3",
        },
        {
          id: "tradie4",
          name: "Emma Thompson",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
          lastMessage:
            "Hello! I'm interested in your Garden Landscaping job. I have extensive experience with native plants and irrigation systems.",
          timestamp: "2023-06-16T10:30:00",
          unread: true,
          jobTitle: "Garden Landscaping",
          messageStatus: "pending",
          isFirstMessage: true,
          jobId: "job4",
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
          messageStatus: "accepted",
          jobId: "lead3",
        },
        {
          id: "homeowner2",
          name: "Lisa Taylor",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
          lastMessage: "Can you provide a quote for fixing my kitchen sink?",
          timestamp: "2023-06-12T09:15:00",
          unread: false,
          jobTitle: "Kitchen Sink Replacement",
          messageStatus: "accepted",
          jobId: "lead1",
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
          messageStatus: "accepted",
          jobId: "lead2",
        },
        {
          id: "homeowner4",
          name: "David Chen",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
          lastMessage: "Your message has been archived.",
          timestamp: "2023-06-07T11:30:00",
          unread: false,
          jobTitle: "Toilet Installation",
          messageStatus: "archived",
          jobId: "lead4",
        },
      ];
    }

    setContacts(mockContacts);
    if (mockContacts.length > 0) {
      setSelectedContactId(mockContacts[0].id);
    }
  }, [userType]);

  // Load messages when selected contact changes
  useEffect(() => {
    if (!selectedContactId) return;

    let initialMessages: Message[] = [];

    if (userType === "centraResident" && selectedContactId === "tradie1") {
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
    } else if (
      userType === "centraResident" &&
      selectedContactId === "tradie2"
    ) {
      initialMessages = [
        {
          id: "msg1",
          senderId: "tradie2",
          content: "Hello! I've completed the electrical work in your home.",
          timestamp: "2023-06-12T09:00:00",
        },
        {
          id: "msg2",
          senderId: userId,
          content: "That's great news! Did you encounter any issues?",
          timestamp: "2023-06-12T09:05:00",
        },
        {
          id: "msg3",
          senderId: "tradie2",
          content:
            "The electrical work is now complete. Please let me know if you have any questions.",
          timestamp: "2023-06-12T09:15:00",
        },
      ];
    } else if (
      userType === "centraResident" &&
      selectedContactId === "tradie3"
    ) {
      initialMessages = [
        {
          id: "msg1",
          senderId: "tradie3",
          content:
            "I've arrived to fix your roof leak. Where exactly is the problem?",
          timestamp: "2023-06-10T14:15:00",
        },
        {
          id: "msg2",
          senderId: userId,
          content: "It's in the master bedroom ceiling, near the chimney.",
          timestamp: "2023-06-10T14:20:00",
        },
        {
          id: "msg3",
          senderId: "tradie3",
          content:
            "I've fixed the roof leak. The issue was with the flashing around the chimney.",
          timestamp: "2023-06-10T14:45:00",
        },
      ];
    } else if (userType === "tradie" && selectedContactId === "homeowner1") {
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
    } else if (userType === "tradie" && selectedContactId === "homeowner2") {
      initialMessages = [
        {
          id: "msg1",
          senderId: "homeowner2",
          content: "Hi Mike, my kitchen sink is leaking. Can you help?",
          timestamp: "2023-06-12T08:45:00",
        },
        {
          id: "msg2",
          senderId: userId,
          content:
            "I can definitely help with that. Can you send a photo of the issue?",
          timestamp: "2023-06-12T09:00:00",
        },
        {
          id: "msg3",
          senderId: "homeowner2",
          content: "Can you provide a quote for fixing my kitchen sink?",
          timestamp: "2023-06-12T09:15:00",
        },
      ];
    } else if (userType === "tradie" && selectedContactId === "homeowner3") {
      initialMessages = [
        {
          id: "msg1",
          senderId: "homeowner3",
          content:
            "My hot water system isn't working. How soon can you look at it?",
          timestamp: "2023-06-10T14:15:00",
        },
        {
          id: "msg2",
          senderId: userId,
          content: "I can come by this afternoon around 3pm. Does that work?",
          timestamp: "2023-06-10T14:30:00",
        },
        {
          id: "msg3",
          senderId: "homeowner3",
          content: "Thanks for the quick response. When can you start the job?",
          timestamp: "2023-06-10T14:45:00",
        },
      ];
    } else {
      // Default messages if no specific conversation is found
      initialMessages = [
        {
          id: "msg1",
          senderId: selectedContactId,
          content: "Hello there!",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: "msg2",
          senderId: userId,
          content: "Hi! How can I help you today?",
          timestamp: new Date(Date.now() - 3000000).toISOString(),
        },
      ];
    }

    setMessages(initialMessages);

    // Mark messages as read when selecting a contact
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === selectedContactId
          ? { ...contact, unread: false }
          : contact,
      ),
    );
  }, [selectedContactId, userType, userId]);

  const handleSelectContact = (contactId: string) => {
    setSelectedContactId(contactId);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContactId) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: userId,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);

    // Update the last message in contacts
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact.id === selectedContactId
          ? {
              ...contact,
              lastMessage: newMessage,
              timestamp: new Date().toISOString(),
              unread: false,
            }
          : contact,
      ),
    );

    setNewMessage("");
  };

  const selectedContact =
    contacts.find((contact) => contact.id === selectedContactId) || null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Contacts List */}
      <div className="md:col-span-1">
        <SimpleMessageList
          contacts={contacts}
          selectedContactId={selectedContactId}
          onSelectContact={(contactId) => handleSelectContact(contactId)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>

      {/* Message Thread */}
      <div className="md:col-span-2">
        <SimpleMessageThread
          contact={selectedContact}
          messages={messages}
          currentUserId={userId}
          newMessage={newMessage}
          onNewMessageChange={setNewMessage}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default SimpleMessagingSystem;
