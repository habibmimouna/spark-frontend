import React, { useState } from 'react';
import './Appointments.css';
import image2 from '/images/image2.jpeg';

const Appointments = () => {
  const [appointments, setAppointments] = useState([
    { time: '10:00 am', patient: 'John Doe', treatment: 'Patient Checkup', duration: '10:30 am - 11:00 am', status: 'Pending' },
    { time: '11:00 am', patient: 'John Doe', treatment: 'Root Cleaning', duration: '10:30 am - 11:00 am', status: 'Pending' },
    { time: '12:00 pm', patient: 'John Doe', treatment: 'Scaling', duration: '10:30 am - 11:00 am', status: 'Pending' },
    { time: '1:00 pm', patient: 'John Doe', treatment: 'Patient Checkup', duration: '10:30 am - 11:00 am', status: 'Pending' },
    { time: '2:00 pm', patient: 'John Doe', treatment: 'Root Cleaning', duration: '10:30 am - 11:00 am', status: 'Pending' },
    { time: '3:00 pm', patient: 'John Doe', treatment: 'Scaling', duration: '10:30 am - 11:00 am', status: 'Pending' },
  ]);

  const handleAccept = (index) => {
    if (index >= 0 && index < appointments.length) {
      const updatedAppointments = [...appointments];
      updatedAppointments[index].status = 'Accepted';
      setAppointments(updatedAppointments);
    } else {
      console.error('Invalid index:', index);
    }
  };

  const handleReject = (index) => {
    if (index >= 0 && index < appointments.length) {
      const updatedAppointments = [...appointments];
      updatedAppointments[index].status = 'Rejected';
      setAppointments(updatedAppointments);
    } else {
      console.error('Invalid index:', index);
    }
  };

  return (
    <div className="appointments">
      <h1>Add appointment in your Schedule now</h1>
      <button className="add-appointment">+ Add Appointment</button>
     <img src={image2} alt="image2" />
      
      <div className="stats">
        <div>Total appointments: 405</div>
        <div>Complete appointments: 240</div>
        <div>Pending appointments: 112</div>
        <div>Canceled appointments: 112</div>
      </div>

      <h2>My Appointments</h2>
      <div className="appointment-list">
        {appointments.map((appointment, index) => (
          <div key={index} className="appointment-item">
            <div className="appointment-time">{appointment.time}</div>
            <div className="appointment-details">
              <div className="treatment">{appointment.treatment}</div>
              <div className="patient-name">Patient Name: {appointment.patient}</div>
              <div className="duration">{appointment.duration}</div>
            </div>
            <div className="appointment-actions">
              <button className="view-details">View Details</button>
              <button className="accept" onClick={() => handleAccept(index)}>Accept</button>
              <button className="reject" onClick={() => handleReject(index)}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Appointments;