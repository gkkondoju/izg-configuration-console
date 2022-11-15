import { createContext, useState } from 'react';

const SessionContext = createContext(0);

export const SessionProvider = ({ children }) => {
  const [pageSize, setPageSize] = useState(5);

  return (
    <SessionContext.Provider value={[pageSize, setPageSize]}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionContext;