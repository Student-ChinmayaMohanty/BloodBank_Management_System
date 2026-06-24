import React, { useEffect, useRef } from "react";

const BloodFlow3D = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId;
        let width = (canvas.width = canvas.offsetWidth);
        let height = (canvas.height = canvas.offsetHeight);

        const cells = [];
        const plasma = [];
        const numCells = 35;
        const numPlasma = 60;
        const focalLength = 300;

        // Mouse tracking for parallax
        const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.targetX = e.clientX - rect.left;
            mouse.targetY = e.clientY - rect.top;
        };

        window.addEventListener("mousemove", handleMouseMove);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        };
        window.addEventListener("resize", handleResize);

        // Initialize 3D Blood Cells (Erythrocytes)
        for (let i = 0; i < numCells; i++) {
            cells.push({
                x: (Math.random() - 0.5) * width * 1.8,
                y: (Math.random() - 0.5) * height * 1.8,
                z: Math.random() * focalLength * 2 - focalLength,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                vz: -Math.random() * 0.8 - 0.4, // Moving towards the camera
                rx: Math.random() * 12 + 18, // Cell horizontal radius
                ry: Math.random() * 12 + 18, // Cell vertical radius
                // 3D rotations
                pitch: Math.random() * Math.PI * 2,
                yaw: Math.random() * Math.PI * 2,
                roll: Math.random() * Math.PI * 2,
                pitchSpeed: (Math.random() - 0.5) * 0.02,
                yawSpeed: (Math.random() - 0.5) * 0.02,
                rollSpeed: (Math.random() - 0.5) * 0.015,
                hueShift: (Math.random() - 0.5) * 8 // subtle shade variations
            });
        }

        // Initialize Plasma Glow Particles
        for (let i = 0; i < numPlasma; i++) {
            plasma.push({
                x: (Math.random() - 0.5) * width * 2,
                y: (Math.random() - 0.5) * height * 2,
                z: Math.random() * focalLength * 2 - focalLength,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                vz: -Math.random() * 1.5 - 0.5,
                radius: Math.random() * 2.5 + 1,
                opacity: Math.random() * 0.4 + 0.2
            });
        }

        const drawErythrocyte = (ctx, cx, cy, rx, ry, cell, scale) => {
            // Compute animated 3D rotation aspect ratios
            const radiusX = rx * scale * Math.max(0.1, Math.abs(Math.cos(cell.yaw)));
            const radiusY = ry * scale * Math.max(0.1, Math.abs(Math.sin(cell.pitch)));
            const rotation = cell.roll;

            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(rotation);

            // Base cell color gradient (Deep red to dark crimson/black edge)
            const mainGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radiusX);
            const baseHue = 356 + cell.hueShift;
            mainGrad.addColorStop(0, `hsl(${baseHue}, 90%, 38%)`);
            mainGrad.addColorStop(0.65, `hsl(${baseHue}, 100%, 25%)`);
            mainGrad.addColorStop(0.9, `hsl(${baseHue}, 100%, 15%)`);
            mainGrad.addColorStop(1, `rgba(18, 0, 2, 0.9)`);

            ctx.fillStyle = mainGrad;

            // Draw outer cell body
            ctx.beginPath();
            ctx.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
            ctx.fill();

            // Draw biconcave indentation (inner shadow/glow to look 3D)
            const innerRadiusX = radiusX * 0.45;
            const innerRadiusY = radiusY * 0.45;
            const innerGrad = ctx.createRadialGradient(-radiusX * 0.08, -radiusY * 0.08, 0, 0, 0, innerRadiusX);
            innerGrad.addColorStop(0, `hsl(${baseHue}, 100%, 14%)`);
            innerGrad.addColorStop(0.5, `hsl(${baseHue}, 100%, 18%)`);
            innerGrad.addColorStop(1, `hsl(${baseHue}, 95%, 34%)`);

            ctx.fillStyle = innerGrad;
            ctx.beginPath();
            ctx.ellipse(0, 0, innerRadiusX, innerRadiusY, 0, 0, Math.PI * 2);
            ctx.fill();

            // Add highlight/specular reflections
            const highlightGrad = ctx.createRadialGradient(-radiusX * 0.35, -radiusY * 0.35, 0, -radiusX * 0.35, -radiusY * 0.35, radiusX * 0.45);
            highlightGrad.addColorStop(0, 'rgba(255, 120, 130, 0.4)');
            highlightGrad.addColorStop(0.3, 'rgba(255, 50, 70, 0.15)');
            highlightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = highlightGrad;
            ctx.beginPath();
            ctx.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        };

        const animate = () => {
            if (!canvas) return;

            // Deep blood plasma/vessel background gradient
            const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, Math.max(width, height));
            bgGrad.addColorStop(0, "#190104");
            bgGrad.addColorStop(0.5, "#0b0103");
            bgGrad.addColorStop(1, "#030001");
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);

            // Interpolate mouse for smooth parallax
            mouse.x += (mouse.targetX - mouse.x) * 0.06;
            mouse.y += (mouse.targetY - mouse.y) * 0.06;

            // Camera shift based on mouse position relative to center
            const camX = (mouse.x - width / 2) * 0.25;
            const camY = (mouse.y - height / 2) * 0.25;

            // Combined pool of all items sorted by Z depth to render correct overlapping
            const renderQueue = [];

            // Update & project Plasma Particles
            for (let i = 0; i < plasma.length; i++) {
                const p = plasma[i];
                p.z += p.vz;

                // Reset particle if it moves behind camera
                if (p.z < -focalLength) {
                    p.z = focalLength;
                    p.x = (Math.random() - 0.5) * width * 2;
                    p.y = (Math.random() - 0.5) * height * 2;
                }

                // Project 3D to 2D
                const scale = focalLength / (focalLength + p.z);
                const projX = (p.x - camX) * scale + width / 2;
                const projY = (p.y - camY) * scale + height / 2;

                if (projX >= -100 && projX <= width + 100 && projY >= -100 && projY <= height + 100) {
                    renderQueue.push({
                        type: "plasma",
                        z: p.z,
                        scale: scale,
                        x: projX,
                        y: projY,
                        radius: p.radius,
                        opacity: p.opacity
                    });
                }
            }

            // Update & project Blood Cells
            for (let i = 0; i < cells.length; i++) {
                const c = cells[i];
                c.x += c.vx;
                c.y += c.vy;
                c.z += c.vz;

                // Rotation increments
                c.pitch += c.pitchSpeed;
                c.yaw += c.yawSpeed;
                c.roll += c.rollSpeed;

                // Reset cell if it moves behind camera
                if (c.z < -focalLength) {
                    c.z = focalLength;
                    c.x = (Math.random() - 0.5) * width * 1.8;
                    c.y = (Math.random() - 0.5) * height * 1.8;
                }

                const scale = focalLength / (focalLength + c.z);
                const projX = (c.x - camX) * scale + width / 2;
                const projY = (c.y - camY) * scale + height / 2;

                if (projX >= -150 && projX <= width + 150 && projY >= -150 && projY <= height + 150) {
                    renderQueue.push({
                        type: "cell",
                        z: c.z,
                        scale: scale,
                        x: projX,
                        y: projY,
                        cell: c
                    });
                }
            }

            // Sort by Z coordinate descending (further items drawn first)
            renderQueue.sort((a, b) => b.z - a.z);

            // Draw all items
            for (let i = 0; i < renderQueue.length; i++) {
                const item = renderQueue[i];

                // Set depth of field blur based on distance
                // Extremely close or extremely far items get blurred
                let blur = 0;
                if (item.z < -50) {
                    // Camera foreground blur
                    blur = Math.min(10, Math.floor(( -50 - item.z) * 0.08));
                } else if (item.z > 200) {
                    // Deep background blur
                    blur = Math.min(6, Math.floor((item.z - 200) * 0.03));
                }

                if (blur > 0) {
                    ctx.filter = `blur(${blur}px)`;
                } else {
                    ctx.filter = "none";
                }

                if (item.type === "plasma") {
                    // Draw flowing glowing plasma particle
                    const glowGrad = ctx.createRadialGradient(item.x, item.y, 0, item.x, item.y, item.radius * item.scale * 4);
                    // Plasma color: bright golden-amber or warm red-orange
                    glowGrad.addColorStop(0, `rgba(255, 100, 60, ${item.opacity})`);
                    glowGrad.addColorStop(0.3, `rgba(255, 60, 40, ${item.opacity * 0.4})`);
                    glowGrad.addColorStop(1, "rgba(255, 40, 40, 0)");

                    ctx.fillStyle = glowGrad;
                    ctx.beginPath();
                    ctx.arc(item.x, item.y, item.radius * item.scale * 4, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Draw erythrocyte cell
                    drawErythrocyte(ctx, item.x, item.y, item.cell.rx, item.cell.ry, item.cell, item.scale);
                }
            }

            // Reset filters
            ctx.filter = "none";

            // Draw vignette effect to enhance premium cinematic feel
            const vigGrad = ctx.createRadialGradient(width / 2, height / 2, Math.max(width, height) * 0.35, width / 2, height / 2, Math.max(width, height) * 0.75);
            vigGrad.addColorStop(0, "rgba(0,0,0,0)");
            vigGrad.addColorStop(0.7, "rgba(0,0,0,0.45)");
            vigGrad.addColorStop(1, "rgba(0,0,0,0.85)");
            ctx.fillStyle = vigGrad;
            ctx.fillRect(0, 0, width, height);

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
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
                display: "block"
            }}
        />
    );
};

export default BloodFlow3D;
