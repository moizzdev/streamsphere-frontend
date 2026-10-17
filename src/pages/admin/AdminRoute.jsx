import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

function AdminRoute({ children }) {
    const { user } = useSelector((state) => state.authentication.authentication);

    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== "admin") return <Navigate to="/" replace />;

    return children;
}

export default AdminRoute;