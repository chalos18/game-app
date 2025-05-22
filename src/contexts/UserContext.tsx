// src/contexts/UserContext.tsx
import React, { createContext, useContext, useState } from "react";

type UserContextType = {
    avatarUrl: string | null;
    setAvatarUrl: (url: string | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    return (
        <UserContext.Provider value={{ avatarUrl, setAvatarUrl }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};
