'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermission } from '@/hooks';
import { useAppSelector } from '@/redux';
import { useToast } from '@/context';
import { Permission } from '@/types';

interface PermissionGuardProps {
  resource: Permission['resource'];
  action: 'view' | 'create' | 'edit' | 'delete';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ 
  resource, 
  action, 
  children, 
  fallback 
}: PermissionGuardProps) {
  const router = useRouter();
  const { hasPermission } = usePermission();
  const { isAuthenticated, isLoading } = useAppSelector(state => state.auth);
  const { showToast } = useToast();
  
  const hasAccess = hasPermission(resource, action);
  
  useEffect(() => {
    // Mock authentication - comment out authentication checks for demo
    /*
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    } else if (!isLoading && isAuthenticated && !hasAccess) {
      showToast(`You don't have permission to ${action} ${resource}`, 'error');
      router.push('/dashboard');
    }
    */
  }, [isLoading, isAuthenticated, hasAccess, action, resource, router, showToast]);
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null;
  }
  
  if (!hasAccess) {
    return fallback || null;
  }
  
  return <>{children}</>;
}
