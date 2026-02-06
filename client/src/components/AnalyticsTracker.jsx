import { useEffect, useRef } from 'react';
import axios from 'axios';
import { useFirstVisit } from '../context/FirstVisitContext';

export default function AnalyticsTracker() {
  const { isFirstVisit, markVisited } = useFirstVisit();
  const hasRecorded = useRef(false);

  useEffect(() => {
    if (isFirstVisit && !hasRecorded.current) {
      hasRecorded.current = true;
      markVisited();
      
      axios.post(`${import.meta.env.VITE_API_URL}/api/analytics/visit`, {}, { withCredentials: true })
        .catch((error) => {
          console.error('Failed to record analytics visit:', error);
        });
    }
  }, [isFirstVisit, markVisited]);

  return null;
}
