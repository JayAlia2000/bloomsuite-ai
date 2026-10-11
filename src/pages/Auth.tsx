import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Flower2, Loader2 } from "lucide-react";

type Mode = "login" | "signup" | "forgot";

function safeRedirect(r: string | null) {
  if (!r || !r.startsWith("/") || r.startsWith("//")) return "/dashboard";
  return r;
}

export default function Auth() {
  const [params, setParams] = useSearchParams();
  const initial = params.get("mode");
  const [mode, setMode] = useState<Mode>(initial === "login" || initial === "forgot" ? initial : "signup");
  const redirect = safeRedirect(params.get("redirect"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) navigate(redirect, { replace: true });
  }, [user, redirect, navigate]);

  const switchMode = (m: Mode) => {
    setMode(m);
    setNotice("");
    const next = new URLSearchParams(params);
    next.set("mode", m);
    setParams(next, { replace: true });
  };

  const fail = (msg: string) => toast({ variant: "destructive", title: "Something went wrong", description: msg });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setNotice("");
    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) {
          const m = error.message.toLowerCase();
          if (m.includes("email not confirmed")) fail("Please confirm your email first — check your inbox.");
          else if (m.includes("invalid login")) fail("Incorrect email or password.");
          else fail(error.message);
        }
      } else if (mode === "signup") {
        if (password.length < 6) return fail("Password must be at least 6 characters.");
        const { error } = await signUp(email, password, undefined, redirect);
        if (error) {
          const m = error.message.toLowerCase();
          if (m.includes("already")) fail("An account with this email already exists. Try logging in.");
          else if (m.includes("pwned") || m.includes("weak") || m.includes("leaked"))
            fail("This password has appeared in a data leak. Please choose a different one.");
          else fail(error.message);
        } else {
          setNotice("Check your email to confirm your account, then log in.");
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) fail(error.message);
        else setNotice("If an account exists for this email, a reset link is on its way.");
      }
    } finally {
      setBusy(false);
    }
  };

  const titles = {
    login: ["Welcome back", "Log in to continue growing your beauty brand"],
    signup: ["Create your account", "Sign up to unlock all Bloom Suite AI tools"],
    forgot: ["Reset your password", "We'll email you a link to set a new one"],
  } as const;

  return (
    <div className="min-h-screen gradient-soft flex flex-col">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl animate-float" />
      </div>

      <header className="relative z-10 container mx-auto px-4 py-6">
        <Link to="/" className="flex items-center gap-3 w-fit">
          <div className="h-10 w-10 gradient-hero rounded-xl flex items-center justify-center shadow-soft">
            <Flower2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-display font-semibold text-foreground">Bloom Suite AI</span>
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 pb-16">
        <Card variant="elevated" className="w-full max-w-md animate-fade-in-up">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-3xl">{titles[mode][0]}</CardTitle>
            <CardDescription>{titles[mode][1]}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@yourbrand.com" />
              </div>
              {mode !== "forgot" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {mode === "login" && (
                      <button type="button" onClick={() => switchMode("forgot")} className="text-xs text-primary hover:underline">
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                </div>
              )}

              {notice && (
                <p className="text-sm text-foreground bg-accent/50 border border-primary/10 rounded-lg p-3">{notice}</p>
              )}

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={busy}>
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                {mode === "login" ? "Log in" : mode === "signup" ? "Sign up" : "Send reset link"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "login" && (
                <>New to Bloom Suite AI?{" "}
                  <button onClick={() => switchMode("signup")} className="text-primary font-medium hover:underline">Create account</button>
                </>
              )}
              {mode === "signup" && (
                <>Already have an account?{" "}
                  <button onClick={() => switchMode("login")} className="text-primary font-medium hover:underline">Log in</button>
                </>
              )}
              {mode === "forgot" && (
                <button onClick={() => switchMode("login")} className="text-primary font-medium hover:underline">Back to log in</button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
