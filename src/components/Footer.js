import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [submitting, setSubmitting] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        if (!email) {
            setStatus({ type: 'danger', message: 'Email is required.' });
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch(`http://${window.location.hostname}:4000/api/subscribers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            if (data.status) {
                setStatus({ type: 'success', message: data.message });
                setEmail('');
            } else {
                throw new Error(data.message || 'Subscription failed');
            }
        } catch (err) {
            setStatus({ type: 'danger', message: err.message });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <footer className="footer-section text-light position-relative overflow-hidden" style={{ background: '#0a0b0e', borderTop: 'none', padding: 0 }}>
            {/* Animated ECG divider */}
            <div className="footer-ecg-divider">
                <svg viewBox="0 0 1200 30" preserveAspectRatio="none" style={{ width: '100%', height: '30px', display: 'block' }}>
                    <path 
                        className="footer-ecg-path"
                        d="M0 15 L250 15 L260 5 L265 25 L270 2 L275 28 L280 15 L550 15 L560 5 L565 25 L570 2 L575 28 L580 15 L850 15 L860 5 L865 25 L870 2 L875 28 L880 15 L1200 15" 
                        fill="none" 
                        stroke="#ef233c" 
                        strokeWidth="2"
                    />
                </svg>
            </div>
            
            {/* Subtle glow grid overlay or visual backdrop */}
            <div className="footer-glow-overlay"></div>
            
            <div className="container position-relative pt-5 pb-4" style={{ zIndex: 2 }}>
                <div className="row g-4 mb-5">
                    
                    {/* Brand Info */}
                    <div className="col-lg-4 col-md-6">
                        <div className="d-flex align-items-center mb-3 gap-2">
                            <div className="logo-box-mini">🩸</div>
                            <span className="logo-title-text-mini">BBMS</span>
                        </div>
                        <p className="text-white-50 mb-4 lh-lg" style={{ fontSize: '0.95rem' }}>
                            Saving lives by connecting blood donors with recipients in real-time. Secure, modern, and dedicated to emergency response.
                        </p>
                        <div className="d-flex gap-3">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-circle-link" aria-label="Facebook">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                                </svg>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-circle-link" aria-label="Twitter">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.6.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/>
                                </svg>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-circle-link" aria-label="Instagram">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.444-.048-3.298c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                                </svg>
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-circle-link" aria-label="LinkedIn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M0 1.146C0 .513.52 0 1.157 0h13.686C15.47 0 16 .513 16 1.146v13.708c0 .633-.52 1.146-1.157 1.146H1.157C.52 16 0 15.487 0 14.854V1.146zm4.937 12.824V5.992H2.766v7.978h2.171zM3.847 4.984a1.24 1.24 0 1 0 0-2.48 1.24 1.24 0 0 0 0 2.48zm10.22 8.986V9.066c0-2.572-1.38-3.747-3.18-3.747-1.45 0-2.102.798-2.464 1.336h-.018V5.992H6.26c.029.61 0 7.978 0 7.978h2.173V9.897c0-.43.031-.86.157-1.17.345-.858 1.125-1.748 2.436-1.748 1.718 0 2.404 1.309 2.404 3.228v4.618h2.174z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                    
                    {/* Navigation Links */}
                    <div className="col-lg-2 col-md-6 col-6">
                        <h5 className="footer-section-title text-light mb-3">Links</h5>
                        <ul className="list-unstyled footer-links-grid">
                            <li><Link to={'/'}>Home</Link></li>
                            <li><Link to={'/OurTeam'}>Our Team</Link></li>
                            <li><Link to={'/about'}>About Us</Link></li>
                            <li><Link to={'/contact'}>Contact Us</Link></li>
                            <li><Link to={'/donor-request'}>Become Donor</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="col-lg-3 col-md-6 col-6">
                        <h5 className="footer-section-title text-light mb-3">Contact</h5>
                        <ul className="list-unstyled footer-contact-info">
                            <li className="d-flex align-items-start gap-2 mb-3">
                                <span className="contact-icon-wrapper">✉️</span>
                                <div>
                                    <span className="d-block text-white-50 small">Email Address</span>
                                    <a href="mailto:company@gmail.com" className="contact-value">company@gmail.com</a>
                                </div>
                            </li>
                            <li className="d-flex align-items-start gap-2 mb-3">
                                <span className="contact-icon-wrapper">📞</span>
                                <div>
                                    <span className="d-block text-white-50 small">Emergency Hotline</span>
                                    <a href="tel:+91123456789" className="contact-value">+91 123456789</a>
                                </div>
                            </li>
                            <li className="d-flex align-items-start gap-2">
                                <span className="contact-icon-wrapper">📍</span>
                                <div>
                                    <span className="d-block text-white-50 small">Location</span>
                                    <span className="contact-value" style={{ cursor: 'default' }}>New Delhi, India</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Subscription Form */}
                    <div className="col-lg-3 col-md-6">
                        <h5 className="footer-section-title text-light mb-3">Newsletter</h5>
                        <p className="text-white-50 mb-3" style={{ fontSize: '0.9rem' }}>
                            Stay updated on emergency blood camps and healthcare announcements.
                        </p>
                        
                        {status.message && (
                            <div className={`alert alert-${status.type === 'success' ? 'success' : 'danger'} py-2 px-3 mb-3 small`} role="alert" style={{ background: status.type === 'success' ? 'rgba(40,167,69,0.15)' : 'rgba(239,35,60,0.15)', border: `1px solid ${status.type === 'success' ? 'rgba(40,167,69,0.3)' : 'rgba(239,35,60,0.3)'}`, color: status.type === 'success' ? '#2ec4b6' : '#ff4d6d' }}>
                                {status.message}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubscribe} className="footer-newsletter-form">
                            <div className="position-relative">
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-control footer-email-input" 
                                    placeholder="Enter your email"
                                    required
                                />
                                <button 
                                    type="submit" 
                                    className="btn footer-submit-btn"
                                    disabled={submitting}
                                    aria-label="Subscribe"
                                >
                                    {submitting ? '...' : '➔'}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>

                {/* Bottom socket bar */}
                <div className="row pt-4 border-top border-secondary border-opacity-25" style={{ fontSize: '0.9rem' }}>
                    <div className="col-md-6 text-center text-md-start mb-2 mb-md-0 text-white-50">
                        © {new Date().getFullYear()} BBMS Blood Bank Portal. All Rights Reserved.
                    </div>
                    <div className="col-md-6 text-center text-md-end text-white-50">
                        Designed with ❤️ for emergency response.
                    </div>
                </div>

            </div>
        </footer>
    );
}

export default Footer;