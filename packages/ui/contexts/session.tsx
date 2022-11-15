import { createContext, useState } from "react";

export type SessionContextType = {
  pageSize: number;
  setPageSize: (newSession: number) => void;
};

const SessionContext = createContext<SessionContextType | undefined>({
  pageSize: 5,
  setPageSize: undefined,
});

export const SessionProvider = ({ children }) => {
  const [pageSize, setPageSize] = useState<number>(5);

  return (
    <SessionContext.Provider value={{ pageSize, setPageSize }}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionContext;
