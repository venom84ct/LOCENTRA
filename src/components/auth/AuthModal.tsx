import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AuthModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultTab?: "login" | "register";
  defaultUserType?: "homeowner" | "tradie";
}

const AuthModal = ({
  isOpen = true,
  onOpenChange,
  defaultTab = "login",
  defaultUserType = "homeowner",
}: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">(defaultTab);
  const [userType, setUserType] = useState<"homeowner" | "tradie">(
    defaultUserType,
  );
  const [registrationStep, setRegistrationStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [abnNumber, setAbnNumber] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // For demo purposes, show an error
      setError("Invalid email or password. Please try again.");
    }, 1500);
  };

  const handleRegisterNext = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate form
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setRegistrationStep(registrationStep + 1);
    }, 1000);
  };

  const handleRegisterComplete = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // For demo purposes, show success and close modal
      if (onOpenChange) {
        onOpenChange(false);
      }
    }, 1500);
  };

  const resetRegistration = () => {
    setRegistrationStep(1);
    setError(null);
  };

  const renderLoginForm = () => (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="password">Password</Label>
          <Button variant="link" className="p-0 h-auto text-xs" type="button">
            Forgot password?
          </Button>
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      <div className="text-center text-sm">
        Don't have an account?{" "}
        <Button
          variant="link"
          className="p-0"
          onClick={() => {
            setActiveTab("register");
            resetRegistration();
          }}
        >
          Sign up
        </Button>
      </div>
    </form>
  );

  const renderRegistrationStep1 = () => (
    <form onSubmit={handleRegisterNext} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reg-email">Email</Label>
        <Input
          id="reg-email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-password">Password</Label>
        <Input
          id="reg-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={agreeTerms}
          onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
          required
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I agree to the{" "}
          <Button variant="link" className="p-0 h-auto text-xs" type="button">
            terms of service
          </Button>{" "}
          and{" "}
          <Button variant="link" className="p-0 h-auto text-xs" type="button">
            privacy policy
          </Button>
        </label>
      </div>

      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !agreeTerms}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Continue"
        )}
      </Button>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Button
          variant="link"
          className="p-0"
          onClick={() => setActiveTab("login")}
        >
          Sign in
        </Button>
      </div>
    </form>
  );

  const renderTradieVerification = () => (
    <form onSubmit={handleRegisterComplete} className="space-y-4">
      <div className="rounded-lg bg-muted p-4 mb-4">
        <h4 className="font-medium mb-2">Tradie Verification</h4>
        <p className="text-sm text-muted-foreground mb-2">
          To offer services on Locentra, we need to verify your trade
          credentials.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="license">License Number</Label>
        <Input
          id="license"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="abn">ABN Number</Label>
        <Input
          id="abn"
          value={abnNumber}
          onChange={(e) => setAbnNumber(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Trade Categories</Label>
        <div className="grid grid-cols-2 gap-2">
          {["Plumbing", "Electrical", "Carpentry", "Painting"].map((trade) => (
            <div key={trade} className="flex items-center space-x-2">
              <Checkbox id={`trade-${trade}`} />
              <label
                htmlFor={`trade-${trade}`}
                className="text-sm font-medium leading-none"
              >
                {trade}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Upload Documents</Label>
        <div className="grid gap-2">
          <div className="flex items-center justify-between p-2 border rounded-md">
            <span className="text-sm">License Document</span>
            <Button size="sm" variant="outline">
              Upload
            </Button>
          </div>
          <div className="flex items-center justify-between p-2 border rounded-md">
            <span className="text-sm">Insurance Certificate</span>
            <Button size="sm" variant="outline">
              Upload
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex space-x-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => setRegistrationStep(1)}
        >
          Back
        </Button>
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Complete Registration"
          )}
        </Button>
      </div>
    </form>
  );

  const renderEmailVerification = () => (
    <div className="space-y-4 text-center">
      <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <CheckCircle2 className="h-6 w-6 text-primary" />
      </div>

      <h3 className="text-lg font-medium">Verify your email</h3>
      <p className="text-sm text-muted-foreground">
        We've sent a verification link to <strong>{email}</strong>. Please check
        your inbox and click the link to complete your registration.
      </p>

      <div className="pt-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            // In a real app, this would resend the verification email
            // For now, just show a message
            alert("Verification email resent!");
          }}
        >
          Resend verification email
        </Button>
      </div>

      <div className="text-center text-sm pt-2">
        <Button
          variant="link"
          className="p-0"
          onClick={() => setActiveTab("login")}
        >
          Back to login
        </Button>
      </div>
    </div>
  );

  const renderRegistrationContent = () => {
    if (registrationStep === 1) {
      return renderRegistrationStep1();
    } else if (registrationStep === 2) {
      return userType === "tradie"
        ? renderTradieVerification()
        : renderEmailVerification();
    }
    return null;
  };

  const renderUserTypeSelector = () => (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Card
        className={`cursor-pointer ${userType === "homeowner" ? "border-primary" : ""}`}
        onClick={() => setUserType("homeowner")}
      >
        <CardHeader className="p-4">
          <Avatar className="h-10 w-10 mx-auto">
            <AvatarImage
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=homeowner"
              alt="Homeowner"
            />
            <AvatarFallback>HO</AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent className="text-center p-4 pt-0">
          <CardTitle className="text-base">Homeowner</CardTitle>
          <CardDescription className="text-xs mt-1">
            Post jobs for free
          </CardDescription>
        </CardContent>
      </Card>

      <Card
        className={`cursor-pointer ${userType === "tradie" ? "border-primary" : ""}`}
        onClick={() => setUserType("tradie")}
      >
        <CardHeader className="p-4">
          <Avatar className="h-10 w-10 mx-auto">
            <AvatarImage
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=tradie"
              alt="Tradie"
            />
            <AvatarFallback>TR</AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent className="text-center p-4 pt-0">
          <CardTitle className="text-base">Tradie</CardTitle>
          <CardDescription className="text-xs mt-1">
            Find jobs & get leads
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {activeTab === "login" ? "Welcome Back" : "Create Account"}
          </DialogTitle>
        </DialogHeader>

        {activeTab === "login" ? (
          renderLoginForm()
        ) : (
          <>
            {renderUserTypeSelector()}
            {renderRegistrationContent()}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
