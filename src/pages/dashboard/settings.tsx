import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import ProfilePictureUploader from "@/components/settings/ProfilePictureUploader";
import { supabase } from "@/lib/supabaseClient";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      const userId = data.user?.id;
      if (!userId || error) {
        setLoading(false);
        navigate("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profile_centra_resident")
        .select("*")
        .eq("id", userId)
        .single();

      setUser(profile);
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleAvatarChange = (newAvatarUrl: string) => {
    setUser((prev) => ({
      ...prev,
      avatar: newAvatarUrl,
    }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully",
    });
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Notification preferences updated",
      description:
        "Your notification preferences have been updated successfully",
    });
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Password updated",
      description: "Your password has been updated successfully",
    });
  };

  if (loading) return <div className="p-8">Loading settings...</div>;
  if (!user) return <div className="p-8 text-red-600">Unable to load user.</div>;

  return (
    <DashboardLayout userType="centraResident" user={user}>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                  <CardDescription>Update your profile picture</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfilePictureUploader
                    currentAvatar={user.avatar}
                    userName={user.name}
                    onAvatarChange={handleAvatarChange}
                  />
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={user.name} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue={user.email}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" defaultValue={user.phone} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" defaultValue={user.address} />
                      </div>
                    </div>

                    <Button type="submit" className="mt-4">
                      Save Changes
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveNotifications} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via SMS
                        </p>
                      </div>
                      <Switch />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">New Job Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified when new jobs match your skills
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing Communications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about new features and promotions
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <Button type="submit">Save Preferences</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Update your password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSavePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <Input id="confirm-password" type="password" />
                  </div>

                  <Button type="submit" className="mt-4">
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
