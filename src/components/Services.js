import React, { useEffect, useState } from "react";
import helpImage from "../assets/image/help.png";

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://${window.location.hostname}:4000/api/services`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch services');
                }
                return res.json();
            })
            .then(data => {
                if (data.status && data.data) {
                    setServices(data.data);
                } else {
                    throw new Error(data.message || 'Failed to load services');
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return (
        <div className="service-container py-5">
            <div className="text-center mb-5">
                <h2 className="section-title">Our Services</h2>
                <div className="title-underline"></div>
            </div>
            
            {loading && (
                <div className="text-center py-4">
                    <div className="spinner-border text-danger" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="alert alert-danger text-center mx-auto" style={{ maxWidth: '500px' }}>
                    Error: {error}. Using local fallback.
                </div>
            )}

            {!loading && (
                <div className="row justify-content-center">
                    {(services.length > 0 ? services : [
                        { id: 1, name: 'Blood Donation' },
                        { id: 2, name: 'Blood Search' },
                        { id: 3, name: 'Emergency Request' },
                        { id: 4, name: 'Health Screening' }
                    ]).map((item) => (
                        <div key={item.id} className="col-md-3 col-sm-6 text-center service-card-wrapper mb-4">
                            <div className="card service-card h-100 shadow-sm border-0">
                                <div className="text-center pt-4">
                                    <div className="icon-wrapper">
                                        <img 
                                            className="card-img-top service-icon" 
                                            src={helpImage} 
                                            alt={item.name} 
                                        />
                                    </div>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title mt-2">{item.name}</h5>
                                    <p className="card-text text-muted small">Professional assistance and supportive care for our community.</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Services;