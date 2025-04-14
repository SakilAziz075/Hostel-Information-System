import './Home.css';
import HostelEntrance from '../assets/Entrance.jpg'

const Home = () => {
  return (
    <div className="home-container">


      <div className="hostel-logo">
        <h1 className="welcome-heading" >Welcome to<br /> Nilachal Men's Hostel</h1>
        <img src={HostelEntrance} alt="" />
      </div>

      <div className="info-section">
        <div className='about-us'>
          <h1>About Us
            <p>
              Nilachal has been operating since 30th July, 2008. The Hostel was formally <br />
              inaugurated on 18th September 2009 by Sri Joseph Toppo, Member of Parliament. <br />
              In the first few months of its construction, the hostel was called New Men's <br/>
              Hostel,and was later re-christened Nilachal, in honour of the Nilachal Hill, <br />
              the abode of mother Godess Kamakhya. We feel the name fits with its grand <br />
              structure and beauty. The hostel celebrates two festivals each year. In the <br />
              Autumn semester we celebrate Enajori or the Annual Hostel Get-together and <br />
              in the Spring semster, we organise the Hostel Senior's Farewell. Apart from <br />
              this we organise Saraswati Puja in early Spring, and participate in inter-hostel <br />
               cometitions such as the March-Past, choir competition, and more. <br />
            </p>

          </h1>
        </div>

        <div className='notifications'>
          <h1>Notifications</h1>
        </div>
      </div>


    </div>
  );
};

export default Home;
