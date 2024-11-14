"use client";
import React, { createContext, useReducer, useContext, useEffect } from 'react';

// Initial state
const initialState = {
    user: null,
    isAuthenticated: false,
};

// Action types
const actionTypes = {
    SET_USER: 'SET_USER',
    LOGOUT: 'LOGOUT',
};

// Reducer to update state based on action
function reducer(state, action) {
    console.log("Action received in reducer:", action);
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
            };
        case actionTypes.LOGOUT:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
            };
        default:
            return state;
    }
}

// Create context
const GlobalContext = createContext();

// GlobalProvider component that provides the state to the app
export function GlobalProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Load user data from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                dispatch({
                    type: actionTypes.SET_USER,
                    payload: parsedUser,
                });
            } catch (error) {
                console.error("Failed to parse user data from localStorage:", error);
                localStorage.removeItem("user"); // Clear invalid data
            }
        }
    }, []);

    // Action to set user data and save to localStorage
    const setUser = (user) => {
        localStorage.setItem("user", JSON.stringify(user)); // Save user to localStorage
        dispatch({
            type: actionTypes.SET_USER,
            payload: user,
        });
    };

    // Action to logout and remove from localStorage
    const logout = () => {
        localStorage.removeItem("user"); // Remove user from localStorage
        dispatch({
            type: actionTypes.LOGOUT,
        });
    };

    return (
        <GlobalContext.Provider value={{ state, setUser, logout }}>
            {children}
        </GlobalContext.Provider>
    );
}

// Custom hook to use global context
export function useGlobalContext() {
    return useContext(GlobalContext);
}
