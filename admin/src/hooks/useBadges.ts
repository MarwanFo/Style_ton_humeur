import { useState, useEffect } from 'react';

export type Badge = {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: string;
  criteria: {
    thresholdDays: number;
  };
};

export function useBadges() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBadges = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/badges');
      if (!response.ok) throw new Error('Erreur lors du chargement des badges');
      const data = await response.json();
      setBadges(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createBadge = async (badgeData: Partial<Badge> & { thresholdDays: number }) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:3000/api/badges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(badgeData),
      });
      if (response.status === 401) {
        localStorage.removeItem('admin_token');
        window.location.reload();
        return false;
      }
      if (!response.ok) throw new Error('Erreur lors de la création');
      await fetchBadges();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const updateBadge = async (id: number, badgeData: Partial<Badge> & { thresholdDays?: number }) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:3000/api/badges/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(badgeData),
      });
      if (response.status === 401) {
        localStorage.removeItem('admin_token');
        window.location.reload();
        return false;
      }
      if (!response.ok) throw new Error('Erreur lors de la modification');
      await fetchBadges();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const deleteBadge = async (id: number) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:3000/api/badges/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.status === 401) {
        localStorage.removeItem('admin_token');
        window.location.reload();
        return false;
      }
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      await fetchBadges();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  return { badges, loading, error, createBadge, updateBadge, deleteBadge, refresh: fetchBadges };
}
