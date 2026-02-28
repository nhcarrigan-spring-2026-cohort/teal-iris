'use client';

import React from 'react';
import { ProtectedRoute } from '@/src/components/auth/ProtectedRoute';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-gray-50">
                <aside className="w-64 border-r bg-white p-4">
                    <nav className="font-bold">Dashboard Nav</nav>
                </aside>
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}
