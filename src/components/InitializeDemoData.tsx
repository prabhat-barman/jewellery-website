import React, { useEffect, useState } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function InitializeDemoData() {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      try {
        // Check if data already exists
        const checkResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-ff9d2bf9/products`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (checkResponse.ok) {
          const data = await checkResponse.json();
          if (data.products && data.products.length > 0) {
            setInitialized(true);
            setLoading(false);
            return;
          }
        }

        // Seed demo data
        const seedResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-ff9d2bf9/seed-demo-data`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (seedResponse.ok) {
          console.log('Demo data initialized successfully');
          setInitialized(true);
        }
      } catch (error) {
        console.error('Failed to initialize demo data:', error);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
        <p className="text-sm">Initializing demo data...</p>
      </div>
    );
  }

  return null;
}
