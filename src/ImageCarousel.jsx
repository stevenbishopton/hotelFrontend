/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import './imageCarousel.css';

export const ImageCarousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-scroll functionality
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => 
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(timer);
    }, [images.length]);

    const nextSlide = () => {
        setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
    };

    const prevSlide = () => {
        setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="carousel-container">
            <div className="carousel">
                {images.map((image, index) => (
                    <div 
                        key={index}
                        className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
                        style={{
                            transform: `translateX(${100 * (index - currentIndex)}%)`
                        }}
                    >
                        <img src={image} alt={`Slide ${index + 1}`} />
                    </div>
                ))}
                
                <button className="carousel-button prev" onClick={prevSlide}>
                    &#10094;
                </button>
                <button className="carousel-button next" onClick={nextSlide}>
                    &#10095;
                </button>
            </div>
            
            <div className="carousel-dots">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                    />
                ))}
            </div>
        </div>
    );
};