'use client';

import useSWR, { mutate } from 'swr';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  UserCheck,
  Clock,
  CheckCircle2,
  DollarSign,
  Copy,
  XCircle,
  ChevronDown,
  ChevronUp,
  Search,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  activateSponsorshipRequest,
  cancelSponsorshipRequest,
} from '@/app/actions/sponsorship';
import { toast } from 'sonner';
import { useState } from 'react';
import { Fragment } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('Subscription reference copied. Paste it into the IremboPay dashboard.');
  } catch {
    toast.error('Could not copy to clipboard.');
  }
}

export default function SponsorsTable() {
  const { data: sponsorships, error, isLoading } = useSWR('/api/sponsorships', fetcher);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'ACTIVE' | 'CANCELLED'>('ALL');

  // The API returns { success: false, ... } on error — never call .filter on that.
  const list: {
    id: string;
    status: string;
    amount: number;
    currency: string;
    frequency: string;
    subscriptionReference: string | null;
    requestedStartDate: string | null;
    chargesCount: number | null;
    createdAt: string;
    donor: { name: string; email: string; phoneNumber: string | null; country: string | null; address: string | null };
    child: { name: string };
  }[] = Array.isArray(sponsorships) ? sponsorships : [];

  const counts = {
    ALL: list.length,
    PENDING: list.filter((s) => s.status === 'PENDING').length,
    ACTIVE: list.filter((s) => s.status === 'ACTIVE').length,
    CANCELLED: list.filter((s) => s.status === 'CANCELLED').length,
  };

  const visible = list.filter((s) => {
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [
      s.donor.name,
      s.donor.email,
      s.donor.phoneNumber ?? '',
      s.child.name,
      s.subscriptionReference ?? '',
      s.status,
    ].some((v) => v.toLowerCase().includes(q));
  });

  const refresh = () => {
    mutate('/api/sponsorships');
    mutate('/api/children');
  };

  const handleActivate = async (id: string) => {
    try {
      setProcessingId(id);
      const res = await activateSponsorshipRequest(id);
      if (res.success) {
        toast.success('Subscription marked ACTIVE! Make sure it was created in the IremboPay dashboard first.');
        refresh();
      } else {
        toast.error(res.error || 'Failed to activate sponsorship.');
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      setProcessingId(id);
      const res = await cancelSponsorshipRequest(id);
      if (res.success) {
        toast.success('Sponsorship cancelled.');
        refresh();
      } else {
        toast.error(res.error || 'Failed to cancel sponsorship.');
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setProcessingId(null);
    }
  };

  const totalActive = list.filter((s) => s.status === 'ACTIVE').length || 0;
  const totalPending = list.filter((s) => s.status === 'PENDING').length || 0;
  const totalRevenue = list
    .filter((s) => s.status === 'ACTIVE')
    .reduce((sum, s) => sum + Number(s.amount), 0) || 0;

  return (
    <div className="space-y-6 mx-auto px-4 max-w-7xl sm:px-6 lg:px-8 py-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Sponsors &amp; Subscriptions</h2>
          <p className="text-sm text-gray-500">
            Review sponsorship requests, copy the subscription reference into the IremboPay dashboard
            (customer + subscription), then activate here.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search donor, child, reference..."
            aria-label="Search sponsorships"
            className="pl-9 bg-white"
          />
        </div>
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        {(['ALL', 'PENDING', 'ACTIVE', 'CANCELLED'] as const).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              statusFilter === status
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()} ({counts[status]})
          </button>
        ))}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Active Sponsors
            </p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{totalActive}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Pending Requests
            </p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{totalPending}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-yellow-700">
              Active Commitment Vol.
            </p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-1">${totalRevenue.toLocaleString()} USD</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Sponsorship Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/75">
              <TableHead className="font-semibold text-gray-700">Donor</TableHead>
              <TableHead className="font-semibold text-gray-700">Child</TableHead>
              <TableHead className="font-semibold text-gray-700">Plan</TableHead>
              <TableHead className="font-semibold text-gray-700">Start / Charges</TableHead>
              <TableHead className="font-semibold text-gray-700">Subscription Ref</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
              <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Loading sponsorships data...
                </TableCell>
              </TableRow>
            ) : error || !Array.isArray(sponsorships) ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-red-500">
                  Failed to load sponsorships.
                </TableCell>
              </TableRow>
            ) : visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  {list.length === 0
                    ? 'No sponsorship requests yet.'
                    : 'No requests match your search or filter.'}
                </TableCell>
              </TableRow>
            ) : (
              visible.map((s) => {
                const expanded = expandedId === s.id;
                return (
                  <Fragment key={s.id}>
                    <TableRow className="hover:bg-gray-50/50">
                      <TableCell>
                        <div className="font-medium text-gray-900">{s.donor.name}</div>
                        <div className="text-xs text-gray-500">{s.donor.email}</div>
                        {s.donor.phoneNumber && (
                          <div className="text-xs text-gray-500">{s.donor.phoneNumber}</div>
                        )}
                      </TableCell>

                      <TableCell className="font-medium text-gray-900">
                        {s.child.name}
                      </TableCell>

                      <TableCell>
                        <div className="font-semibold text-gray-900">
                          ${s.amount} {s.currency}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {s.frequency.toLowerCase()}
                        </div>
                      </TableCell>

                      <TableCell className="text-xs text-gray-600">
                        {s.requestedStartDate ? (
                          <div>Starts: {new Date(s.requestedStartDate).toLocaleDateString()}</div>
                        ) : (
                          <div className="text-gray-400">—</div>
                        )}
                        <div className="text-gray-500">
                          {s.chargesCount ? `${s.chargesCount}x charges` : 'Indefinite'}
                        </div>
                      </TableCell>

                      <TableCell>
                        {s.subscriptionReference ? (
                          <button
                            type="button"
                            onClick={() => copyText(s.subscriptionReference as string)}
                            title="Copy for IremboPay dashboard"
                            className="inline-flex items-center gap-1.5 font-mono text-xs text-gray-800 font-semibold bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-2 py-1"
                          >
                            {s.subscriptionReference}
                            <Copy className="w-3.5 h-3.5 text-gray-500" />
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </TableCell>

                      <TableCell>
                        {s.status === 'ACTIVE' ? (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-medium">
                            Active
                          </Badge>
                        ) : s.status === 'PENDING' ? (
                          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 font-medium">
                            Pending Setup
                          </Badge>
                        ) : s.status === 'CANCELLED' ? (
                          <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200 font-medium">
                            Cancelled
                          </Badge>
                        ) : (
                          <Badge variant="secondary">{s.status}</Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setExpandedId(expanded ? null : s.id)}
                            className="text-xs rounded-lg px-2 py-1 h-8"
                            title={expanded ? 'Hide customer details' : 'View full customer details'}
                          >
                            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            Details
                          </Button>
                          {s.status === 'PENDING' && (
                            <Button
                              size="sm"
                              onClick={() => handleActivate(s.id)}
                              disabled={processingId === s.id}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg px-3 py-1 font-semibold h-8"
                            >
                              {processingId === s.id ? 'Activating...' : 'Activate'}
                            </Button>
                          )}
                          {s.status === 'ACTIVE' && (
                            <span className="text-xs text-emerald-700 font-semibold inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Active
                            </span>
                          )}
                          {(s.status === 'PENDING' || s.status === 'ACTIVE') && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancel(s.id)}
                              disabled={processingId === s.id}
                              className="text-xs rounded-lg px-3 py-1 font-semibold h-8 text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <XCircle className="w-3.5 h-3.5 mr-1" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    {expanded && (
                      <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
                        <TableCell colSpan={7} className="py-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                            <div className="rounded-xl bg-white border border-gray-200 p-4">
                              <p className="font-bold text-gray-900 mb-2 uppercase tracking-wider text-[11px]">
                                Customer details (for dashboard)
                              </p>
                              <dl className="space-y-1.5 text-gray-700">
                                <div className="flex justify-between gap-2">
                                  <dt className="text-gray-500">Full name</dt>
                                  <dd className="font-semibold text-right">{s.donor.name}</dd>
                                </div>
                                <div className="flex justify-between gap-2">
                                  <dt className="text-gray-500">Email</dt>
                                  <dd className="font-semibold text-right break-all">{s.donor.email}</dd>
                                </div>
                                <div className="flex justify-between gap-2">
                                  <dt className="text-gray-500">Phone</dt>
                                  <dd className="font-semibold text-right">{s.donor.phoneNumber || '—'}</dd>
                                </div>
                                <div className="flex justify-between gap-2">
                                  <dt className="text-gray-500">Country</dt>
                                  <dd className="font-semibold text-right">{s.donor.country || '—'}</dd>
                                </div>
                                <div className="flex justify-between gap-2">
                                  <dt className="text-gray-500">Address</dt>
                                  <dd className="font-semibold text-right">{s.donor.address || '—'}</dd>
                                </div>
                              </dl>
                            </div>
                            <div className="rounded-xl bg-white border border-gray-200 p-4">
                              <p className="font-bold text-gray-900 mb-2 uppercase tracking-wider text-[11px]">
                                Subscription setup (for dashboard)
                              </p>
                              <dl className="space-y-1.5 text-gray-700">
                                <div className="flex justify-between gap-2">
                                  <dt className="text-gray-500">Plan</dt>
                                  <dd className="font-semibold text-right capitalize">
                                    {s.frequency.toLowerCase()} (${s.amount} {s.currency})
                                  </dd>
                                </div>
                                <div className="flex justify-between gap-2">
                                  <dt className="text-gray-500">Start date</dt>
                                  <dd className="font-semibold text-right">
                                    {s.requestedStartDate
                                      ? new Date(s.requestedStartDate).toLocaleDateString()
                                      : '—'}
                                  </dd>
                                </div>
                                <div className="flex justify-between gap-2">
                                  <dt className="text-gray-500">Charges</dt>
                                  <dd className="font-semibold text-right">
                                    {s.chargesCount ? `${s.chargesCount}x` : 'Indefinite'}
                                  </dd>
                                </div>
                                <div className="flex justify-between gap-2">
                                  <dt className="text-gray-500">Reference</dt>
                                  <dd>
                                    <button
                                      type="button"
                                      onClick={() => copyText(s.subscriptionReference as string)}
                                      className="inline-flex items-center gap-1 font-mono font-semibold text-gray-900 hover:text-emerald-700"
                                    >
                                      {s.subscriptionReference}
                                      <Copy className="w-3 h-3" />
                                    </button>
                                  </dd>
                                </div>
                              </dl>
                            </div>
                            <div className="rounded-xl bg-white border border-gray-200 p-4">
                              <p className="font-bold text-gray-900 mb-2 uppercase tracking-wider text-[11px]">
                                Record info
                              </p>
                              <dl className="space-y-1.5 text-gray-700">
                                <div className="flex justify-between gap-2">
                                  <dt className="text-gray-500">Requested</dt>
                                  <dd className="font-semibold text-right">
                                    {new Date(s.createdAt).toLocaleString()}
                                  </dd>
                                </div>
                                <div className="flex justify-between gap-2">
                                  <dt className="text-gray-500">Sponsored child</dt>
                                  <dd className="font-semibold text-right">{s.child.name}</dd>
                                </div>
                                <div className="flex justify-between gap-2">
                                  <dt className="text-gray-500">Status</dt>
                                  <dd className="font-semibold text-right">{s.status}</dd>
                                </div>
                              </dl>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Admin workflow hint */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-800 leading-relaxed">
        <p className="font-semibold text-blue-900 mb-1">Manual subscription workflow</p>
        <p>
          1. Click a subscription reference to copy it. 2. In the IremboPay dashboard, create the
          customer (name, email, phone) and generate the subscription with the matching plan, start
          date, charge count, and pasted reference. 3. Back here, click Activate. Cancel the request
          here as well if the sponsor withdraws (and cancel it in the dashboard too).
        </p>
      </div>
    </div>
  );
}
