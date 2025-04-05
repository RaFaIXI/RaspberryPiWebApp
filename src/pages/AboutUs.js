import React from 'react';
import Header from '../components/Header';

const AboutUs = () => {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
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
        </div>
    );
};

export default AboutUs;