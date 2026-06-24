import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        const { name, email, mobile, message } = formData;
        if (!name || !email || !mobile || !message) {
            setStatus({ type: 'danger', message: 'All fields are required.' });
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch(`http://${window.location.hostname}:4000/api/contacts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (data.status) {
                setStatus({ type: 'success', message: data.message });
                setFormData({
                    name: '',
                    email: '',
                    mobile: '',
                    message: ''
                });
            } else {
                throw new Error(data.message || 'Something went wrong');
            }
        } catch (err) {
            setStatus({ type: 'danger', message: err.message });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Header />
            <div className="container py-5">
                <div className="text-center mb-5">
                    <h2 className="section-title">Connect With Us</h2>
                    <div className="title-underline"></div>
                </div>
                <div className="row contact-container">
                    <div className="col-sm-6 mb-4 mb-sm-0">
                        <div className="ratio ratio-4x3 shadow-sm rounded overflow-hidden mb-4">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3743.872326393375!2d85.67390460000001!3d20.2226800000007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19ab347765fb0f%3A0xccb84948b4b2bdf6!2sGIFT%20Autonomous%2C%20Bhubaneswar!5e0!3m2!1sen!2sin!4v1743771593491!5m2!1sen!2sin" 
                                style={{ border: 0 }}
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                                title="GIFT Autonomous Location Map"
                            ></iframe>
                        </div>
                        <div className="contact-details p-3 bg-light rounded shadow-sm">
                            <p className="mb-2"><b>Address:</b> Gramadiha, P.O.: Gangapada, City: Bhubaneswar, District: Khurda, Odisha - 752054, India.</p>
                            <p className="mb-2"><b>Phone No:</b> +91 123456789</p>
                            <p className="mb-0"><b>Email:</b> company@gmail.com</p>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '10px' }}>
                            {status.message && (
                                <div className={`alert alert-${status.type} text-center`} role="alert">
                                    {status.message}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label htmlFor="name" className="form-label fw-bold">Name:</label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="email" className="form-label fw-bold">Email:</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="mobile" className="form-label fw-bold">Mobile Number:</label>
                                    <input 
                                        type="text" 
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Enter your mobile number"
                                        required
                                    />
                                </div>
                                <div className="form-group mb-4">
                                    <label htmlFor="message" className="form-label fw-bold">Message:</label>
                                    <textarea 
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="form-control"
                                        rows="4"
                                        placeholder="Type your message here..."
                                        required
                                    ></textarea>
                                </div> 
                                <div className="form-group">
                                    <button 
                                        type="submit" 
                                        className="btn btn-danger w-100 py-2 fw-bold"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Submitting...' : 'Submit'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div> 
            </div>
            <Footer />
        </>
    );
}

export default Contact;