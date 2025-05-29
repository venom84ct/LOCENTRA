import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const PostJobForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [isEmergency, setIsEmergency] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    budget: "",
    timeline: "within-week",
    paymentMethod: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      const filtered = fileArray.filter(file => file.size < 5 * 1024 * 1024); // limit size to 5MB
      setImages(filtered);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setUploading(true);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setError("You must be logged in.");
      setUploading(false);
      return;
    }

    const uploadedUrls: string[] = [];

    for (const file of images) {
      const path = `jobs/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("job-images")
        .upload(path, file);

      if (uploadError) {
        setError("Image upload failed: " + uploadError.message);
        setUploading(false);
        return;
      }

      const { data: urlData } = await supabase.storage
        .from("job-images")
        .getPublicUrl(path);

      if (urlData?.publicUrl) {
        uploadedUrls.push(urlData.publicUrl);
      }
    }

    const { error: insertError } = await supabase.from("jobs").insert([
      {
        homeowner_id: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        budget: formData.budget,
        timeline: formData.timeline,
        payment_method: isEmergency ? formData.paymentMethod : null,
        is_emergency: isEmergency,
        image_urls: uploadedUrls,
        created_at: new Date().toISOString(),
        status: "open",
      },
    ]);

    setUploading(false);

    if (insertError) {
      setError("Failed to post job: " + insertError.message);
      return;
    }

    if (onSuccess) {
      onSuccess();
    } else {
      setSuccess("✅ Job posted successfully!");
      setFormData({
        title: "",
        description: "",
        category: "",
        location: "",
        budget: "",
        timeline: "within-week",
        paymentMethod: "",
      });
      setIsEmergency(false);
      setImages([]);
      setTimeout(() => navigate("/dashboard/jobs"), 1500);
    }
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle>Post a New Job</CardTitle>
        <CardDescription>
          Fill in the job details to receive quotes from tradies.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Label>Job Title</Label>
          <Input name="title" value={formData.title} onChange={handleChange} required />

          <Label>Category</Label>
          <Select value={formData.category} onValueChange={(v) => handleSelectChange("category", v)} required>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="plumbing">Plumbing</SelectItem>
              <SelectItem value="electrical">Electrical</SelectItem>
              <SelectItem value="cleaning">Cleaning</SelectItem>
              <SelectItem value="carpentry">Carpentry</SelectItem>
              <SelectItem value="painting">Painting</SelectItem>
              <SelectItem value="hvac">HVAC</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Label>Description</Label>
          <Textarea name="description" value={formData.description} onChange={handleChange} required />

          <Label>Location</Label>
          <Input name="location" value={formData.location} onChange={handleChange} required />

          <Label>Budget</Label>
          <Input name="budget" value={formData.budget} onChange={handleChange} required />

          <Label>Timeline</Label>
          <Select value={formData.timeline} onValueChange={(v) => handleSelectChange("timeline", v)} required>
            <SelectTrigger><SelectValue placeholder="Choose timeline" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="asap">ASAP</SelectItem>
              <SelectItem value="within-week">Within a week</SelectItem>
              <SelectItem value="within-month">Within a month</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>

          <div className="pt-4 border-t">
            <Label>Emergency Job</Label>
            <Switch id="emergency" checked={isEmergency} onCheckedChange={setIsEmergency} />
          </div>

          {isEmergency && (
            <>
              <Label>Payment Method</Label>
              <Select value={formData.paymentMethod} onValueChange={(v) => handleSelectChange("paymentMethod", v)} required>
                <SelectTrigger><SelectValue placeholder="Select payment" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit-card">Credit Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}

          <Label>Upload Images</Label>
          <Input type="file" accept="image/*" multiple onChange={handleFileChange} />

          {images.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4">
              {images.map((file, index) => (
                <div key={index} className="relative w-32 h-32 border rounded overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...images];
                      updated.splice(index, 1);
                      setImages(updated);
                    }}
                    className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <CardFooter>
            <Button type="submit" disabled={uploading} className="w-full">
              {uploading ? "Submitting..." : isEmergency ? "Pay $10 & Post Emergency Job" : "Post Job"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default PostJobForm;


    
