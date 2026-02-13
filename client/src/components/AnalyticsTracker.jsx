import { useEffect, useRef } from 'react';
import axiosInstance from '../utils/axiosInstance.util.js';
import { useFirstVisit } from '../context/FirstVisitContext';

export default function AnalyticsTracker() {
  const { isFirstVisit } = useFirstVisit();
  const hasRecorded = useRef(false);

  useEffect(() => {
    if (isFirstVisit && !hasRecorded.current) {
      hasRecorded.current = true;
      
      axiosInstance.post('/analytics/visit', {})
        .catch((error) => {
          console.error('Failed to record analytics visit:', error);
        });
    }
  }, [isFirstVisit]);

  return null;
}
