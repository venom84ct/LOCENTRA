import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  jobTitle?: string;
}

interface SimpleMessageThreadProps {
  contact: Contact | null;
  messages: Message[];
  currentUserId: string;
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSendMessage: (attachments?: File[]) => void;
}

const SimpleMessageThread: React.FC<SimpleMessageThreadProps> = ({
  contact,
  messages,
  currentUserId,
  newMessage,
  onNewMessageChange,
  onSendMessage,
}) => {
  const [attachments, setAttachments] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() || attachments.length > 0) {
      onSendMessage(attachments);
      setAttachments([]);
      setPreviewUrls([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...newFiles]);

      // Create preview URLs for the new files
      const newUrls = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newUrls]);
    }
  };

  const removeAttachment = (index: number) => {
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(previewUrls[index]);

    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  if (!contact) {
    return (
      <div className="h-full flex items-center justify-center bg-white rounded-md border">
        <div className="text-center p-4">
          <h3 className="font-medium text-lg mb-2">Select a conversation</h3>
          <p className="text-muted-foreground">
            Choose a contact from the list to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-md border">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={contact.avatar} alt={contact.name} />
            <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{contact.name}</h3>
            {contact.jobTitle && (
              <p className="text-sm text-muted-foreground">
                Re: {contact.jobTitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((msg) => {
            const isCurrentUser = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  isCurrentUser ? "justify-end" : "justify-start",
                )}
              >
                <div className="flex max-w-[80%]">
                  {!isCurrentUser && contact && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback>
                        {contact.name.substring(0, 2)}
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
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    <div
                      className={cn(
                        "text-xs text-muted-foreground mt-1",
                        isCurrentUser ? "text-right" : "text-left",
                      )}
                    >
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit}>
          {/* Attachment Previews */}
          {previewUrls.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index}`}
                    className="rounded-md w-20 h-20 object-cover border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full"
                    onClick={() => removeAttachment(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2">
            <Textarea
              placeholder="Type your message..."
              className="min-h-[80px] resize-none flex-1"
              value={newMessage}
              onChange={(e) => onNewMessageChange(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  (newMessage.trim() || attachments.length > 0)
                ) {
                  e.preventDefault();
                  onSendMessage(attachments);
                  setAttachments([]);
                  setPreviewUrls([]);
                }
              }}
              disabled={contact?.messageStatus === "archived"}
            />
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={() => document.getElementById("file-upload")?.click()}
                disabled={contact?.messageStatus === "archived"}
              >
                <ImageIcon className="h-4 w-4" />
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={contact?.messageStatus === "archived"}
                />
              </Button>
              <Button
                type="submit"
                disabled={
                  (!newMessage.trim() && attachments.length === 0) ||
                  contact?.messageStatus === "archived"
                }
                className="h-10 w-10"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {contact?.messageStatus === "archived" && (
            <p className="text-xs text-red-500 mt-2">
              This conversation has been archived by the Centra Resident.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default SimpleMessageThread;
