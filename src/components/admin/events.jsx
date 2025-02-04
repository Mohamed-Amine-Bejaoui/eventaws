import AWS from 'aws-sdk';
import "../../styles/adevents.css";
import React, { useState, useEffect } from 'react';
// Set up AWS S3 instance
const s3 = new AWS.S3({
  region: 'eu-west-1',
  credentials: new AWS.Credentials(process.env.REACT_APP_AWS_ACCESS_KEY_ID,process.env.REACT_APP_AWS_SECRET_ACCESS_KEY),
});


const generateUniqueFileName = () => `event-${Date.now()}`;

const EventsAD = ({isAdmin,email}) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const[showDetails,setShowDetails]=useState(false)
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_date: '',
    price: '',
    location: '',
    seats: 0,
    capacity: 0,
    image_url: null,
  });
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);  // New state for tracking image load
  // Fetch events from API
  useEffect(() => {
        console.log("2" + isAdmin,email)
    
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://y7a64avn3a.execute-api.eu-west-1.amazonaws.com/stagi/events');
        if (!response.ok) throw new Error('Failed to load events');
        const data = await response.json();
        console.log(data)
        setEvents(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEvents();
  }, []);

  // Handle input changes
  const handleInputChange = ({ target: { name, value } }) => {
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };
  const handleRegis = async (event, email) => 
  {
    //setIsRegistered(true);
    const seatsTa=2;
    try {
      console.log(event,email)
      const submitResponse = await fetch('https://epzkulkhw6.execute-api.eu-west-1.amazonaws.com/createrRegist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: email,
          event_id: event,
          registered_at: new Date().toISOString(), 
          seatsT: 2
        })
      });
      /*
      selectedEvent.seats=seatsTa
      console.log (JSON.stringify(selectedEvent))
      const UpdateResponse = await fetch(`https://y7a64avn3a.execute-api.eu-west-1.amazonaws.com/events/${event}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify(selectedEvent)
      });
  */
      if (!submitResponse.ok) {
        throw new Error('Failed to add registeration');
      }
    /*  if(!UpdateResponse){
        throw new Error('failed to update the event')
      }
  */
      // Reset form or state (assuming setNewRegis is a function)
  
    } catch (error) {
      console.error("Error registering:", error);
    }
  };
  


  
  // Handle file change
  const handleFileChange = ({ target: { files } }) => {
    setNewEvent(prev => ({ ...prev, image_url: files[0] }));
  };



  
  // Handle event addition
  const handleAddEvent = async (e) => {
    e.preventDefault();
    setLoadingEvent(true);

    try {
      // Basic form validation
      if (!newEvent.title || !newEvent.description || !newEvent.event_date || !newEvent.price || !newEvent.location || !newEvent.capacity || !newEvent.seats || !newEvent.image_url) {
        setError("All fields are required.");
        setLoadingEvent(false);
        return;
      }

      const fileName = generateUniqueFileName();

      // Generate signed URL to upload image
      const fileUrl = await s3.getSignedUrlPromise('putObject', {
        Bucket: 'events3',
        Key: fileName,
        Expires: 3600,
        ContentType: newEvent.image_url.type,
      });

      // Upload the image to S3
      const uploadResponse = await fetch(fileUrl, {
        method: "PUT",
        headers: { "Content-Type": newEvent.image_url.type },
        body: newEvent.image_url,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      // Prepare the event object with the image URL
      const eventWithImageURL = {
        ...newEvent,
        image_url: `https://events3.s3.eu-west-1.amazonaws.com/${fileName}`,  // Updated with the correct URL
      };

      // Send event data to API (with image URL)
      const submitResponse = await fetch('https://y7a64avn3a.execute-api.eu-west-1.amazonaws.com/stagi/events', {
        method: 'POST',
        body: JSON.stringify(eventWithImageURL),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!submitResponse.ok) {
        throw new Error('Failed to add event');
      }

      // Reset form after event is added
      setNewEvent({ title: '', description: '', event_date: '', price: '', location: '', seats: 0, capacity: 0, image_url: null });
      setShowModal(false);

      // Optionally, re-fetch events to update the event list
      const updatedEvents = await fetch('https://y7a64avn3a.execute-api.eu-west-1.amazonaws.com/stagi/events');
      setEvents(await updatedEvents.json());

    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingEvent(false);
    }
  };

  // Function to handle image load (after fetching)
  const handleImageLoad = () => {
    setImageLoaded(true);  // Set imageLoaded to true after the image is loaded
  };

  return (
    <div className='eventad'>
      <div className='banner'>
        <p>Turn moments into memories with <span style={{ color: "#00FFDD" }}>Eventify</span></p>
      </div>
      <br />
      {isAdmin &&(
      <div className='button2' onClick={() => setShowModal(true)}>Add Event</div>
      )}
      <br />
      <div className='event-carousel'>
    {events.map((event, index) => (
    <a href="#details" style={{ textDecoration: "none",color:"white" }} onClick={
      ()=>{setShowDetails(true)
        setSelectedEvent(event);
      }

    }>
    <div key={index} className='event-card'>
      <img
        src={event.image_url || require("../../assets/jcole.jpg")}
        alt={event.title}
        className='event-image'
      />
      <h3>{event.title}</h3>
      <p>{new Date(event.event_date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
      <p>{event.location}</p>
      <p>{event.seats} / {event.capacity}</p>
      <p>{event.price === 0 ? 'Free' : event.price + " TND"}</p>
    </div>
    </a>
    ))}
    </div>


      {showModal && (
        <div className='modal'>
          <div className='modal-content'>
            <span className='close' onClick={() => setShowModal(false)}>&times;</span>
            <h2 style={{ color: "black" }}>Add New Event</h2>
            {error && <p className="error-message">{error}</p>} {/* Display error message */}
            <form onSubmit={handleAddEvent}>
              <input 
                type="text" 
                name="title" 
                placeholder="Event Title" 
                value={newEvent.title} 
                onChange={handleInputChange} 
                required 
              />
              <textarea 
                name="description" 
                placeholder="Event Description" 
                value={newEvent.description} 
                onChange={handleInputChange} 
                required 
              />
              <input 
                type="datetime-local" 
                name="event_date" 
                value={newEvent.event_date} 
                onChange={handleInputChange} 
                required 
              />
              
              {/* Price and Location Inputs in Same Line */}
              <div className="input-group">
                <input 
                  type="number" 
                  name="price" 
                  placeholder="Price" 
                  value={newEvent.price} 
                  onChange={handleInputChange} 
                  required 
                />
                <input 
                  type="text" 
                  name="location" 
                  placeholder="Location" 
                  value={newEvent.location} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              {/* Capacity and Seats Inputs in Same Line */}
              <div className="input-group">
                <input 
                  type="number" 
                  name="capacity" 
                  placeholder="Capacity" 
                  value={newEvent.capacity} 
                  onChange={handleInputChange} 
                  required 
                />
                <input 
                  type="number" 
                  name="seats" 
                  placeholder="Seats Available" 
                  value={newEvent.seats} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <input 
                type="file" 
                name="image_url" 
                onChange={handleFileChange} 
                required 
              />
              <button type="submit" disabled={loadingEvent}>
                {loadingEvent ? 'Uploading...' : 'Add Event'}
              </button>
            </form>
          </div>
        </div>
      )}
   {showDetails && selectedEvent && (
  <div className='details-modal' id='details'>
    <div className='modalDetails'>
      <div className='imageDetail'>
      <img src={selectedEvent.image_url} alt={selectedEvent.title} className='event-image' />
      </div>
      <div className='infosDetails'>
      <span className='close' onClick={() => setShowDetails(false)}>&times;</span>
      <h2>{selectedEvent.title}</h2>
      <p style={{marginTop:"-25px"}}><strong>Date:</strong> {new Date(selectedEvent.event_date).toLocaleString()}</p>
      <p><strong>Location:</strong> {selectedEvent.location}</p>
      <p><strong>Description:</strong> {selectedEvent.description}</p>
      <p><strong>Seats Available:</strong> {selectedEvent.seats} / {selectedEvent.capacity}</p>
      <p><strong>Price:</strong> {selectedEvent.price === 0 ? 'Free' : `${selectedEvent.price} TND`}</p>
       {!isAdmin && !isRegistered && (<span className='add' onClick={() => handleRegis(selectedEvent.id,email)}>Register</span>)}
      </div>
    </div>
  </div>
)}



    </div>
  );
};

export default EventsAD;
