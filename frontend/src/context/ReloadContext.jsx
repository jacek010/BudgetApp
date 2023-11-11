import React, { createContext, useState, useCallback } from 'react';

export const ReloadContext = createContext();

export const ReloadProvider = ({ children }) => {
  const [reload, setReload] = useState(false);

  const triggerReload = useCallback(() => {
    setReload(prevReload => !prevReload);
  }, []);

  return (
    <ReloadContext.Provider value={{ reload, triggerReload }}>
      {children}
    </ReloadContext.Provider>
  );
};
