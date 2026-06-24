import React from "react";
import { Link } from "react-router-dom";

const Banner = () => {
    return (
        <div className="hero-section py-5 d-flex align-items-center">
            <div className="container">
                <div className="row align-items-center">
                    {/* Left content column */}
                    <div className="col-lg-6 text-dark hero-left-content mb-5 mb-lg-0">
                        <span className="badge bg-danger px-3 py-2 rounded-pill fw-bold mb-3 shadow-sm animate-pulse-badge">
                            ❤️ EMERGENCY SERVICE 24/7
                        </span>
                        <h1 className="hero-title mb-3 text-dark">
                            Donate Blood <br />
                            <span className="text-glow">Save Three Lives</span>
                        </h1>
                        <p className="hero-description mb-4">
                            Your contribution can bring a ray of hope and save a family. Register today to join our community of voluntary blood donors and make a life-saving impact.
                        </p>
                        <div className="d-flex flex-wrap gap-3 mb-5">
                            <Link to="/donor-request" className="btn btn-danger btn-lg px-4 py-3 fw-bold hero-btn-primary shadow">
                                Register as Donor
                            </Link>
                            <Link to="/contact" className="btn btn-outline-danger btn-lg px-4 py-3 fw-bold hero-btn-secondary">
                                Contact Us
                            </Link>
                        </div>
                        <div className="row stats-row g-3">
                            <div className="col-4">
                                <div className="stat-item">
                                    <h3 className="stat-number">12k+</h3>
                                    <p className="stat-label text-muted">Active Donors</p>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="stat-item">
                                    <h3 className="stat-number">36k+</h3>
                                    <p className="stat-label text-muted">Saved Lives</p>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="stat-item">
                                    <h3 className="stat-number">150+</h3>
                                    <p className="stat-label text-muted">Hospitals</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right 3D Visualizer column */}
                    <div className="col-lg-6 d-flex justify-content-center align-items-center hero-right-visualizer">
                        <div className="hero-3d-scene">
                            <div className="hero-3d-card shadow-lg">
                                {/* Glossy Grid lines overlay */}
                                <div className="grid-overlay"></div>
                                
                                {/* 3D Floating Blood Droplet */}
                                <div className="droplet-container">
                                    <svg className="blood-droplet-3d" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <radialGradient id="grad-3d" cx="40%" cy="45%" r="55%" fx="35%" fy="35%">
                                                <stop offset="0%" stopColor="#ff4d6d" />
                                                <stop offset="60%" stopColor="#ef233c" />
                                                <stop offset="100%" stopColor="#800f2f" />
                                            </radialGradient>
                                            <linearGradient id="highlight" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6"/>
                                                <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
                                            </linearGradient>
                                            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                                <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#d90429" floodOpacity="0.4"/>
                                            </filter>
                                        </defs>
                                        
                                        {/* Main drop shape */}
                                        <path 
                                            d="M50,12 C50,12 85,55 85,75 C85,93 70,108 50,108 C30,108 15,93 15,75 C15,55 50,12 50,12 Z" 
                                            fill="url(#grad-3d)"
                                            filter="url(#shadow)"
                                        />
                                        
                                        {/* Outer highlight curve */}
                                        <path 
                                            d="M30,70 C32,58 50,25 50,25" 
                                            stroke="url(#highlight)" 
                                            strokeWidth="4" 
                                            strokeLinecap="round"
                                            fill="none"
                                            opacity="0.7"
                                        />
                                    </svg>
                                    <div className="droplet-shadow"></div>
                                </div>

                                {/* Floating card overlay 1 (3D Depth) */}
                                <div className="floating-card info-card-1 p-3 text-dark">
                                    <div className="d-flex align-items-center gap-2 mb-1">
                                        <span className="pulse-dot"></span>
                                        <small className="fw-bold tracking-wide text-uppercase text-danger">Live Transfusions</small>
                                    </div>
                                    <h5 className="mb-0 fw-bold">O- Negative Required</h5>
                                    <small className="text-muted">Bhubaneswar General Hospital</small>
                                </div>

                                {/* Floating card overlay 2 (3D Depth) */}
                                <div className="floating-card info-card-2 p-3 text-dark text-center">
                                    <h4 className="blood-group-badge mb-1">A+</h4>
                                    <small className="fw-bold text-muted">Match compatibility</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;