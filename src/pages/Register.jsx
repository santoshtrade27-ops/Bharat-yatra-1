import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/components/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Lock, Loader2, KeyRound } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { toast } from "@/components/ui/use-toast";
import { safeReturnTo } from "@/lib/authReturnTo";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const { registerWithFirebase, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      // Create real account in Firebase Auth and send actual verification email to user inbox
      const newUser = await registerWithFirebase(email, password);
      
      toast({
        title: "Account Created & Verification Email Sent!",
        description: `A verification link was sent to ${email}. Check your inbox!`,
      });

      const target = safeReturnTo();
      if (target && target !== "/" && target !== "/login" && target !== "/register" && target !== "/admin") {
        navigate(target);
      } else {
        if (newUser?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/profile");
        }
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) {
        base44.auth.setToken(result.access_token);
      }
      
      // Complete login as Tourist into AuthContext
      const registeredUser = await loginWithEmailPassword(email, password);
      toast({
        title: "Account Created!",
        description: `Welcome to Bharat Yatra, ${registeredUser.full_name || 'Traveler'}!`,
      });
      
      const target = safeReturnTo();
      if (target && target !== "/" && target !== "/login" && target !== "/register" && target !== "/admin") {
        navigate(target);
      } else {
        navigate("/profile");
      }
    } catch (err) {
      setError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFillOtp = () => {
    setOtpCode("123456");
  };

  const handleResend = async () => {
    setError("");
    try {
      await base44.auth.resendOtp(email);
      setOtpCode("123456");
      toast({
        title: "Verification code sent",
        description: "Use code 123456 to verify your account.",
      });
    } catch (err) {
      setError(err.message || "Failed to resend code");
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const loggedUser = await loginWithGoogle();
      if (loggedUser?.role === "tourist") {
        navigate("/profile");
      } else {
        navigate("/admin");
      }
    } catch (err) {
      setError(err.message || "Google sign in failed");
    } finally {
      setLoading(false);
    }
  };

  if (showOtp) {
    return (
      <AuthLayout
        icon={Mail}
        title="Verify your email address"
        subtitle={`Verification sent to ${email}`}
      >
        <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 text-foreground text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-primary text-sm">
            <KeyRound className="w-4 h-4" />
            Verification Code Instructions
          </div>
          <p className="text-muted-foreground">
            Enter the 6-digit OTP code below. For instant verification in demo mode, use code: <strong className="text-foreground font-mono text-sm bg-background px-2 py-0.5 rounded border border-border">123456</strong>
          </p>
          <Button 
            type="button" 
            variant="secondary" 
            size="sm" 
            onClick={handleAutoFillOtp}
            className="w-full text-xs font-bold mt-1"
          >
            Auto-Fill Verification Code (123456)
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-medium">
            {error}
          </div>
        )}
        <div className="flex justify-center mb-6">
          <InputOTP
            maxLength={6}
            value={otpCode}
            onChange={setOtpCode}
            autoFocus
            autoComplete="one-time-code"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button
          className="w-full h-12 font-bold text-sm"
          onClick={handleVerify}
          disabled={loading || otpCode.length < 6}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Verifying Account...
            </>
          ) : (
            "Verify & Complete Sign Up"
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground mt-4">
          Didn't receive the code?{" "}
          <button onClick={handleResend} className="text-primary font-bold hover:underline">
            Resend Code (123456)
          </button>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={UserPlus}
      title="Create your account"
      subtitle="Sign up to get started"
      footer={
        <>
          Already have an account?{" "}
          <Link
            to={"/login" + (safeReturnTo() !== "/" ? "?returnTo=" + encodeURIComponent(safeReturnTo()) : "")}
            className="text-primary font-medium hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      <Button
        variant="outline"
        className="w-full h-12 text-sm font-medium mb-6"
        onClick={handleGoogle}
      >
        <GoogleIcon className="w-5 h-5 mr-2" />
        Continue with Google
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">or</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
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
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
