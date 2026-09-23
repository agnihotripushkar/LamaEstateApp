import { createContext, useEffect, useState } from "react";
import apiRequest from "../lib/apiRequest";

export const AuthContext = createContext();

const readStoredUser = () => {
    try {
        return JSON.parse(localStorage.getItem("user"));
    } catch {
        return null;
    }
};

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(readStoredUser);

    const updateUser = (data) => {
        setCurrentUser(data);
    };

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    // Session cookie expired or was cleared server-side: drop the stale local user.
    useEffect(() => {
        const interceptor = apiRequest.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    setCurrentUser(null);
                }
                return Promise.reject(error);
            }
        );
        return () => apiRequest.interceptors.response.eject(interceptor);
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
