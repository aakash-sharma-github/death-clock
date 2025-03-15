'use client';

import { useState, useEffect } from 'react';
import LeftSection from './components/LeftSection';
import RightSection from './components/RightSection';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <main>
      <div className="container">
        <LeftSection />
        <RightSection />
      </div>
    </main>
  );
}
