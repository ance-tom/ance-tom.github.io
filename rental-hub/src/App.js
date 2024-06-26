import React from 'react';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import SchedulePage from './components/schedule/SchedulePage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <SchedulePage />
      <Footer />
    </div>
  );
}

export default App;