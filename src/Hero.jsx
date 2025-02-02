import "./hero.css";
import { ImageCarousel } from "./ImageCarousel";
import poolImg from "./assets/pool photo-1364656744-1024x1024.jpg";
import restaurantImg from "./assets/restaurant-1404204719-1024x1024.jpg";
import barImg from "./assets/barphoto-1148223648-1024x1024.jpg";
import gymImg from "./assets/gym-photo-1437851885-1024x1024.jpg";
import sportsImg from "./assets/sportscourtphoto-1253907080-1024x1024.jpg";
import videoGamesImg from "./assets/videogameo-1334436084-1024x1024.jpg";
import singleBedImg from "./assets/singlebedphoto-1091260868-1024x1024.jpg";
import doubleBedImg from "./assets/doublebed-1390233984-1024x1024.jpg";
import deluxeRoomImg from "./assets/deluxeroomphoto-147993670-1024x1024.jpg";

export const Hero = () => {
  const carouselImages = [
    poolImg,
    restaurantImg,
    barImg,
    gymImg,
    sportsImg,
    videoGamesImg,
  ];

  
  return (
    <>
      <div className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Experience Luxury Like Never Before</h1>
            <p>Discover comfort and elegance in the heart of the city</p>
          </div>
        </div>
        <ImageCarousel images={carouselImages} />
      </div>



      <div className="room-categories">
        <h2>Our Accommodations</h2>
        <div className="room-grid">
          <div className="room-category">
            <img src={singleBedImg} alt="Single Room" />
            <div className="category-info">
              <h3>Single Rooms</h3>
              <p>Perfect for solo travelers</p>
              <span className="price">From ₦10,000/night</span>
            </div>
          </div>
          <div className="room-category">
            <img src={doubleBedImg} alt="Double Room" />
            <div className="category-info">
              <h3>Double Rooms</h3>
              <p>Ideal for couples</p>
              <span className="price">From ₦20,000/night</span>
            </div>
          </div>
          <div className="room-category">
            <img src={deluxeRoomImg} alt="Deluxe Suite" />
            <div className="category-info">
              <h3>Deluxe Suites</h3>
              <p>Ultimate luxury experience</p>
              <span className="price">From ₦40,000/night</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};