import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { debounce } from 'lodash';
import './allRooms.css';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'; // Default to localhost if not set

export const AllRoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [availabilityStatus, setAvailabilityStatus] = useState({});
    const [searchDates, setSearchDates] = useState({
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd')
    });
    const [filters, setFilters] = useState({
        roomType: '',
        priceRange: { min: '', max: '' },
        sortBy: 'PRICE_ASC'
    });

    const fetchRooms = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                startDate: searchDates.startDate,
                endDate: searchDates.endDate
            });

            if (filters.roomType) {
                params.append('roomType', filters.roomType);
            }
            if (filters.priceRange.min) {
                params.append('minPrice', filters.priceRange.min);
            }
            if (filters.priceRange.max) {
                params.append('maxPrice', filters.priceRange.max);
            }
            if (filters.sortBy) {
                params.append('sortBy', filters.sortBy);
            }

            const response = await axios.get(`${API_BASE_URL}/api/rooms/filter?${params}`);
            setRooms(response.data);
            console.log('API_BASE_URL:', API_BASE_URL);

            const newAvailabilityStatus = response.data.reduce((acc, room) => {
                acc[room.id] = {
                    available: !room.underMaintenance && room.available,
                    nextAvailableDates: room.nextAvailableDates
                };
                return acc;
            }, {});
            setAvailabilityStatus(newAvailabilityStatus);
        } catch (err) {
            console.error('Error fetching rooms:', err);
            setError(err.response?.data?.message || 'Failed to load rooms');
        } finally {
            setLoading(false);
        }
    }, [searchDates, filters]);

    const debouncedFetch = useCallback(
        debounce(() => {
            fetchRooms();
        }, 300),
        [fetchRooms]
    );

    useEffect(() => {
        debouncedFetch();
        return () => debouncedFetch.cancel();
    }, [debouncedFetch]);

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setSearchDates(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        if (name === 'priceRange') {
            const [min, max] = value.split('-');
            setFilters(prev => ({
                ...prev,
                priceRange: { min, max }
            }));
        } else {
            setFilters(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    if (loading && rooms.length === 0) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading rooms...</p>
            </div>
        );
    }

    if (error && rooms.length === 0) {
        return (
            <div className="error-container">
                <h2>Error Loading Rooms</h2>
                <p>{error}</p>
                <button onClick={fetchRooms} className="retry-button">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="rooms-container">
            <div className="search-filters-container">
                <div className="date-picker">
                    <div className="date-input">
                        <label>Check-in:</label>
                        <input
                            type="date"
                            name="startDate"
                            value={searchDates.startDate}
                            onChange={handleDateChange}
                            min={format(new Date(), 'yyyy-MM-dd')}
                            disabled={loading}
                        />
                    </div>
                    <div className="date-input">
                        <label>Check-out:</label>
                        <input
                            type="date"
                            name="endDate"
                            value={searchDates.endDate}
                            onChange={handleDateChange}
                            min={searchDates.startDate}
                            disabled={loading}
                        />
                    </div>
                </div>
                <div className="filters">
                    <select
                        name="roomType"
                        value={filters.roomType}
                        onChange={handleFilterChange}
                        disabled={loading}
                    >
                        <option value="">All Room Types</option>
                        <option value="SINGLE">Single</option>
                        <option value="DOUBLE">Double</option>
                        <option value="SUITE">Suite</option>
                        <option value="DELUXE">Deluxe</option>
                    </select>
                    <select
                        name="priceRange"
                        value={`${filters.priceRange.min}-${filters.priceRange.max}`}
                        onChange={handleFilterChange}
                        disabled={loading}
                    >
                        <option value="-">All Prices</option>
                        <option value="0-50000">₦0 - ₦50,000</option>
                        <option value="50000-100000">₦50,000 - ₦100,000</option>
                        <option value="100000-200000">₦100,000 - ₦200,000</option>
                        <option value="200000-">₦200,000+</option>
                    </select>
                    <select
                        name="sortBy"
                        value={filters.sortBy}
                        onChange={handleFilterChange}
                        disabled={loading}
                    >
                        <option value="PRICE_ASC">Price: Low to High</option>
                        <option value="PRICE_DESC">Price: High to Low</option>
                    </select>
                </div>
            </div>

            <div className="rooms-grid">
                {rooms.map((room) => (
                    <div key={room.id} className="room-card">
                        <div className="room-image-container">
                            <img 
                                src={room.imageUrl || '/default-room-image.jpg'} // Set default image directly
                                alt={`Room ${room.roomNumber}`}
                                onError={(e) => {
                                    if (e.target.src !== '/default-room-image.jpg') {
                                        e.target.src = '/default-room-image.jpg';
                                    }
                                }}
                                loading="lazy" // Add lazy loading
                                style={{ minHeight: "200px" }} // Add minimum height
                            />
                            {room.underMaintenance && (
                                <div className="maintenance-badge">
                                    Under Maintenance
                                </div>
                            )}
                        </div>
                        <div className="room-info">
                            <div className="room-header">
                                <h2>Room {room.roomNumber}</h2>
                                <span className="room-type">{room.roomType}</span>
                            </div>
                            <p className="room-description">{room.description}</p>
                            <div className="room-price">
                                <span className="price-amount">
                                    ₦{parseFloat(room.pricePerNight).toLocaleString('en-NG', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </span>
                                <span className="price-period">/night</span>
                            </div>
                            <div className={`availability-status ${
                                room.underMaintenance ? 'maintenance' : 
                                availabilityStatus[room.id]?.available ? 'available' : 'unavailable'
                            }`}>
                                {room.underMaintenance ? 'Under Maintenance' : 
                                 availabilityStatus[room.id]?.available ? 'Available' : 'Unavailable for selected dates'}
                                {!room.underMaintenance && 
                                 !availabilityStatus[room.id]?.available && 
                                 availabilityStatus[room.id]?.nextAvailableDates && (
                                    <div className="next-available">
                                        Next available: {format(new Date(availabilityStatus[room.id].nextAvailableDates[0]), 'MMM dd, yyyy')}
                                    </div>
                                )}
                            </div>
                            <Link 
                                to={`/rooms/${room.id}`}
                                state={{ 
                                    dates: searchDates,
                                    availability: availabilityStatus[room.id]
                                }}
                                className={`view-details-btn ${
                                    room.underMaintenance || 
                                    !availabilityStatus[room.id]?.available 
                                        ? 'disabled' 
                                        : ''
                                }`}
                                onClick={(e) => {
                                    if (room.underMaintenance || 
                                        !availabilityStatus[room.id]?.available) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            
            {rooms.length === 0 && !loading && (
                <div className="no-rooms-message">
                    <h3>No rooms found matching your criteria</h3>
                    <p>Try adjusting your filters or dates</p>
                </div>
            )}
        </div>
    );
};