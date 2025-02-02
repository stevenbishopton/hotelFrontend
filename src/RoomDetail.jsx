import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './roomDetail.css';


const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const RoomDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [bookingInfo, setBookingInfo] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        startDate: '',
        endDate: ''
    });

    const fetchRoomDetails = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/rooms/${id}`);
            setRoom(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching room details:', error);
            setError('Error loading room details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoomDetails();
    }, [id]);

    const validateDates = () => {
        const startDate = new Date(bookingInfo.startDate);
        const endDate = new Date(bookingInfo.endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (startDate < today) {
            toast.error('Check-in date cannot be in the past');
            return false;
        }

        if (endDate <= startDate) {
            toast.error('Check-out date must be after check-in date');
            return false;
        }

        return true;
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePhoneNumber = (phone) => {
        return phone.length >= 10;
    };

    const validateForm = () => {
        if (!bookingInfo.name.trim()) {
            toast.error('Please enter your name');
            return false;
        }

        if (!validateEmail(bookingInfo.email)) {
            toast.error('Please enter a valid email address');
            return false;
        }

        if (!validatePhoneNumber(bookingInfo.phoneNumber)) {
            toast.error('Please enter a valid phone number');
            return false;
        }

        if (!bookingInfo.startDate || !bookingInfo.endDate) {
            toast.error('Please select both check-in and check-out dates');
            return false;
        }

        return true;
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        
        if (!validateDates() || !validateForm()) {
            return;
        }

        setIsProcessing(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/api/payments/initiate`, {
                roomId: room.id,
                startDate: bookingInfo.startDate,
                endDate: bookingInfo.endDate,
                name: bookingInfo.name,
                email: bookingInfo.email,
                phoneNumber: bookingInfo.phoneNumber
            });

            if (response.data.authorizationUrl) {
                window.location.href = response.data.authorizationUrl;
            } else {
                toast.error('Payment initialization failed');
            }
        } catch (error) {
            console.error('Payment error:', error);
            if (error.response?.data?.code === 'BOOKING_CONFLICT') {
                const { conflictStartDate, conflictEndDate } = error.response.data;
                toast.error(
                    `This room is already booked from ${formatDate(conflictStartDate)} to ${formatDate(conflictEndDate)}. Please select different dates.`
                );
            } else {
                toast.error(error.response?.data?.message || 'Failed to initiate payment. Please try again.');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading room details...</p>
        </div>
    );

    if (error) return (
        <div className="error-container">
            <p>{error}</p>
            <button onClick={() => navigate('/rooms')}>Back to Rooms</button>
        </div>
    );

    if (!room) return (
        <div className="error-container">
            <p>Room not found</p>
            <button onClick={() => navigate('/rooms')}>Back to Rooms</button>
        </div>
    );

    return (
        <div className="room-detail-page">
            <div className="room-header">
                <div className="room-header-content">
                    <button 
                        className="back-btn"
                        onClick={() => navigate(-1)}
                    >
                        <i className="fas fa-arrow-left"></i> Back
                    </button>
                    <h1>{room.roomType} Room {room.roomNumber}</h1>
                    <p className="room-price">{room.pricePerNight} <span>per night</span></p>
                </div>
            </div>

            <div className="room-content">
                <div className="room-image-gallery">
                    <img src={room.imageUrl} alt={`Room ${room.roomNumber}`} />
                    {room.underMaintenance && (
                        <div className="maintenance-badge">Under Maintenance</div>
                    )}
                </div>

                <div className="room-info-grid">
                    <div className="room-description">
                        <h2>About this room</h2>
                        <p>{room.description}</p>
                    </div>

                    <div className="room-amenities">
                        <h2>Amenities</h2>
                        <div className="amenities-grid">
                            <div className="amenity-item">
                                <i className="fas fa-wifi"></i>
                                <span>Free WiFi</span>
                            </div>
                            <div className="amenity-item">
                                <i className="fas fa-tv"></i>
                                <span>Smart TV</span>
                            </div>
                            <div className="amenity-item">
                                <i className="fas fa-snowflake"></i>
                                <span>Air Conditioning</span>
                            </div>
                            <div className="amenity-item">
                                <i className="fas fa-coffee"></i>
                                <span>Coffee Maker</span>
                            </div>
                            <div className="amenity-item">
                                <i className="fas fa-bath"></i>
                                <span>Private Bathroom</span>
                            </div>
                            <div className="amenity-item">
                                <i className="fas fa-concierge-bell"></i>
                                <span>Room Service</span>
                            </div>
                        </div>
                    </div>

                    <div className="booking-form">
                        <h2>Book this room</h2>
                        <form onSubmit={handleBooking}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input 
                                    type="text"
                                    value={bookingInfo.name}
                                    onChange={(e) => setBookingInfo({
                                        ...bookingInfo,
                                        name: e.target.value
                                    })}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input 
                                    type="email"
                                    value={bookingInfo.email}
                                    onChange={(e) => setBookingInfo({
                                        ...bookingInfo,
                                        email: e.target.value
                                    })}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input 
                                    type="tel"
                                    value={bookingInfo.phoneNumber}
                                    onChange={(e) => setBookingInfo({
                                        ...bookingInfo,
                                        phoneNumber: e.target.value
                                    })}
                                    placeholder="Enter your phone number"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Check-in Date</label>
                                <input 
                                    type="date"
                                    value={bookingInfo.startDate}
                                    onChange={(e) => setBookingInfo({
                                        ...bookingInfo,
                                        startDate: e.target.value
                                    })}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Check-out Date</label>
                                <input 
                                    type="date"
                                    value={bookingInfo.endDate}
                                    onChange={(e) => setBookingInfo({
                                        ...bookingInfo,
                                        endDate: e.target.value
                                    })}
                                    min={bookingInfo.startDate || new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                className={`book-now-btn ${isProcessing ? 'processing' : ''}`}
                                disabled={room.underMaintenance || isProcessing}
                            >
                                {room.underMaintenance 
                                    ? 'Room Under Maintenance' 
                                    : isProcessing 
                                        ? 'Processing...' 
                                        : 'Proceed to Payment'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};