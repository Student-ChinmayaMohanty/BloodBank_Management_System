import React from "react";
import bannerImage from "../assets/image/banner.jpg"
import { Link } from "react-router-dom";
const Donor = () => {
    return (
        <div className="row align-items-center" style={{ marginTop: '40px', marginBottom: '40px' }}>
            <div className="col-sm-6">
                <div style={{ textAlign: "center" }}>
                    <h2 className="fw-bold mb-4" style={{ color: '#d90429', textTransform: 'uppercase', letterSpacing: '1px' }}>Become a Donor</h2>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '85%', textAlign: 'justify', lineHeight: '1.8', color: '#4a4a4a', fontSize: '1.05rem' }}>
                        <p>Every drop of blood you donate is a lifeline for someone in need—a silent promise of hope, healing, and a second chance at life. By becoming a donor, you transform from an ordinary individual into an extraordinary hero, offering the most precious gift of all: the gift of life itself. Join our community of life-savers today, and let your generosity flow to write a story of survival and strength for someone tomorrow.</p>
                    </div>
                </div>
                <div className="text-center">
                    <Link 
                        to={'/donor-request'} 
                        className="btn btn-danger btn-lg px-4 py-2.5 fw-bold text-uppercase mt-4" 
                        style={{ 
                            background: 'linear-gradient(135deg, #ef233c 0%, #d90429 100%)', 
                            border: 'none', 
                            borderRadius: '10px', 
                            boxShadow: '0 4px 15px rgba(239, 35, 60, 0.35)', 
                            transition: 'all 0.3s ease' 
                        }}
                    >
                        join us ➔
                    </Link>
                </div>
            </div>
            <div className="col-sm-6 p-4">
                <img src={bannerImage} style={{ width: '100%', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} alt="Become a Donor" />
            </div>
        </div>)
}
export default Donor;