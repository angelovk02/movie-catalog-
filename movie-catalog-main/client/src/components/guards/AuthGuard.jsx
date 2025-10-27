import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";    
import { useAuth } from "../../Contexts/AuthContext";

export default function AuthGuard(props){
    const { authenticated, user } = useAuth()
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user !== null || authenticated === false) setLoading(false);
    }, [user, authenticated]);

    if (loading) return <div>Loading...</div>;

    if(!authenticated){
        return <Navigate to="/login"/>
    }

    return <Outlet />;
}
