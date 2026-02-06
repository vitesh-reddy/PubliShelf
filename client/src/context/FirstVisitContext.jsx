import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const FirstVisitContext = createContext({ isFirstVisit: false, markVisited: () => {} });

export function FirstVisitProvider({ children }) {
  const [isFirstVisit, setIsFirstVisit] = useState(!import.meta.env.VITE_TEST);

  const markVisited = () => setIsFirstVisit(false);

  const value = useMemo(() => ({ isFirstVisit, markVisited }), [isFirstVisit]);

  return <FirstVisitContext.Provider value={value}>{children}</FirstVisitContext.Provider>;
}

export function useFirstVisit() {
  return useContext(FirstVisitContext);
}
