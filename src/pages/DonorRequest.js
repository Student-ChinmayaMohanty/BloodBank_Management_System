import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import bannerImage from "../assets/image/banner.jpg";

const DonorRequest = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        bloodGroup: '',
        remarks: ''
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

        const { name, email, mobile, bloodGroup } = formData;
        if (!name || !email || !mobile || !bloodGroup) {
            setStatus({ type: 'danger', message: 'Please fill in all mandatory fields.' });
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch(`http://${window.location.hostname}:4000/api/donor-requests`, {
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
                    bloodGroup: '',
                    remarks: ''
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

    return (<>
        <Header />
        <div style={{ background: 'rgb(244,244,244)', paddingTop: '40px', paddingBottom: '40px' }}>
            <div className="container">
                <div className="text-center mb-4">
                    <h2 className="section-title">Become a Donor</h2>
                    <div className="title-underline"></div>
                </div>
                <div className="card shadow-lg border-0" style={{ padding: "30px", margin: '10px', borderRadius: '15px' }}>
                    <div className="row align-items-center">
                        <div className="col-sm-6 mb-4 mb-sm-0">
                            <img src={bannerImage} style={{ width: '100%', borderRadius: '10px' }} alt="Donate blood" />
                        </div>
                        <div className="col-sm-6">
                            {status.message && (
                                <div className={`alert alert-${status.type} text-center`} role="alert">
                                    {status.message}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label fw-bold">Name:</label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter Your Name" 
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="form-group mt-3">
                                    <label htmlFor="email" className="form-label fw-bold">Email:</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your Email" 
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="form-group mt-3">
                                    <label htmlFor="mobile" className="form-label fw-bold">Mobile Number:</label>
                                    <input 
                                        type="text" 
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        placeholder="Enter your mobile number" 
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="form-group mt-3">
                                    <label htmlFor="bloodGroup" className="form-label fw-bold">Blood Group:</label>
                                    <input 
                                        type="text" 
                                        name="bloodGroup"
                                        value={formData.bloodGroup}
                                        onChange={handleChange}
                                        placeholder="Enter your Blood Group (e.g. A+, O-)" 
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="form-group mt-3">
                                    <label htmlFor="remarks" className="form-label fw-bold">Remarks:</label>
                                    <textarea 
                                        name="remarks"
                                        value={formData.remarks}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Any notes or medical history..."
                                        rows="3"
                                    ></textarea>
                                </div>
                                <div className="form-group mt-4">
                                    <button 
                                        type="submit" 
                                        className="btn btn-danger w-100 py-2 fw-bold"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Submitting...' : 'Submit Request'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </>)
}

export default DonorRequest;