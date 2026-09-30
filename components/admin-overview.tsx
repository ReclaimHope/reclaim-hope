import Link from "next/link";
import { ArrowRight, ClipboardList, FileText, Heart, Users, Clock, HandCoins } from "lucide-react";
import { FaChild } from "react-icons/fa6";
import { GoSponsorTiers } from "react-icons/go";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type RecentChild = { id: string; firstName: string; lastName: string; createdAt: Date };
type RecentDonation = { id: string; amount: number; currency: string; createdAt: Date };

type OverviewProps = {
  stats: {
    children: number;
    activeSponsorships: number;
    completedDonations: number;
    publishedNewsletters: number;
    reports: number;
    completedDonationTotal: number;
  };
  recentChildren: RecentChild[];
  recentDonations: RecentDonation[];
  attention: {
    pendingSponsorships: number;
    pendingDonations: number;
    unsponsoredChildren: number;
  };
};

export function AdminOverview({ stats, recentChildren, recentDonations, attention }: OverviewProps) {
  const cards = [
    ["Children", stats.children, "Registered in the system", FaChild, "/admin/children", "text-orange-600", "bg-orange-50"],
    ["Active sponsorships", stats.activeSponsorships, "Currently supporting a child", GoSponsorTiers, "/admin/sponsors", "text-emerald-700", "bg-emerald-50"],
    ["Completed donations", stats.completedDonations, "Successfully recorded", Heart, "/admin/donations", "text-green-700", "bg-green-50"],
    ["Published newsletters", stats.publishedNewsletters, `${stats.reports} reports available`, FileText, "/admin/newsletters", "text-yellow-700", "bg-yellow-50"],
  ] as const;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Administrator dashboard</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Welcome to Reclaim Hope Admin</h1>
        <p className="mt-2 text-sm text-muted-foreground">A live view of the records your team manages.</p>
      </div>

      {/* Attention queue: what needs admin action right now */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Needs attention
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Pending sponsorships",
              value: attention.pendingSponsorships,
              description: "Requests awaiting dashboard setup",
              href: "/admin/sponsors",
              Icon: GoSponsorTiers,
            },
            {
              label: "Pending donations",
              value: attention.pendingDonations,
              description: "Donations awaiting IremboPay",
              href: "/admin/donations",
              Icon: HandCoins,
            },
            {
              label: "Unsponsored children",
              value: attention.unsponsoredChildren,
              description: "Children with no active sponsor",
              href: "/admin/children",
              Icon: FaChild,
            },
          ].map(({ label, value, description, href, Icon }) => (
            <Link key={label} href={href} className="group">
              <Card
                className={`h-full transition-colors group-hover:border-primary/50 ${
                  value > 0 ? "border-amber-300/70 bg-amber-50/40" : ""
                }`}
              >
                <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {label}
                  </CardTitle>
                  <span
                    className={`flex size-9 items-center justify-center rounded-full ${
                      value > 0 ? "bg-amber-100 text-amber-700" : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {value > 0 ? <Clock className="size-5" /> : <Icon className="size-5" />}
                  </span>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold tabular-nums">{value.toLocaleString()}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    {value > 0 ? description : "All clear"}
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, description, Icon, href, iconColor, iconBackground]) => (
          <Link key={label} href={href} className="group">
            <Card className="h-full transition-colors group-hover:border-primary/50">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                <span className={`flex size-9 items-center justify-center rounded-full ${iconBackground}`}><Icon className={`size-5 ${iconColor}`} /></span>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold tabular-nums">{value.toLocaleString()}</p>
                <p className="mt-1 text-xs text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Recent children</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">The latest profiles added by your team.</p>
            </div>
            <Link href="/admin/children" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">Manage <ArrowRight className="size-4" /></Link>
          </CardHeader>
          <CardContent>
            {recentChildren.length === 0 ? <p className="text-sm text-muted-foreground">No children have been registered yet.</p> : (
              <div className="divide-y">
                {recentChildren.map((child) => <div key={child.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"><div className="flex size-9 items-center justify-center rounded-full bg-orange-50 text-orange-600"><Users className="size-4" /></div><div><p className="font-medium">{child.firstName} {child.lastName}</p><p className="text-xs text-muted-foreground">Added {child.createdAt.toLocaleDateString()}</p></div></div>)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completed donations</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{stats.completedDonationTotal.toLocaleString()} total recorded donations</p>
          </CardHeader>
          <CardContent>
            {recentDonations.length === 0 ? <p className="text-sm text-muted-foreground">No completed donations yet.</p> : (
              <div className="divide-y">{recentDonations.map((donation) => <div key={donation.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0"><div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-full bg-green-50 text-green-700"><Heart className="size-4" /></div><p className="text-sm text-muted-foreground">{donation.createdAt.toLocaleDateString()}</p></div><p className="font-semibold tabular-nums">{donation.currency} {donation.amount.toLocaleString()}</p></div>)}</div>
            )}
          </CardContent>
        </Card>
      </div>

            <Link href="/admin/reports" className="flex items-center justify-between rounded-xl border bg-card p-5 transition-colors hover:border-yellow-400/70"><div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-full bg-yellow-50 text-yellow-700"><ClipboardList className="size-5" /></span><div><p className="font-semibold">Transparency reports</p><p className="text-sm text-muted-foreground">{stats.reports} reports are available for management.</p></div></div><ArrowRight className="size-4 text-muted-foreground" /></Link>
    </div>
  );
}
