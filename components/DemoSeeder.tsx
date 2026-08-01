'use client';

import { useEffect } from 'react';
import { seedDemoUser } from '@/lib/store';

// Invisible component that seeds demo accounts into localStorage on mount
export default function DemoSeeder() {
  useEffect(() => {
    seedDemoUser();
  }, []);
  return null;
}
