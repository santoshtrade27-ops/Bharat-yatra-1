import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const { sendPasswordReset } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await sendPasswordReset(email);
      setMessage(res.message || `Password reset instructions sent to ${email}`);
      setSent(true);
    } catch (err) {
      setMessage(`Password reset instructions sent to ${email}`);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 flex flex-col items-center justify-center max-w-4xl mx-auto space-y-8">
      <div className="w-full max-w-md">
        <AuthLayout
          icon={Mail}
          title="Reset your password"
          subtitle="We will send you instructions to reset your account password"
          footer={
            <Link to="/login" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
            </Link>
          }
        >
          {sent ? (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto grid place-items-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-foreground">
                {message}
              </p>
              <p className="text-xs text-muted-foreground">
                Please check your inbox (and spam folder) for the recovery instructions.
              </p>
              <Button asChild className="w-full h-11 font-bold text-sm mt-4">
                <Link to="/login">Return to Sign In</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold text-foreground">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 text-sm bg-background"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-11 font-bold text-sm" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending recovery link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          )}
        </AuthLayout>
      </div>
    </div>
  );
}
