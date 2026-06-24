import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true");

    useEffect(() => {
        const handleAdminLogin = () => {
            setIsAdmin(localStorage.getItem("isAdmin") === "true");
        };

        // Listen to custom login/logout status events
        window.addEventListener("adminLogin", handleAdminLogin);
        window.addEventListener("adminLogout", handleAdminLogin);

        return () => {
            window.removeEventListener("adminLogin", handleAdminLogin);
            window.removeEventListener("adminLogout", handleAdminLogin);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("userRole");
        setIsAdmin(false);
        // Trigger manual event
        window.dispatchEvent(new Event("adminLogout"));
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark header-container">
            <div className="container">
                <NavLink className="navbar-brand d-flex align-items-center" to={isAdmin ? "/manage-requests" : "/home"}>
                    <span className="me-2">🩸</span> Blood Link
                </NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav ms-auto align-items-center">
                        {!isAdmin && (
                            <>
                                <NavLink className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} to="/home">Home</NavLink>
                                <NavLink className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} to="/OurTeam">Our Team</NavLink>
                                <NavLink className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} to="/about">About</NavLink>
                                <NavLink className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} to="/contact">Contact</NavLink>
                            </>
                        )}
                        
                        {isAdmin ? (
                            <button 
                                onClick={handleLogout} 
                                className="btn btn-sm btn-outline-light ms-3 px-3 py-1.5 fw-bold"
                                style={{ borderRadius: '8px' }}
                            >
                                Logout 🚪
                            </button>
                        ) : (
                            <NavLink 
                                to="/" 
                                className="btn btn-sm btn-outline-light ms-3 px-3 py-1.5 fw-bold text-decoration-none"
                                style={{ borderRadius: '8px', color: '#ffffff' }}
                            >
                                Change Role 🔄
                            </NavLink>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;