import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
          <SidebarTrigger />
        <main className="mx-auto w-full">
          {children}
        </main>
      </SidebarProvider>
    </TooltipProvider>
  )
}