import React from 'react';
import './BookingOverlay.css'

function BookingOverlay({ booking, onClose }) {

  function formatDate(dateTimeString) {
    const date = new Date(dateTimeString);
    
    // Extract date components
    const day = date.getDate();
    const month = date.getMonth() + 1; // Month is zero-based
    const year = date.getFullYear();
  
    // Extract time components
    const hour = date.getHours();
    const minute = date.getMinutes();
    
    // Format date in dd.mm.yyyy format
    const formattedDate = `${padZero(day)}.${padZero(month)}.${year}`;
  
    // Format time in hour:minute am/pm format
    const formattedTime = `${hour % 12 || 12}:${padZero(minute)} ${hour < 12 ? 'AM' : 'PM'}`;
  
    return `${formattedDate} : ${formattedTime}`;
  }
  
  function padZero(num) {
    return num.toString().padStart(2, '0');
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Booking Details</h2>
        <p>Customer Name: {booking.customerName}</p>
        <p>Pickup: {formatDate(booking.startDate)}</p>
        <p>Return: {formatDate(booking.endDate)}</p>
      </div>
    </div>
  );
}

export default BookingOverlay;
