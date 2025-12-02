import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export interface User {
    id: number;
    user_name?: string;              
    email?: string;
    mobile?: string;
    is_admin?: boolean;
}


interface AuthContextType {
    user : User | null;
    login: (userData: User) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => {},
    logout: () => {},
}) 


export function AuthProvider({ children }: { children: ReactNode }) {
    
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
      }, []);

      const login = (userData: User) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData); 
      };

      const logout = () => {
        localStorage.clear();
        setUser(null);
        window.location.href = "/"; 
      };

      return (
        <AuthContext.Provider value={{ user, login, logout }}>
          {children}
        </AuthContext.Provider>
      );
}