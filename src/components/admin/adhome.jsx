import React from 'react';
import "../../styles/adhome.css";
import EventsAD from './events';

const Adhome = ({isAdmin,email}) => {
  return (
    <div className='homy'>
      <div>
        <div className='titlehome'>
          Turn moments into memories with <span style={{ color: "#00FFDD" }}>Eventify</span>
        </div>
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
      {    console.log(isAdmin)}
      <div id="events">
        <EventsAD isAdmin={isAdmin} email={email} />
      </div>
    </div>
  );
};

export default Adhome;
