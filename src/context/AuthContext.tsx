import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

interface User {
    email?: string;
    mobile?: string;
    is_admin?: boolean;
}


interface AuthContextType {
    user : User | null;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    logout: () => {},
}) 


export function AuthProvider({ children }: { children: ReactNode }) {
    
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
      }, []);

      const logout = () => {
        localStorage.clear();
        setUser(null);
        window.location.href = "/"; // redirect to home or login
      };

      return (
        <AuthContext.Provider value={{ user, logout }}>
          {children}
        </AuthContext.Provider>
      );
}