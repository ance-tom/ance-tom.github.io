import React, { useState, useEffect } from 'react';
import './SchedulePage.css';
import BookingOverlay from '../overlays/BookingOverlay';
import Location from '../../images/location.png';

function SchedulePage() {
  // State for storing selected station, bookings, current date, and selected year, month, week
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState('');
  const [bookings, setBookings] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1); // Month starts from 0
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [yearRange, setYearRange] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Function to calculate ISO week number
  function getISOWeek(date) {
    const dt = new Date(date);
    dt.setHours(0, 0, 0, 0);
    dt.setDate(dt.getDate() + 4 - (dt.getDay() || 7));
    const yearStart = new Date(dt.getFullYear(), 0, 1);
    return Math.ceil((((dt - yearStart) / 86400000) + 1) / 7);
  };

  // Fetch stations data from API
  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await fetch('https://605c94c36d85de00170da8b4.mockapi.io/stations');
      const data = await response.json();
      // Assuming the response data is an array of stations
      setStations(data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    }
  };

  // Fetch bookings data for the selected station from API
  useEffect(() => {
    if (selectedStation) {
      fetchBookings(selectedStation);
    }
  }, [selectedStation, selectedYear, selectedMonth, selectedWeek]);

  const fetchBookings = async (stationId) => {
    try {
      const response = await fetch(`https://605c94c36d85de00170da8b4.mockapi.io/stations/${stationId}/bookings`);
      const data = await response.json();
      // Assuming the response data is an array of bookings
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  // UseEffect to generate the year range
  useEffect(() => {
    const currentYear = currentDate.getFullYear();
    const years = Array.from({ length: 20 }, (_, index) => currentYear - 10 + index); // Range of 10 years (5 years before and after the current year)
    setYearRange(years);
  }, [currentDate]);

  // Handler for station selection change
  const handleStationChange = (event) => {
    setSelectedStation(event.target.value);
  };

  // Handler for year selection change
  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  // Handler for month selection change
  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  // Handler for week selection change
  const handleWeekChange = (event) => {
    setSelectedWeek(parseInt(event.target.value));
  };

 // Handler for moving to the previous week
const handlePrevWeek = () => {
  setSelectedWeek(selectedWeek - 1);
};

// Handler for moving to the next week
const handleNextWeek = () => {
  const isoWeekNumber = getISOWeek(currentDate);
  setSelectedWeek(selectedWeek + 1);
};

  // Handler for opening the overlay
  const openOverlay = (booking) => {
    setSelectedBooking(booking);
  };

  // Handler for closing the overlay
  const closeOverlay = () => {
    setSelectedBooking(null);
  };

  return (
    <div className="main" data-testid="schedule-page">
      <h2 className='title'>Dashboard</h2>
      {/* Station Selection Dropdown */}
      <select className='select-dropdown' value={selectedStation} onChange={handleStationChange}>
        <option value="">Select Station</option>
        {/* Map through stations data to generate dropdown options */}
        {stations.map(station => (
          <option key={station.id} value={station.id}>{station.name}</option>
        ))}
      </select>
      
      {/* Calendar Grid */}
      {selectedStation !== "" ? (
        <div className="calendar">
          <div className='date-select'>
            {/* Year Selection Dropdown */}
            <select className='select-dropdown' value={selectedYear} onChange={handleYearChange}>
              {/* Options for selecting year range */}
              {yearRange.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            {/* Month Selection Dropdown */}
            <select className='select-dropdown' value={selectedMonth} onChange={handleMonthChange}>
              {/* Options for selecting month */}
              {Array.from({ length: 12 }).map((_, index) => (
                <option key={index + 1} value={index + 1}>{new Date(selectedYear, index, 1).toLocaleString('default', { month: 'long' })}</option>
              ))}
            </select>

            {/* Week Selection Dropdown */}
            <select className='select-dropdown' value={selectedWeek} onChange={handleWeekChange}>
              {/* Options for selecting week */}
              {Array.from({ length: 5 }).map((_, index) => (
                <option key={index + 1} value={index + 1}>Week {index + 1}</option>
              ))}
            </select>
          </div>
          <div className='weekly-view'>
            <button className="navigation-button" onClick={handlePrevWeek} data-testid="prev-week">
              <i className="fas fa-angle-left"></i> 
            </button>
            <div className="week">
              {/* Render 7 cells representing each day of the week */}
              {Array.from({ length: 7 }).map((_, index) => {
                const startDate = new Date(selectedYear, selectedMonth - 1, 1); // Start from the first day of the selected month
                const firstDayOfMonth = startDate.getDay(); // Get the day of the week for the first day of the month (0 for Sunday, 1 for Monday, etc.)
                const offset = (selectedWeek - 1) * 7 - firstDayOfMonth; // Calculate the offset to adjust the start of the week
                startDate.setDate(startDate.getDate() + offset + index); // Set the start date of the week
                return (
                  <div key={index} className="day">
                    <p className='date-title'>{startDate.toDateString()}</p>
                    {/* Render bookings for the day */}
                    {bookings.map(booking => (
                      // Check if booking falls on the current day
                      (new Date(booking.startDate).toDateString() === startDate.toDateString() || new Date(booking.endDate).toDateString() === startDate.toDateString()) && (
                        <div key={booking.id} 
                        className= {new Date(booking.startDate).toDateString() === startDate.toDateString() ? "booking pickup" : "booking return"} 
                        onClick={() => openOverlay(booking)}>
                          {/* Display booking details */}
                          <p>{booking.customerName}</p>
                          <p>{booking.bookingDate}</p>
                          {/* Add more booking details as needed */}
                        </div>
                      )
                    ))}
                  </div>
                );
              })}
            </div>
            <button className="navigation-button" onClick={handleNextWeek}>
              <i className="fas fa-angle-right"></i>
            </button>
          </div>
        </div>
      ):
      <div className="location">
        <img src={Location} alt="location icon" className="location" height="75" width="75"/>
        <p>Select a location to continue!</p>
      </div>
      }

      {/* Overlay */}
      {selectedBooking && (
        <BookingOverlay booking={selectedBooking} onClose={closeOverlay} />
      )}
    </div>
  );
}

export default SchedulePage;
