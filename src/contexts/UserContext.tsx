import React, { createContext, useContext, useState, useEffect } from "react";

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
    const storedUser = localStorage.getItem("user");
    // console.log("Stored user:", storedUser);
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);

        // Kiểm tra nếu chưa có mật khẩu trong localStorage thì lưu vào
        // if (!localStorage.getItem("userPassword")) {
        //   localStorage.setItem("userPassword", parsedUser.password || "user123");
        // }
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
