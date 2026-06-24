import React from "react";
import profileImage from "../assets/image/profile.png"
const OurTeamList = () => {
    const team = [
        {
            id: 1,
            name: 'user 1',
            image: profileImage

        },
        {
            id: 2,
            name: 'user 2',
            image: profileImage

        },
        {
            id: 3,
            name: 'user 3',
            image: profileImage

        },
        {
            id: 4,
            name: 'user 4',
            image: profileImage

        },
        {
            id: 5,
            name: 'user 5',
            image: profileImage

        },
        {
            id: 6,
            name: 'user 6',
            image: profileImage


        },
        {
            id: 7,
            name: 'user 7',
            image: profileImage

        },
        {
            id: 8,
            name: 'user 8',
            image: profileImage

        },
        {
            id: 9,
            name: 'user 9',
            image: profileImage

        },
        {
            id: 10,
            name: 'user 10',
            image: profileImage

        },
        {
            id: 11,
            name: 'user 11',
            image: profileImage

        },
        {
            id: 12,
            name: 'user 12',
            image: profileImage

        }

    ]
    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <h2 className="section-title">Our Team</h2>
                <div className="title-underline"></div>
            </div>
            <div className="row justify-content-center">
                {team.map((item) => {
                    return (
                        <div key={item.id} className="col-md-3 col-sm-6 mb-4">
                            <div className="card shadow-sm border-0 h-100 py-4" style={{ borderRadius: '15px', transition: 'all 0.3s ease' }}>
                                <div className="text-center">
                                    <img 
                                        className="card-img-top profile-pic mx-auto" 
                                        src={profileImage} 
                                        style={{ height: '110px', width: '110px', objectFit: 'cover' }} 
                                        alt={item.name} 
                                    />
                                </div>
                                <div className="card-body pb-0">
                                    <h5 className="card-title text-center text-dark fw-bold mb-1">{item.name}</h5>
                                    <p className="card-text text-center text-muted small">Volunteer Coordinator</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}


export default OurTeamList;