import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import img1 from "../assets/image/img1.webp";

const About = () => {
    return (
        <>
            <Header />
            <div className="container py-5">
                <div className="text-center mb-5">
                    <h2 className="section-title">About Our Blood Bank</h2>
                    <div className="title-underline"></div>
                </div>

                <div className="row align-items-center mb-5">
                    <div className="col-md-6">
                        <h4 className="fw-bold text-danger mb-3">Our Mission & Vision</h4>
                        <p>We are dedicated to saving lives by providing a reliable and safe blood supply to hospitals and patients in need. Our blood bank acts as a critical link, connecting voluntary blood donors with healthcare facilities and emergency cases.</p>
                        <p>Through state-of-the-art storage facilities and rigorous screening processes, we ensure that every unit of blood donated is handled with the highest standards of safety and care. We work around the clock to support emergency transfusions and support surgeries.</p>
                    </div>
                    <div className="col-md-6 text-center">
                        <img src={img1} className="about-image" alt="About our Blood Bank" />
                    </div>
                </div>

                <div className="row align-items-center mb-5 flex-md-row-reverse">
                    <div className="col-md-6">
                        <h4 className="fw-bold text-danger mb-3">Why Donate Blood?</h4>
                        <p>A single donation can save up to three lives. Blood donation not only helps patients suffering from critical conditions, trauma, or long-term illnesses, but it also benefits the donor by stimulating the production of new red blood cells and maintaining healthy iron levels.</p>
                        <p>Our volunteer donors form the backbone of our organization. Joining our community of regular donors ensures that we always have a ready supply of various blood groups, especially rare types, to meet urgent requests instantly.</p>
                    </div>
                    <div className="col-md-6 text-center">
                        <img src={img1} className="about-image" alt="Why Donate Blood" />
                    </div>
                </div>

                <div className="row align-items-center mb-5">
                    <div className="col-md-6">
                        <h4 className="fw-bold text-danger mb-3">Our Safe Testing Procedures</h4>
                        <p>Your health and safety are our top priorities. Before any donation, our trained professionals conduct a mini-health check, testing your pulse, blood pressure, temperature, and hemoglobin levels. Every unit is then screened for infectious diseases.</p>
                        <p>We use sterilized, single-use equipment for all procedures, ensuring zero risk of infection to the donor. Our comfortable donation lounge ensures you have a relaxed experience with refreshments provided post-donation.</p>
                    </div>
                    <div className="col-md-6 text-center">
                        <img src={img1} className="about-image" alt="Safe Testing Procedures" />
                    </div>
                </div>

                <div className="row mb-5">
                    <div className="col-12 bg-light p-4 rounded shadow-sm">
                        <h4 className="fw-bold text-danger mb-3">Terms & Conditions of Donation</h4>
                        <ul className="text-muted">
                            <li className="mb-2">Donors must be between 18 and 65 years of age.</li>
                            <li className="mb-2">Must weigh at least 50 kg (110 lbs).</li>
                            <li className="mb-2">Should not have donated blood in the last 56 days (or 112 days for double red cell donations).</li>
                            <li className="mb-2">Must be in good health and feel well on the day of donation.</li>
                            <li className="mb-2">Must present a valid government-issued photo ID.</li>
                        </ul>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default About;