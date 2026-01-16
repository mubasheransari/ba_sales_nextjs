'use client';

import { useEffect, useState } from 'react';
import { useRequireAuth } from '../lib/auth';
import { apiFetch } from '../lib/api';
import { Shell } from '../components/shell';
import { Card, CardTitle } from '../components/ui/card';
import { GradPill } from '../components/grad';

type Stats = {
  pending: number;
  employees: number;
  supervisors: number;
  cities: number;
  locations: number;
  products: number;
};

export default function DashboardPage() {
  const { user, loading } = useRequireAuth(['admin']);
  const [stats, setStats] = useState<Stats | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) return;
    apiFetch<Stats>('/api/admin/stats')
      .then(setStats)
      .catch((e: any) => setErr(e?.message || 'Failed to load stats'));
  }, [loading, user]);

  return (
    <Shell
      title="Dashboard"
      subtitle="Overview of users, approvals, products and locations."
    >
      {err ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {err}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>Pending approvals</CardTitle>
            <GradPill>{stats?.pending ?? '—'}</GradPill>
          </div>
          <div className="mt-2 text-sm text-black/60">Employees waiting for admin approval.</div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>Users</CardTitle>
            <GradPill>{((stats?.employees ?? 0) + (stats?.supervisors ?? 0) + 1) || '—'}</GradPill>
          </div>
          <div className="mt-2 text-sm text-black/60">
            Employees: {stats?.employees ?? '—'} • Supervisors: {stats?.supervisors ?? '—'}
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>Catalog</CardTitle>
            <GradPill>{stats?.products ?? '—'}</GradPill>
          </div>
          <div className="mt-2 text-sm text-black/60">Products available in the system.</div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>Cities</CardTitle>
            <GradPill>{stats?.cities ?? '—'}</GradPill>
          </div>
          <div className="mt-2 text-sm text-black/60">Cities configured by admin.</div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>Locations</CardTitle>
            <GradPill>{stats?.locations ?? '—'}</GradPill>
          </div>
          <div className="mt-2 text-sm text-black/60">Mart locations registered by admin.</div>
        </Card>
      </div>
    </Shell>
  );
}
