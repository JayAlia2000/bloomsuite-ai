import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

export default function AuthButtons() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline text-sm text-muted-foreground font-body max-w-[200px] truncate">
          {user.email}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={async () => {
            await signOut();
            navigate("/");
          }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => navigate("/auth?mode=login")}>
        Log in
      </Button>
      <Button variant="hero" size="sm" onClick={() => navigate("/auth?mode=signup")}>
        Sign up
      </Button>
    </div>
  );
}
