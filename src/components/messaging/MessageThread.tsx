import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Image as ImageIcon, Paperclip, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: {
    type: "image" | "file";
    url: string;
    name: string;
  }[];
}

interface User {
  id: string;
  name: string;
  avatar: string;
  role: "homeowner" | "tradie" | "centraResident";
}

interface MessageThreadProps {
  currentUser: User;
  recipient: User;
  jobId?: string;
  jobTitle?: string;
}

const MessageThread: React.FC<MessageThreadProps> = ({
  currentUser,
  recipient,
  jobId,
  jobTitle,
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock messages for demo
  useEffect(() => {
    // In a real app, this would fetch messages from an API
    const mockMessages: Message[] = [
      {
        id: "1",
        senderId: recipient.id,
        receiverId: currentUser.id,
        content: `Hi there! I'm interested in discussing the ${jobTitle || "job"} you posted.`,
        timestamp: "2023-06-15T10:30:00",
        isRead: true,
      },
      {
        id: "2",
        senderId: currentUser.id,
        receiverId: recipient.id,
        content: "Great! What would you like to know about it?",
        timestamp: "2023-06-15T10:35:00",
        isRead: true,
      },
      {
        id: "3",
        senderId: recipient.id,
        receiverId: currentUser.id,
        content: "Could you provide more details about the scope of work?",
        timestamp: "2023-06-15T10:40:00",
        isRead: true,
      },
      {
        id: "4",
        senderId: currentUser.id,
        receiverId: recipient.id,
        content: "Sure, here's a photo of the area that needs work.",
        timestamp: "2023-06-15T10:45:00",
        isRead: true,
        attachments: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1581141849291-1125c7b692b5?w=500&q=80",
            name: "project-area.jpg",
          },
        ],
      },
    ];

    // Only set messages if they haven't been set already (to preserve any new messages)
    if (messages.length === 0) {
      setMessages(mockMessages);
    }
  }, [currentUser.id, recipient.id, jobTitle, messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();

    if (message.trim() === "" && attachments.length === 0) return;

    const newAttachments = attachments.map((file, index) => ({
      type: file.type.startsWith("image/") ? "image" : "file",
      url: attachmentPreviews[index],
      name: file.name,
    }));

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: recipient.id,
      content: message,
      timestamp: new Date().toISOString(),
      isRead: false,
      attachments: newAttachments.length > 0 ? newAttachments : undefined,
    };

    // Ensure we're properly updating the state with the new message
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage("");
    setAttachments([]);
    setAttachmentPreviews([]);

    // Scroll to bottom after sending
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments([...attachments, ...newFiles]);

      // Create previews for the files
      newFiles.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              setAttachmentPreviews((prev) => [
                ...prev,
                e.target!.result as string,
              ]);
            }
          };
          reader.readAsDataURL(file);
        } else {
          // For non-image files, use a placeholder
          setAttachmentPreviews((prev) => [
            ...prev,
            "https://placehold.co/100x100?text=File",
          ]);
        }
      });
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
    setAttachmentPreviews(attachmentPreviews.filter((_, i) => i !== index));
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-md border">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={recipient.avatar} alt={recipient.name} />
            <AvatarFallback>{recipient.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{recipient.name}</h3>
            <p className="text-sm text-muted-foreground">
              {recipient.role === "homeowner" ||
              recipient.role === "centraResident"
                ? "Homeowner"
                : recipient.role === "tradie"
                  ? "Tradie"
                  : ""}
            </p>
          </div>
        </div>
        {jobTitle && (
          <div className="text-sm text-muted-foreground">
            Re: <span className="font-medium">{jobTitle}</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => {
            const isCurrentUser = msg.senderId === currentUser.id;
            return (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  isCurrentUser ? "justify-end" : "justify-start",
                )}
              >
                <div className="flex max-w-[80%]">
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <AvatarImage
                        src={recipient.avatar}
                        alt={recipient.name}
                      />
                      <AvatarFallback>
                        {recipient.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <div
                      className={cn(
                        "rounded-lg p-3",
                        isCurrentUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted",
                      )}
                    >
                      {msg.content && (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {msg.attachments.map((attachment, index) => (
                            <div key={index}>
                              {attachment.type === "image" ? (
                                <img
                                  src={attachment.url}
                                  alt={attachment.name}
                                  className="max-w-full rounded-md max-h-60 object-cover"
                                />
                              ) : (
                                <div className="flex items-center p-2 bg-background rounded-md">
                                  <Paperclip className="h-4 w-4 mr-2" />
                                  <span className="text-sm truncate">
                                    {attachment.name}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div
                      className={cn(
                        "text-xs text-muted-foreground mt-1",
                        isCurrentUser ? "text-right" : "text-left",
                      )}
                    >
                      {formatTimestamp(msg.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Attachment previews */}
      {attachmentPreviews.length > 0 && (
        <div className="px-4 py-2 border-t flex gap-2 overflow-x-auto">
          {attachmentPreviews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt="attachment preview"
                className="h-16 w-16 object-cover rounded-md"
              />
              <button
                onClick={() => removeAttachment(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                type="button"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Message input */}
      <div className="p-4 border-t">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Textarea
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="min-h-[80px] resize-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="h-4 w-4" />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                multiple
              />
            </Button>
            <Button
              type="button"
              size="icon"
              onClick={(e) => handleSendMessage(e)}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageThread;
