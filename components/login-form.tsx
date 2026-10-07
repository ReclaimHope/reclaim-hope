"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, User, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { loginAction } from "@/app/actions/auth";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !password) {
      setErrorMessage("Please enter both username and password.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.set("username", username);
      formData.set("password", password);

      const result = await loginAction(null, formData);

      if (result.success) {
        toast.success("Authentication successful! Redirecting...", {
          description: "Welcome to the Reclaim Hope Admin Dashboard.",
        });
        router.push(callbackUrl);
        router.refresh();
      } else {
        const error = result.error || "Invalid username or password.";
        setErrorMessage(error);
        toast.error("Login Failed", { description: error });
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex flex-col gap-6 bg-card text-card-foreground shadow-xl border border-border/50 px-7 py-8 rounded-2xl transition-all",
        className
      )}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center pb-2">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-1">
            <ShieldCheck className="size-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Portal</h1>
          <p className="text-sm text-muted-foreground">
            Sign in with authorized administrative credentials
          </p>
        </div>

        {errorMessage && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3.5 text-sm text-destructive animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="size-5 shrink-0 mt-0.5" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="username" className="text-sm font-medium">
            Username
          </FieldLabel>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
              <User className="size-4" />
            </div>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Enter admin username"
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              disabled={isPending}
              className="pl-9 bg-background h-10 transition-colors"
            />
          </div>
        </Field>

        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="password" className="text-sm font-medium">
              Password
            </FieldLabel>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
              <Lock className="size-4" />
            </div>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={isPending}
              className="pl-9 pr-10 bg-background h-10 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </Field>

        <Field className="pt-2">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-10 font-medium cursor-pointer shadow-sm transition-all"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              "Sign In to Dashboard"
            )}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
