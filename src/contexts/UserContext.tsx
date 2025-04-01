import React, { createContext, useContext, useState, useEffect } from "react";
import { useUserStore } from "../config/zustand";

interface User {
  _id: string;
  email: string;
  user_name: string;
  role_code: string;
  is_verified: boolean;
  verification_token: string;
  verification_token_expires: string;
  token_version: number;
  is_blocked: boolean;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  __v: number;
  avatarUrl: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = useUserStore.getState().user;
    const storedUser = userData?.token;
    // console.log("Stored user:", storedUser);
    const token = localStorage.getItem("token");
    if (token && storedUser) {
      try {
        const parsedUser: User = {
          _id: userData.id || "",
          email: userData.email || "",
          user_name: userData.username || "",
          role_code: userData.role_code || "",
          is_verified: false,
          verification_token: "",
          verification_token_expires: "",
          token_version: 0,
          is_blocked: false,
          created_at: "",
          updated_at: "",
          is_deleted: false,
          __v: 0,
          avatarUrl: userData.avatarUrl || "",
        };
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
