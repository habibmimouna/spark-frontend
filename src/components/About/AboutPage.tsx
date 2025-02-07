import React from 'react';
import './AboutPage.css';
import image1 from '/images/image1.png';
import { Link } from 'react-router-dom';


const AboutPage = () => {
  return (
    
    
    <div className="about-page">
      <div className="intro-section">
        <h1>Where Patients and Doctors Connect Efforts Appointments , Better Care ? Anytime,Anywherfe !</h1>
        <button onClick={() => window.location.href = '/signup'}>Sign Up Now and get Started in Seconds !</button>
      </div>
      <img src={image1} alt="image1" />
      <section className="stats">
        <div>
          <h2>390+</h2>
          <p>Patients</p>
        </div>
        <div>
          <h2>120+</h2>
          <p>Doctors</p>
        </div>
        <div>
          <h2>1078+</h2>
          <p>Appointments</p>
        </div>
      </section>
      <section className="offer">
        <h2>What We Offer</h2>
        <div className="offer-item">
          <h3>Easy Scheduling</h3>
          <p>Quichly Book and manage appointments with an in intuitive and  streamlined scheduling tool that keeos your calendar organized .</p>
        </div>
        <div className="offer-item">
          <h3>Real-Time Notification</h3>
          <p>Stay informed with instant reminders and updates about appointments , follow-ups, and more .</p>
        </div>
        <div className="offer-item">
          <h3>Secure Communication</h3>
          <p>Chat or consult privately with encrypted communication ensuring complete security for sensitive discussions  .</p>
        </div>
      </section>
       <nav>
            <Link to="/contact">Contact</Link>
            <Link to="/">Home</Link>
            <Link to="/AboutPage">About</Link>
          </nav>
    </div>
     
  );
};

export default AboutPage;