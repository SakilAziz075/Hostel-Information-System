import './Home.css';
import HostelEntrance from '../assets/Entrance.jpg';
import { useEffect, useState } from 'react';

const Home = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/notices/');
        const data = await response.json();
        console.log('Fetched notices:', data);
        setNotifications(data);
      } catch (error) {
        console.error("Error in fetching notifications", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleDownload = (fileUrl) => {
    if (!fileUrl) {
      console.error('No file URL provided');
      return;
    }
    const fullUrl = `http://localhost:5000${fileUrl}`;
    window.open(fullUrl, '_blank');
  };

  return (
    <div className="home-container">
      <div className="hostel-logo">
        <h1 className="welcome-heading">
          Welcome to<br /> Nilachal Men's Hostel
        </h1>
        <img src={HostelEntrance} alt="Hostel Entrance" />
      </div>

      <div className="info-section">
        <div className='about-us'>
          <h1>About Us</h1>
          <p>
            Nilachal has been operating since 30th July, 2008. The Hostel was formally <br />
            inaugurated on 18th September 2009 by Sri Joseph Toppo, Member of Parliament. <br />
            In the first few months of its construction, the hostel was called New Men's <br />
            Hostel,and was later re-christened Nilachal, in honour of the Nilachal Hill, <br />
            the abode of mother Godess Kamakhya. We feel the name fits with its grand <br />
            structure and beauty. The hostel celebrates two festivals each year. In the <br />
            Autumn semester we celebrate Enajori or the Annual Hostel Get-together and <br />
            in the Spring semster, we organise the Hostel Senior's Farewell. Apart from <br />
            this we organise Saraswati Puja in early Spring, and participate in inter-hostel <br />
            cometitions such as the March-Past, choir competition, and more. <br />
          </p>
        </div>

        <div className="notifications">
          <h1>Notifications</h1>
          <div className="notice-board">
            {notifications.length === 0 ? (
              <p className="no-notices">No notifications at this time.</p>
            ) : (
              notifications.map((note) => (
                <div
                  key={note.notification_id}
                  className="notice-card"
                  style={{ cursor: note.pdf_path ? 'pointer' : 'default' }}
                  onClick={() => note.pdf_path && handleDownload(note.pdf_path)}
                  title={note.pdf_path ? "Click to open PDF" : "No file available"}
                >
                  <div className="notice-content">
                    <h3 className="notice-title">{note.title}</h3>
                    <p className="notice-description">{note.description}</p>
                    <small className="notice-date">
                      {new Date(note.created_at).toLocaleDateString()}
                    </small>
                  </div>
                  {note.pdf_path && (
                    <div className="pdf-icon" aria-label="PDF available">
                      📄
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className='facilities'>
        <h1>Facilities</h1>
      </div>
    </div>
  );
};

export default Home;
