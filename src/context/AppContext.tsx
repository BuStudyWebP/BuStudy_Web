import React, { createContext, useContext, useState } from "react";

type User = any;

interface AppContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  registeredSubject: string | null;
  setRegisteredSubject: React.Dispatch<React.SetStateAction<string | null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [registeredSubject, setRegisteredSubject] = useState<string | null>(
    null
  );

  return (
    <AppContext.Provider
      value={{ user, setUser, registeredSubject, setRegisteredSubject }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
};

export default AppContext;
