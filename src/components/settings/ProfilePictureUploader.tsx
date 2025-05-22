import React, { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ProfilePictureUploaderProps {
  currentAvatar: string;
  userName: string;
  onAvatarChange: (newAvatarUrl: string) => void;
}

const ProfilePictureUploader: React.FC<ProfilePictureUploaderProps> = ({
  currentAvatar,
  userName,
  onAvatarChange,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    // In a real app, you would upload the file to a server/storage
    // For this demo, we'll use a local URL and simulate a delay
    const reader = new FileReader();
    reader.onload = (event) => {
      setTimeout(() => {
        if (event.target?.result) {
          // In a real app, this would be the URL returned from your file storage service
          onAvatarChange(event.target.result as string);
          toast({
            title: "Profile picture updated",
            description: "Your profile picture has been updated successfully",
          });
        }
        setIsUploading(false);
      }, 1000); // Simulate network delay
    };
    reader.readAsDataURL(file);
  };

  const handleRandomAvatar = () => {
    setIsUploading(true);
    // Generate a random seed for the avatar
    const randomSeed = Math.random().toString(36).substring(2, 8);
    const newAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;

    // Simulate a delay
    setTimeout(() => {
      onAvatarChange(newAvatarUrl);
      setIsUploading(false);
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully",
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={currentAvatar} alt={userName} />
          <AvatarFallback>{userName.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <Button
          size="icon"
          className="absolute bottom-0 right-0 rounded-full"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>

      <div className="flex flex-col space-y-2 w-full max-w-xs">
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>Upload New Picture</>
          )}
        </Button>
        <Button
          variant="ghost"
          onClick={handleRandomAvatar}
          disabled={isUploading}
        >
          Generate Random Avatar
        </Button>
      </div>
    </div>
  );
};

export default ProfilePictureUploader;
