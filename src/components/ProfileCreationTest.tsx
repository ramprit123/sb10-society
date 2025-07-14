import React, { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const ProfileCreationTest: React.FC = () => {
  const { signUp, checkProfileTrigger, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [triggerStatus, setTriggerStatus] = useState<boolean | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      await signUp(email, password, { name });
      setMessage({
        type: "success",
        text: "User created successfully! Profile should be automatically created.",
      });
      setEmail("");
      setPassword("");
      setName("");
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to create user",
      });
    }
  };

  const checkTrigger = async () => {
    try {
      const status = await checkProfileTrigger();
      setTriggerStatus(status);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to check trigger status" });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile Creation Test</CardTitle>
          <CardDescription>
            Test automatic profile creation when signing up new users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={checkTrigger} variant="outline" className="w-full">
            Check Database Trigger Status
          </Button>

          {triggerStatus !== null && (
            <Alert>
              <AlertDescription>
                Database trigger status:{" "}
                {triggerStatus ? "✅ Active" : "❌ Not found"}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 characters)"
                minLength={6}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating User..." : "Test Sign Up"}
            </Button>
          </form>

          {message && (
            <Alert
              variant={message.type === "error" ? "destructive" : "default"}
            >
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
