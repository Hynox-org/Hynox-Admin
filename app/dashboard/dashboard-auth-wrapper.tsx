"use client";

import { useAuth } from '@/hooks/useAuth';
import { ReactNode } from 'react';

interface DashboardAuthWrapperProps {
  children: ReactNode;
}

export default function DashboardAuthWrapper({ children }: DashboardAuthWrapperProps) {
  useAuth();
  return <>{children}</>;
}
