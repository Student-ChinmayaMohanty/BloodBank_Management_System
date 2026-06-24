import React, { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BloodFlow3D from "../components/BloodFlow3D";

const ThreeDCanvasBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId;
        let width = (canvas.width = canvas.offsetWidth);
        let height = (canvas.height = canvas.offsetHeight);

        const numParticles = 60;
        const particles = [];
        const maxDistance = 110;
        const focalLength = 280;

        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: (Math.random() - 0.5) * width * 1.5,
                y: (Math.random() - 0.5) * height * 1.5,
                z: Math.random() * focalLength * 2 - focalLength,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                vz: (Math.random() - 0.5) * 0.6,
                radius: Math.random() * 2 + 1.2,
            });
        }

        const rxSpeed = 0.0008;
        const rySpeed = 0.0012;

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        };
        window.addEventListener("resize", handleResize);

        const animate = () => {
            if (!canvas) return;
            ctx.clearRect(0, 0, width, height);

            const cosX = Math.cos(rxSpeed);
            const sinX = Math.sin(rxSpeed);
            const cosY = Math.cos(rySpeed);
            const sinY = Math.sin(rySpeed);

            const projected = [];

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.z += p.vz;

                const boundX = width * 0.8;
                const boundY = height * 0.8;
                const boundZ = focalLength;

                if (Math.abs(p.x) > boundX) p.vx *= -1;
                if (Math.abs(p.y) > boundY) p.vy *= -1;
                if (Math.abs(p.z) > boundZ) p.vz *= -1;

                let x1 = p.x * cosY - p.z * sinY;
                let z1 = p.z * cosY + p.x * sinY;
                let y2 = p.y * cosX - z1 * sinX;
                let z2 = z1 * cosX + p.y * sinX;

                p.x = x1;
                p.y = y2;
                p.z = z2;

                const scale = focalLength / (focalLength + p.z + 10);
                const projX = p.x * scale + width / 2;
                const projY = p.y * scale + height / 2;

                projected.push({
                    x: projX,
                    y: projY,
                    z: p.z,
                    scale: scale,
                    radius: p.radius,
                });
            }

            ctx.lineWidth = 0.8;
            for (let i = 0; i < projected.length; i++) {
                const p1 = projected[i];
                for (let j = i + 1; j < projected.length; j++) {
                    const p2 = projected[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDistance) {
                        const alpha = (1 - dist / maxDistance) * 0.15;
                        ctx.strokeStyle = `rgba(239, 35, 60, ${alpha})`;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            for (let i = 0; i < projected.length; i++) {
                const p = projected[i];
                const rad = p.radius * p.scale * 1.5;
                if (rad <= 0) continue;

                const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad * 3);
                grad.addColorStop(0, "rgba(255, 77, 109, 0.9)");
                grad.addColorStop(0.3, "rgba(239, 35, 60, 0.5)");
                grad.addColorStop(1, "rgba(239, 35, 60, 0)");

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(p.x, p.y, rad * 3, 0, Math.PI * 2);
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 1,
                pointerEvents: "none",
            }}
        />
    );
};

