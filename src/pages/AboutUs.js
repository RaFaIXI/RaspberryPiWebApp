import React from 'react';
import Header from '../components/Header';
import Footer from "../components/Footer";         
const AboutUs = () => {
    return (
        <div >
            <Header />
            <h1>About Us</h1>
            <p>
                Welcome to our Raspberry Pi Web App! We are passionate about creating innovative solutions using Raspberry Pi technology.
            </p>
            <p>
                Our mission is to empower developers and enthusiasts by providing tools and resources to build amazing projects.
            </p>
            <p>
                Thank you for visiting our website. Feel free to explore and learn more about what we do!
            </p>
            <Footer />
        </div>
    );
};

export default AboutUs;