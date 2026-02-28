'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/src/store/useAuthStore';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { token, isInitialized, initialize } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    // Initialize the store from localStorage on mount
    useEffect(() => {
        if (!isInitialized) {
            initialize();
        }
    }, [isInitialized, initialize]);

    // Handle Redirection
    useEffect(() => {
        // Logic: If check is done (isInitialized) and no token exists
        if (isInitialized && !token) {
            const searchParams = new URLSearchParams({ redirectTo: pathname });
            router.push(`/login?${searchParams.toString()}`);
        }
    }, [isInitialized, token, router, pathname]);

    // Loading state to prevent "flashing" protected content
    if (!isInitialized) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-white">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    // Hide UI while redirecting
    if (!token) return null;

    return <>{children}</>;
};