const ManageRequests = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("isAdmin") === "true");
    const [authMode, setAuthMode] = useState("login"); // "login" or "signup"
    const [authFormData, setAuthFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [authError, setAuthError] = useState("");
    const [authSuccess, setAuthSuccess] = useState("");
    const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
    
    // Aesthetic Input States
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [typingDroplets, setTypingDroplets] = useState([]);

    // State to manage dynamic Client ID configuration


    const handleInputChange = (field, value) => {
        setAuthFormData(prev => ({ ...prev, [field]: value }));
        
        // Spawn an interactive floating droplet particle on keypress
        const id = Math.random().toString(36).substring(2, 9);
        const dx = `${(Math.random() - 0.5) * 45}px`;
        const dy = `-${Math.random() * 45 + 40}px`;
        const newDroplet = { id, dx, dy };
        
        setTypingDroplets(prev => [...prev, newDroplet]);
        
        // Cleanup droplet element after transition completes (750ms)
        setTimeout(() => {
            setTypingDroplets(prev => prev.filter(d => d.id !== id));
        }, 750);
    };

    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [newRequestIds, setNewRequestIds] = useState([]);
    const [error, setError] = useState(null);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    // Filters and Search state
    const [searchTerm, setSearchTerm] = useState('');
    const [bloodFilter, setBloodFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Fetch requests
    const fetchRequests = async (showSpinner = true) => {
        if (showSpinner) setLoading(true);
        setIsRefreshing(true);
        try {
            const res = await fetch(`http://${window.location.hostname}:4000/api/donor-requests/all`);
            if (!res.ok) {
                throw new Error('Failed to load requests from server.');
            }
            const data = await res.json();
            if (data.status && data.data) {
                setRequests(prevRequests => {
                    // Check for new requests to highlight if it's a background fetch
                    if (!showSpinner && prevRequests.length > 0) {
                        const newIds = data.data
                            .filter(newReq => !prevRequests.some(oldReq => oldReq.id === newReq.id))
                            .map(r => r.id);
                        if (newIds.length > 0) {
                            setNewRequestIds(prevIds => [...prevIds, ...newIds]);
                            setTimeout(() => {
                                setNewRequestIds(prevIds => prevIds.filter(id => !newIds.includes(id)));
                            }, 5000);
                        }
                    }
                    return data.data;
                });
                setFilteredRequests(data.data);
            } else {
                throw new Error(data.message || 'Error fetching records.');
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            if (showSpinner) setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchRequests(true);

            // Set up polling loop every 10 seconds
            const interval = setInterval(() => {
                fetchRequests(false);
            }, 10000);

            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const handleLogoutEvent = () => {
            setIsAuthenticated(false);
        };
        window.addEventListener("adminLogout", handleLogoutEvent);
        return () => {
            window.removeEventListener("adminLogout", handleLogoutEvent);
        };
    }, []);





    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setAuthError("");
        setAuthSuccess("");

        const { name, email, password, confirmPassword } = authFormData;

        if (authMode === "signup") {
            if (!name || !email || !password) {
                setAuthError("All fields are required.");
                return;
            }
            if (password !== confirmPassword) {
                setAuthError("Passwords do not match.");
                return;
            }
            setIsAuthSubmitting(true);
            try {
                const res = await fetch(`http://${window.location.hostname}:4000/api/admin/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });
                const data = await res.json();
                if (data.status) {
                    setAuthSuccess("Account created successfully! Switching to login...");
                    setAuthFormData({ name: "", email: "", password: "", confirmPassword: "" });
                    setTimeout(() => {
                        setAuthMode("login");
                        setAuthSuccess("");
                    }, 2000);
                } else {
                    setAuthError(data.message || "Registration failed.");
                }
            } catch (err) {
                setAuthError(err.message);
            } finally {
                setIsAuthSubmitting(false);
            }
        } else {
            if (!email || !password) {
                setAuthError("Email and password are required.");
                return;
            }
            setIsAuthSubmitting(true);
            try {
                const res = await fetch(`http://${window.location.hostname}:4000/api/admin/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (data.status) {
                    localStorage.setItem("isAdmin", "true");
                    localStorage.setItem("adminName", data.data.name);
                    localStorage.setItem("adminEmail", data.data.email);
                    window.dispatchEvent(new Event("adminLogin"));
                    setIsAuthenticated(true);
                } else {
                    setAuthError(data.message || "Invalid credentials.");
                }
            } catch (err) {
                setAuthError(err.message);
            } finally {
                setIsAuthSubmitting(false);
            }
        }
    };

    // Filters
    useEffect(() => {
        let temp = [...requests];

        if (searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase();
            temp = temp.filter(r => 
                r.name.toLowerCase().includes(term) || 
                r.mobile.includes(term) ||
                r.email.toLowerCase().includes(term)
            );
        }

        if (bloodFilter !== '') {
            temp = temp.filter(r => r.bloodGroup.toUpperCase() === bloodFilter.toUpperCase());
        }

        if (statusFilter !== '') {
            const wantActive = statusFilter === 'active';
            temp = temp.filter(r => r.status === wantActive);
        }

        setFilteredRequests(temp);
    }, [searchTerm, bloodFilter, statusFilter, requests]);

    // Actions
    const handleToggleStatus = async (id) => {
        setStatusMessage({ type: '', text: '' });
        try {
            const res = await fetch(`http://${window.location.hostname}:4000/api/donor-requests/${id}`, {
                method: 'PUT'
            });
            const data = await res.json();
            if (data.status) {
                setStatusMessage({ type: 'success', text: data.message });
                setRequests(prev => prev.map(r => r.id === id ? { ...r, status: !r.status } : r));
            } else {
                throw new Error(data.message || 'Failed to update status.');
            }
        } catch (err) {
            setStatusMessage({ type: 'danger', text: err.message });
        }
    };

    const handleDelete = async (id) => {
        if (deleteConfirmId !== id) {
            setDeleteConfirmId(id);
            setTimeout(() => setDeleteConfirmId(null), 3000);
            return;
        }

        setStatusMessage({ type: '', text: '' });
        try {
            const res = await fetch(`http://${window.location.hostname}:4000/api/donor-requests/${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.status) {
                setStatusMessage({ type: 'success', text: data.message });
                setRequests(prev => prev.filter(r => r.id !== id));
                setDeleteConfirmId(null);
            } else {
                throw new Error(data.message || 'Failed to delete request.');
            }
        } catch (err) {
            setStatusMessage({ type: 'danger', text: err.message });
        }
    };

    // Metrics calculations
    const totalCount = requests.length;
    const activeCount = requests.filter(r => r.status === true).length;
    const processedCount = requests.filter(r => r.status === false).length;

    if (!isAuthenticated) {
        return (
            <>
                <Header />
                <div className="auth-portal-wrapper" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0', position: 'relative', overflow: 'hidden' }}>
                    {/* 3D Animated Blood Flow Background */}
                    <BloodFlow3D />
                    
                    <div className="auth-card-container glass-card shadow-lg p-5 border-0" style={{ background: 'rgba(28, 29, 38, 0.85)', backdropFilter: 'blur(20px)', border: '1.5px solid rgba(255, 255, 255, 0.08)', color: '#ffffff', borderRadius: '24px', maxWidth: '460px', width: '95%', zIndex: 10 }}>
                        <div className="auth-card-header text-center mb-4">
                            <div className="auth-logo mb-3" style={{ fontSize: '3rem', filter: 'drop-shadow(0 0 15px rgba(239, 35, 60, 0.4))' }}>🩸</div>
                            <h3 className="fw-bold mb-2 text-glow">Admin Command Center</h3>
                            <p className="text-white-50 small mb-0">Manage donor requests, analyze node metrics, and coordinate operations.</p>
                        </div>
                        
                        {/* Toggle Mode Tab */}
                        <div className="auth-tab-buttons d-flex mb-4 p-1 bg-black rounded-3" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                            <button 
                                type="button"
                                className={`btn flex-grow-1 py-2 fw-bold transition-all ${authMode === 'login' ? 'btn-danger text-white' : 'text-white-50'}`}
                                onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccess(''); }}
                                style={{ borderRadius: '6px', border: 'none', background: authMode === 'login' ? undefined : 'transparent' }}
                            >
                                Login
                            </button>
                            <button 
                                type="button"
                                className={`btn flex-grow-1 py-2 fw-bold transition-all ${authMode === 'signup' ? 'btn-danger text-white' : 'text-white-50'}`}
                                onClick={() => { setAuthMode('signup'); setAuthError(''); setAuthSuccess(''); }}
                                style={{ borderRadius: '6px', border: 'none', background: authMode === 'signup' ? undefined : 'transparent' }}
                            >
                                Register
                            </button>
                        </div>

                        {authError && (
                            <div className="alert alert-danger py-2 mb-3 small text-center" role="alert" style={{ background: 'rgba(239, 35, 60, 0.15)', border: '1px solid rgba(239, 35, 60, 0.3)', color: '#ff4d6d' }}>
                                ⚠️ {authError}
                            </div>
                        )}

                        {authSuccess && (
                            <div className="alert alert-success py-2 mb-3 small text-center" role="alert" style={{ background: 'rgba(40, 167, 69, 0.15)', border: '1px solid rgba(40, 167, 69, 0.3)', color: '#2ec4b6' }}>
                                ✅ {authSuccess}
                            </div>
                        )}

                        <div className="auth-form-slider" style={{ position: 'relative', overflow: 'hidden' }}>
                            <form onSubmit={handleAuthSubmit} className="animate-fade-in">
                                {authMode === 'signup' && (
                                    <div className="mb-4">
                                        <label className="form-label text-white-50 small">Name</label>
                                        <div className="input-wrapper-aesthetic">
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                placeholder="Your Full Name"
                                                value={authFormData.name}
                                                onChange={(e) => handleInputChange("name", e.target.value)}
                                                required={authMode === 'signup'}
                                            />
                                            <div className="ecg-svg-container">
                                                <svg viewBox="0 0 100 20" width="100%" height="100%" preserveAspectRatio="none">
                                                    <path 
                                                        className="ecg-line-path" 
                                                        d="M0 10 L30 10 L35 2 L40 18 L45 10 L50 10 L55 2 L60 18 L65 10 L100 10" 
                                                    />
                                                </svg>
                                            </div>
                                            {typingDroplets.map(d => (
                                                <span key={d.id} className="typing-droplet" style={{ '--dx': d.dx, '--dy': d.dy, right: '25px', top: '15px' }}></span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="mb-4">
                                    <label className="form-label text-white-50 small">Email Address</label>
                                    <div className="input-wrapper-aesthetic">
                                        <input 
                                            type="email" 
                                            className="form-control" 
                                            placeholder="admin@bloodlink.org"
                                            value={authFormData.email}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                            required
                                        />
                                        <div className="ecg-svg-container">
                                            <svg viewBox="0 0 100 20" width="100%" height="100%" preserveAspectRatio="none">
                                                <path 
                                                    className="ecg-line-path" 
                                                    d="M0 10 L30 10 L35 2 L40 18 L45 10 L50 10 L55 2 L60 18 L65 10 L100 10" 
                                                />
                                            </svg>
                                        </div>
                                        {typingDroplets.map(d => (
                                            <span key={d.id} className="typing-droplet" style={{ '--dx': d.dx, '--dy': d.dy, right: '25px', top: '15px' }}></span>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-white-50 small">Password</label>
                                    <div className="input-wrapper-aesthetic">
                                        <input 
                                            type={showPassword ? "text" : "password"} 
                                            className="form-control" 
                                            placeholder="••••••••"
                                            value={authFormData.password}
                                            onChange={(e) => handleInputChange("password", e.target.value)}
                                            required
                                            style={{ paddingRight: '45px' }}
                                        />
                                        <button
                                            type="button"
                                            className="pwd-toggle-btn"
                                            onClick={() => setShowPassword(!showPassword)}
                                            title={showPassword ? "Hide password" : "Show password"}
                                        >
                                            <span className="heartbeat-icon">{showPassword ? "👁️" : "🔒"}</span>
                                        </button>
                                        <div className="ecg-svg-container">
                                            <svg viewBox="0 0 100 20" width="100%" height="100%" preserveAspectRatio="none">
                                                <path 
                                                    className="ecg-line-path" 
                                                    d="M0 10 L30 10 L35 2 L40 18 L45 10 L50 10 L55 2 L60 18 L65 10 L100 10" 
                                                />
                                            </svg>
                                        </div>
                                        {typingDroplets.map(d => (
                                            <span key={d.id} className="typing-droplet" style={{ '--dx': d.dx, '--dy': d.dy, right: '45px', top: '15px' }}></span>
                                        ))}
                                    </div>
                                </div>
                                {authMode === 'signup' && (
                                    <div className="mb-4">
                                        <label className="form-label text-white-50 small">Confirm Password</label>
                                        <div className="input-wrapper-aesthetic">
                                            <input 
                                                type={showConfirmPassword ? "text" : "password"} 
                                                className="form-control" 
                                                placeholder="••••••••"
                                                value={authFormData.confirmPassword}
                                                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                                required={authMode === 'signup'}
                                                style={{ paddingRight: '45px' }}
                                            />
                                            <button
                                                type="button"
                                                className="pwd-toggle-btn"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                title={showConfirmPassword ? "Hide password" : "Show password"}
                                            >
                                                <span className="heartbeat-icon">{showConfirmPassword ? "👁️" : "🔒"}</span>
                                            </button>
                                            <div className="ecg-svg-container">
                                                <svg viewBox="0 0 100 20" width="100%" height="100%" preserveAspectRatio="none">
                                                    <path 
                                                        className="ecg-line-path" 
                                                        d="M0 10 L30 10 L35 2 L40 18 L45 10 L50 10 L55 2 L60 18 L65 10 L100 10" 
                                                    />
                                                </svg>
                                            </div>
                                            {typingDroplets.map(d => (
                                                <span key={d.id} className="typing-droplet" style={{ '--dx': d.dx, '--dy': d.dy, right: '45px', top: '15px' }}></span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                <button type="submit" className="btn btn-danger w-100 py-2.5 fw-bold mb-3" disabled={isAuthSubmitting} style={{ background: 'linear-gradient(135deg, #ef233c 0%, #d90429 100%)', borderRadius: '10px', border: 'none', transition: 'all 0.3s ease' }}>
                                    {isAuthSubmitting ? (
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    ) : null}
                                    {authMode === 'login' ? 'Login ➔' : 'Register Account ➔'}
                                </button>
                                

                             </form>
                         </div>
                     </div>
                 </div>
                 <Footer />
             </>
        );
    }

    return (
        <>
            <Header />
            <div style={{ background: '#000000', minHeight: '85vh', paddingTop: '40px', paddingBottom: '60px', color: '#ffffff', position: 'relative', overflow: 'hidden' }}>
                
                {/* Glowing 3D Canvas Plexus Background */}
                <ThreeDCanvasBackground />

                <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                    
                    {/* Page Title */}
                    <div className="text-center mb-5">
                        <h2 className="section-title text-light d-inline-flex align-items-center gap-3">
                            Dashboard
                            <button 
                                onClick={() => fetchRequests(false)} 
                                className={`btn btn-outline-danger btn-sm rounded-circle d-flex align-items-center justify-content-center p-2 ${isRefreshing ? 'spin-animation' : ''}`}
                                title="Refresh Requests"
                                style={{ width: '36px', height: '36px', border: '1.5px solid rgba(239, 35, 60, 0.5)', background: 'rgba(239, 35, 60, 0.05)', transition: 'all 0.3s ease', cursor: 'pointer' }}
                            >
                                <span style={{ display: 'inline-block', transform: 'translateY(-1px)' }}>🔄</span>
                            </button>
                        </h2>
                        <div className="title-underline"></div>
                    </div>

                    {/* Notification Alerts */}
                    {statusMessage.text && (
                        <div className={`alert alert-${statusMessage.type === 'success' ? 'success' : 'danger'} text-center mx-auto mb-4`} style={{ maxWidth: '600px', background: statusMessage.type === 'success' ? 'rgba(40, 167, 69, 0.15)' : 'rgba(239, 35, 60, 0.15)', color: statusMessage.type === 'success' ? '#2ec4b6' : '#ff4d6d', border: `1px solid ${statusMessage.type === 'success' ? 'rgba(40, 167, 69, 0.3)' : 'rgba(239, 35, 60, 0.3)'}` }} role="alert">
                            {statusMessage.text}
                        </div>
                    )}

                    {/* 3D Dashboard metrics grid */}
                    <div className="row mb-4 g-4 justify-content-center">
                        <div className="col-md-4 col-sm-6 dashboard-card-perspective">
                            <div className="dashboard-metric-card total-card p-4">
                                <div className="card-3d-glow"></div>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="badge bg-secondary px-2.5 py-1">TOTAL</span>
                                    <span className="fs-3">📊</span>
                                </div>
                                <h2 className="metric-value mb-1">{totalCount}</h2>
                                <p className="mb-0 text-white-50 text-uppercase tracking-wider small">Submitted Requests</p>
                            </div>
                        </div>

                        <div className="col-md-4 col-sm-6 dashboard-card-perspective">
                            <div className="dashboard-metric-card active-card p-4">
                                <div className="card-3d-glow red"></div>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="badge bg-danger px-2.5 py-1">ACTIVE</span>
                                    <span className="fs-3">💉</span>
                                </div>
                                <h2 className="metric-value text-danger mb-1">{activeCount}</h2>
                                <p className="mb-0 text-white-50 text-uppercase tracking-wider small">Pending Response</p>
                            </div>
                        </div>

                        <div className="col-md-4 col-sm-6 dashboard-card-perspective">
                            <div className="dashboard-metric-card processed-card p-4">
                                <div className="card-3d-glow green"></div>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="badge bg-success px-2.5 py-1">PROCESSED</span>
                                    <span className="fs-3">✅</span>
                                </div>
                                <h2 className="metric-value text-success mb-1">{processedCount}</h2>
                                <p className="mb-0 text-white-50 text-uppercase tracking-wider small">Fulfilled / Actioned</p>
                            </div>
                        </div>
                    </div>

                    {/* Filters Toolbar */}
                    <div className="card filter-toolbar p-4 mb-4 border-0 shadow-sm" style={{ background: 'rgba(28, 29, 38, 0.45)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '18px' }}>
                        <div className="row g-3">
                            <div className="col-md-6 col-sm-12">
                                <label className="form-label fw-bold text-white-50 small">Search Donors</label>
                                <input 
                                    type="text" 
                                    className="form-control bg-black text-white border-secondary"
                                    placeholder="Search by name, email, or mobile..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <label className="form-label fw-bold text-white-50 small">Blood Group</label>
                                <select 
                                    className="form-select bg-black text-white border-secondary"
                                    value={bloodFilter}
                                    onChange={(e) => setBloodFilter(e.target.value)}
                                >
                                    <option value="">All Blood Groups</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <label className="form-label fw-bold text-white-50 small">Status</label>
                                <select 
                                    className="form-select bg-black text-white border-secondary"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="">All Statuses</option>
                                    <option value="active">Active (Pending)</option>
                                    <option value="processed">Processed (Done)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Table / List Container */}
                    <div className="table-responsive glass-table-container shadow">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-danger" role="status">
                                    <span className="visually-hidden">Loading donor records...</span>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="alert alert-danger m-4 text-center">
                                Error: {error}
                            </div>
                        ) : filteredRequests.length === 0 ? (
                            <div className="text-center py-5 text-white-50">
                                <h5>No donor requests match your filters.</h5>
                            </div>
                        ) : (
                            <table className="table table-dark table-hover mb-0 align-middle">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Blood</th>
                                        <th>Contact</th>
                                        <th>Remarks</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRequests.map((req) => (
                                        <tr key={req.id} className={newRequestIds.includes(req.id) ? 'new-request-row' : ''}>
                                            <td className="fw-bold">{req.name}</td>
                                            <td>
                                                <span className="badge bg-danger fs-6 px-2.5 py-1 text-uppercase">{req.bloodGroup}</span>
                                            </td>
                                            <td>
                                                <div className="small">{req.mobile}</div>
                                                <div className="small text-white-50">{req.email}</div>
                                            </td>
                                            <td className="small text-white-50 max-width-remarks">{req.remarks || "-"}</td>
                                            <td className="small">{new Date(req.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                {req.status ? (
                                                    <span className="status-badge-glow bg-danger-glow text-danger">Active</span>
                                                ) : (
                                                    <span className="status-badge-glow bg-success-glow text-success">Processed</span>
                                                )}
                                            </td>
                                            <td className="text-end">
                                                <div className="btn-group gap-2">
                                                    <button 
                                                        className={`btn btn-sm ${req.status ? 'btn-success' : 'btn-warning'} fw-bold px-3`}
                                                        onClick={() => handleToggleStatus(req.id)}
                                                    >
                                                        {req.status ? 'Process' : 'Activate'}
                                                    </button>
                                                    <button 
                                                        className={`btn btn-sm ${deleteConfirmId === req.id ? 'btn-danger' : 'btn-outline-danger'} fw-bold px-3`}
                                                        onClick={() => handleDelete(req.id)}
                                                    >
                                                        {deleteConfirmId === req.id ? 'Confirm?' : 'Delete'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ManageRequests;
