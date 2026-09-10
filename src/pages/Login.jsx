import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  LogIn, Mail, Lock, Loader2
} from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { safeReturnTo } from "@/lib/authReturnTo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginWithEmailPassword, loginWithGoogle, quickSwitchRole } = useAuth();
  const navigate = useNavigate();
  const returnTo = safeReturnTo();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const loggedUser = await loginWithEmailPassword(email, password);
      if (loggedUser.role === "tourist") {
        navigate("/profile");
      } else {
        navigate(returnTo !== "/login" && returnTo !== "/" ? returnTo : "/admin");
      }
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate(returnTo !== "/login" ? returnTo : "/admin");
    } catch (err) {
      setError(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (cred) => {
    setEmail(cred.email);
    setPassword(cred.password);
    quickSwitchRole(cred.role);
    if (cred.role === "tourist") {
      navigate("/profile");
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 flex flex-col items-center justify-center max-w-4xl mx-auto space-y-8">
      <div className="w-full max-w-md">
        <AuthLayout
          icon={LogIn}
          title="Sign in to Bharat Yatra"
          subtitle="Access your designated employee cockpit or traveler profile"
          footer={
            <>
              Don't have an account?{" "}
              <Link
                to={"/register" + (returnTo !== "/" ? "?returnTo=" + encodeURIComponent(returnTo) : "")}
                className="text-primary font-medium hover:underline"
              >
                Create one
              </Link>
            </>
          }
        >
          <Button
            variant="outline"
            className="w-full h-12 text-sm font-medium mb-4"
            onClick={handleGoogle}
            disabled={loading}
          >
            <GoogleIcon className="w-5 h-5 mr-2" />
            Continue with Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-3 text-muted-foreground font-semibold">Or Email Credentials</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-foreground">Email Address</Label>
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

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-bold text-foreground">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 text-sm bg-background"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 font-bold text-sm" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </Button>
          </form>
        </AuthLayout>
      </div>
    </div>
  );
}
