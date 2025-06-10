import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

interface JobImageUploaderProps {
  onUploadComplete: (urls: string[]) => void;
}

const JobImageUploader: React.FC<JobImageUploaderProps> = ({ onUploadComplete }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `jobs/${fileName}`; // ✅ use correct path here

      const { error } = await supabase.storage
        .from("job-images") // ✅ this must match the bucket you're using
        .upload(filePath, file);

      if (!error) {
        const { data } = supabase.storage
          .from("job-images")
          .getPublicUrl(filePath);
        uploadedUrls.push(data.publicUrl);
      } else {
        console.error("Upload failed:", error.message);
      }
    }

    setUploading(false);
    onUploadComplete(uploadedUrls);
  };

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" multiple onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={uploading || files.length === 0}>
        {uploading ? "Uploading..." : "Upload Images"}
      </Button>
    </div>
  );
};

export default JobImageUploader;
