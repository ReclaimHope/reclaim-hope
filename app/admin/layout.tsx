import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { verifyAdminSession } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side authentication check: redirects to /login if unauthenticated
  await verifyAdminSession();

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full flex-1 flex flex-col min-h-screen bg-background font-sans">
          {/* Slim sticky top bar: collapse toggle + shortcut to public site */}
          <header className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-border/40 bg-background/90 px-4 py-2.5 backdrop-blur">
            <div className="flex items-center gap-2">
              <SidebarTrigger aria-label="Toggle sidebar" />
              <span className="hidden text-sm font-semibold sm:inline">Admin Console</span>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ExternalLink className="size-3.5" />
              View public site
            </Link>
          </header>
          <div className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}
