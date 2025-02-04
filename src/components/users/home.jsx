import React from 'react';
import "../../styles/adhome.css";
import EventsAD from '../admin/events';
const Home = (email) => {
  return (
    <div className='homy'>
      <div>
        <div className='titlehome'>
          Turn moments into memories with <span style={{ color: "#00FFDD" }}>Eventify</span>
        </div>
        {/* Use a simple anchor tag to scroll */}
        <a href="#events" style={{ textDecoration: "none" }}>
          <div className='button'>
  <span style={{ marginTop:"-7px", color:"rgb(25, 25, 25)" }}>&#8595;</span>
</div>
        </a>
      </div>
      <div className='image'>
        <img 
          src={require("../../assets/homebg1.jpg")} 
          alt="Home Background" 
          width={"1000px"} 
          height={"730px"} 
        />
      </div>
      {/* The target section for scrolling */}
      <div id="events">
        <EventsAD email={email}/>
      </div>
    </div>
  );
};

export default Home;
