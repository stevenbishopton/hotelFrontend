
import './footer.css';

export const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>GrandSlam Hotels</h3>
                    <p>Luxury and comfort in the heart of the city. Experience world-class hospitality.</p>
                    <div className="social-links">
                        <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
                        <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                        <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                    </div>
                </div>

                <div className="footer-section">
                    <h3>Contact</h3>
                    <ul className="contact-info">
                        <li><i className="fas fa-map-marker-alt"></i> 123,Delta,Nigeria</li>
                        <li><i className="fas fa-phone"></i>08083685286</li>
                        <li><i className="fas fa-envelope"></i> info@grandslamhotels.com</li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Useful Links</h3>
                    <ul>
                        <li><a href="/login">Member Login</a></li>
                        <li><a href="#careers">Careers</a></li>
                        <li><a href="#gift-cards">Gift Cards</a></li>
                    </ul>
                </div>
            </div>
            
            <div className="footer-bottom">
                <div className="footer-bottom-links">
                    <a href="#privacy">Privacy Policy</a>
                    <a href="#terms">Terms & Conditions</a>
                    <a href="#accessibility">Accessibility</a>
                </div>
                <p>&copy; 2024 GrandSlam Hotels. All rights reserved.</p>
            </div>
        </footer>
    );
};