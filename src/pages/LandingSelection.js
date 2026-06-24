import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const LandingSelection = () => {
    const navigate = useNavigate();
    const [isOpening, setIsOpening] = useState(() => {
        return !sessionStorage.getItem("hasSeenSplash");
    });
    const [fadeOut, setFadeOut] = useState(false);
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!isOpening) return;
        sessionStorage.setItem("hasSeenSplash", "true");
        // Run splash timer
        const fadeTimer = setTimeout(() => setFadeOut(true), 2800);
        const closeTimer = setTimeout(() => setIsOpening(false), 3600);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(closeTimer);
        };
    }, [isOpening]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId;
        let width = (canvas.width = canvas.offsetWidth);
        let height = (canvas.height = canvas.offsetHeight);

        const focalLength = 300;
        const numParticles = 80;
        const particles = [];

        // Generate 3D Blood Cells
        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: (Math.random() - 0.5) * width * 2.5,
                y: (Math.random() - 0.5) * height * 2.5,
                z: Math.random() * 1000,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                vz: -(Math.random() * 2.5 + 2.5),
                size: Math.random() * 10 + 8,
                rot: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.02,
            });
        }

        // Concentric tunnel rings
        const numRings = 12;
        const rings = [];
        for (let i = 0; i < numRings; i++) {
            rings.push({
                z: (i / numRings) * 1000,
            });
        }

        // ECG monitor parameters
        let ecgTimer = 0;
        const ecgHistory = [];
        const maxEcgHistory = 350;

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        };
        window.addEventListener("resize", handleResize);

        const animate = () => {
            if (!canvas) return;
            ctx.clearRect(0, 0, width, height);

            // 1. Draw Concentric 3D Glowing Tunnel Rings
            for (let i = 0; i < rings.length; i++) {
                const ring = rings[i];
                ring.z -= 4; // speed
                if (ring.z <= 0) ring.z = 1000;

                const scale = focalLength / (focalLength + ring.z);
                const px = width / 2;
                const py = height / 2;
                const r = 240 * scale; // base radius

                if (r > 0 && r < width * 2) {
                    const alpha = 0.12 * (1 - ring.z / 1000);
                    ctx.strokeStyle = `rgba(239, 35, 60, ${alpha})`;
                    ctx.lineWidth = 2.5 * scale;
                    ctx.beginPath();
                    ctx.arc(px, py, r, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }

            // 2. Draw 3D flowing Red Blood Cells (Erythrocytes)
            // Sort by Z coordinate (draw further cells first)
            particles.sort((a, b) => b.z - a.z);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.z += p.vz;
                p.x += p.vx;
                p.y += p.vy;
                p.rot += p.rotSpeed;

                // Reset cells when they pass camera
                if (p.z <= 0) {
                    p.z = 1000;
                    p.x = (Math.random() - 0.5) * width * 2.5;
                    p.y = (Math.random() - 0.5) * height * 2.5;
                    p.vz = -(Math.random() * 2.5 + 2.5);
                }

                const scale = focalLength / (focalLength + p.z);
                const px = p.x * scale + width / 2;
                const py = p.y * scale + height / 2;
                const r = p.size * scale;

                if (px > -r && px < width + r && py > -r && py < height + r && r > 0) {
                    ctx.save();
                    ctx.translate(px, py);
                    ctx.rotate(p.rot);

                    // Biconcave disc shading gradient
                    const grad = ctx.createRadialGradient(0, 0, r * 0.15, 0, 0, r);
                    grad.addColorStop(0, "#ff5c77"); // Light concave center
                    grad.addColorStop(0.5, "#d90429"); // Thicker edge
                    grad.addColorStop(1, "#52000c"); // Shadow rim
                    
                    ctx.fillStyle = grad;
                    
                    // Draw oval disc
                    ctx.beginPath();
                    ctx.ellipse(0, 0, r, r * 0.65, 0, 0, Math.PI * 2);
                    ctx.fill();

                    // Inner biconcave contour lines
                    ctx.strokeStyle = "rgba(0, 0, 0, 0.18)";
                    ctx.lineWidth = r * 0.08;
                    ctx.beginPath();
                    ctx.ellipse(0, 0, r * 0.45, r * 0.3, 0, 0, Math.PI * 2);
                    ctx.stroke();

                    ctx.restore();
                }
            }

            // 3. Draw Scrolling Heart Rate Monitor (ECG) Line
            ecgTimer += 1;
            const baseVal = height * 0.88;
            let pulseVal = 0;
            const t = ecgTimer % 75; // Period of heartbeat

            if (t >= 0 && t < 5) pulseVal = 0;
            else if (t >= 5 && t < 9) pulseVal = -6 * Math.sin((t - 5) * Math.PI / 4); // P wave
            else if (t >= 9 && t < 11) pulseVal = 0;
            else if (t >= 11 && t < 13) pulseVal = 10; // Q wave
            else if (t >= 13 && t < 16) pulseVal = -50 * Math.sin((t - 13) * Math.PI / 3); // R spike
            else if (t >= 16 && t < 18) pulseVal = 20 * Math.sin((t - 16) * Math.PI / 2); // S wave
            else if (t >= 18 && t < 20) pulseVal = 0;
            else if (t >= 20 && t < 26) pulseVal = -12 * Math.sin((t - 20) * Math.PI / 6); // T wave
            else pulseVal = 0;

            ecgHistory.push({ y: baseVal + pulseVal });
            if (ecgHistory.length > maxEcgHistory) {
                ecgHistory.shift();
            }

            // Draw ECG trail
            ctx.shadowColor = "rgba(46, 196, 182, 0.8)";
            ctx.shadowBlur = 6;
            ctx.strokeStyle = "rgba(46, 196, 182, 0.6)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            const startX = width - ecgHistory.length * 2.2;
            for (let i = 0; i < ecgHistory.length; i++) {
                const x = startX + i * 2.2;
                if (i === 0) ctx.moveTo(x, ecgHistory[i].y);
                else ctx.lineTo(x, ecgHistory[i].y);
            }
            ctx.stroke();
            ctx.shadowBlur = 0; // reset

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const selectRole = (role) => {
        localStorage.setItem("userRole", role);
        if (role === "donor") {
            navigate("/home");
        } else {
            navigate("/manage-requests");
        }
    };

    return (
        <div className="selection-fullscreen d-flex flex-column align-items-center justify-content-center">
            {/* Opening 3D animation overlay */}
            {isOpening && (
                <div className={`opening-splash-container ${fadeOut ? "fade-out" : ""}`}>
                    <canvas
                        ref={canvasRef}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            zIndex: 10001,
                            pointerEvents: "none",
                        }}
                    />
                    <div className="opening-ui-content">
                        <div className="opening-heart-beat">🩸</div>
                        <h2 className="opening-title">Blood Link</h2>
                        <p className="opening-subtitle">Biotech Node Initializing</p>
                        
                        <div className="opening-progress-container">
                            <div className="opening-progress-bar"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Selection Area */}
            <div className={`${isOpening ? "landing-fade-in" : ""} text-center`} style={{ zIndex: 10, opacity: isOpening ? undefined : 1 }}>
                {/* Top Logo and Title Section */}
                <div className="text-center mb-5 selection-logo-area">
                    <div className="logo-box mb-3 mx-auto shadow-lg animate-heartbeat">
                        <span className="logo-emoji">🩸</span>
                    </div>
                    <h1 className="logo-title-text text-uppercase m-0">Blood</h1>
                    <h1 className="logo-title-text text-uppercase m-0">Link</h1>
                </div>

                {/* Selection Cards Container */}
                <div className="container" style={{ maxWidth: '900px', position: 'relative' }}>
                    <div className="row g-4 justify-content-center">
                        
                        {/* Left Card: Donor */}
                        <div className="col-md-6 d-flex justify-content-center">
                            <div className="portal-card text-center p-4 p-lg-5 d-flex flex-column align-items-center">
                                <h2 className="portal-card-title mb-4">I'm <br />Donor</h2>
                                
                                {/* Heart & Blood drop SVG illustration */}
                                <div className="portal-illustration mb-4">
                                    <svg className="hover-pulse" width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M60 110C60 110 105 70 105 42C105 22.1177 88.8822 6 69 6C59 6 52 12 60 22C68 12 61 6 51 6C31.1177 6 15 22.1177 15 42C15 70 60 110 60 110Z" fill="#ef233c" fillOpacity="0.85"/>
                                        <path d="M50 42C50 31 60 22 60 22" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                                        <circle cx="60" cy="62" r="14" fill="#ffffff" fillOpacity="0.9"/>
                                        <path d="M60 55V69M53 62H67" stroke="#ef233c" strokeWidth="4" strokeLinecap="round"/>
                                    </svg>
                                </div>
                                
                                <button 
                                    onClick={() => selectRole("donor")} 
                                    className="btn portal-card-btn px-4 py-2.5 fw-bold w-100"
                                >
                                    Donor Portal ↗
                                </button>
                            </div>
                        </div>

                        {/* Right Card: Admin */}
                        <div className="col-md-6 d-flex justify-content-center">
                            <div className="portal-card text-center p-4 p-lg-5 d-flex flex-column align-items-center">
                                <h2 className="portal-card-title mb-4">I'm <br />Admin</h2>
                                
                                {/* Shield & Lock SVG illustration */}
                                <div className="portal-illustration mb-4">
                                    <svg className="hover-shake" width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M60 10L15 28V62C15 88 34 110 60 118C86 110 105 88 105 62V28L60 10Z" fill="#1c1d26" fillOpacity="0.85"/>
                                        <rect x="42" y="55" width="36" height="26" rx="4" fill="#ef233c"/>
                                        <path d="M48 55V46C48 39.3726 53.3726 34 60 34C66.6274 34 72 39.3726 72 46V55" stroke="#ef233c" strokeWidth="4"/>
                                        <circle cx="60" cy="68" r="4" fill="white"/>
                                    </svg>
                                </div>

                                <button 
                                    onClick={() => selectRole("admin")} 
                                    className="btn portal-card-btn px-4 py-2.5 fw-bold w-100 btn-dark-portal"
                                >
                                    Admin Portal ↗
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingSelection;
