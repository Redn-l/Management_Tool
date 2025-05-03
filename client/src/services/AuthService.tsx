import React, { FC, createContext, useCallback, useState } from "react";
import { AuthContextType, EmptyProps, UserType } from "../types";
import axios, { AxiosResponse } from "axios";
import { API_URL } from "../constants";

const AuthContext = createContext({} as AuthContextType);

const AuthProvider: FC<EmptyProps> = React.memo(({children}) => {
    const userInfo = localStorage.getItem('user');
    const parsedUserInfo = userInfo ? JSON.parse(userInfo) : {};
    
    const [token, setToken] = useState<string | null>(parsedUserInfo.token || null);
    const [user, setUser] = useState<UserType>(parsedUserInfo as UserType);

    const loginOrRegister = useCallback(async (email: string, password: string, path: string, name?: string): Promise<UserType> => {
        try{
            const response: AxiosResponse<UserType, any> = await axios.post(API_URL + path, { email, password, name });
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
                setUser(response.data);
                setToken(response.data.token);
            }
            return response.data;
        } catch(error) {
            return Promise.reject(error);
        }
    }, []);

    const login = useCallback(async (email: string, password: string): Promise<UserType> => {
        return await loginOrRegister(email, password, '/login');
    }, [loginOrRegister]);

    const register = useCallback(async (name: string, email: string, password: string): Promise<UserType> => {
        return await loginOrRegister(email, password, '/register', name);
    }, [loginOrRegister]);

    const logout = useCallback((): void => {
        localStorage.removeItem('user');
        setToken(null);
        setUser({} as UserType);
    }, []);

    return <AuthContext.Provider value={{token, user, login, register, logout}}>{children}</AuthContext.Provider>;
});

export { AuthContext, AuthProvider };
