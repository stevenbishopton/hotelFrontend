import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './UpdateRoom.css';


const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const UpdateRoom = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get room ID from URL

    const [room, setRoom] = useState({
        roomNumber: '',
        roomType: '',
        description: '',
        imageUrl: '',
        pricePerNight: '',
        underMaintenance: false
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_BASE_URL}/api/rooms/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRoom(response.data);
                setLoading(false);
            } catch (error) {
                // Correct error handling
                setError(error.response?.data?.message || 'Error fetching room details');
                setLoading(false);
            }
        };
    
        fetchRoom();
    }, [id]);

    const handleUpdateRoom = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('token');
            const roomData = {
                ...room,
                pricePerNight: parseFloat(room.pricePerNight)
            };

            await axios.put(`${API_BASE_URL}/api/rooms/${id}`, roomData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            navigate('/admin'); // Redirect back to admin dashboard
        } catch (error) {
            setError(error.response?.data?.message || 'Error updating room');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="update-room-page">
            <div className="update-room-container">
                <div className="page-header">
                    <h1>Update Room</h1>
                    <button 
                        className="back-button"
                        onClick={() => navigate('/admin')}
                    >
                        Back to Dashboard
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleUpdateRoom} className="room-form">
                    <div className="form-group">
                        <label>Room Number</label>
                        <input
                            type="text"
                            value={room.roomNumber}
                            onChange={(e) => setRoom({...room, roomNumber: e.target.value})}
                            required
                            placeholder="e.g., A101"
                        />
                    </div>

                    <div className="form-group">
                        <label>Room Type</label>
                        <select
                            value={room.roomType}
                            onChange={(e) => setRoom({...room, roomType: e.target.value})}
                            required
                        >
                            <option value="">Select Room Type</option>
                            <option value="SINGLE">Single</option>
                            <option value="DOUBLE">Double</option>
                            <option value="SUITE">Suite</option>
                            <option value="DELUXE">Deluxe</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={room.description}
                            onChange={(e) => setRoom({...room, description: e.target.value})}
                            required
                            placeholder="Room description..."
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label>Image URL</label>
                        <input
                            type="url"
                            value={room.imageUrl}
                            onChange={(e) => setRoom({...room, imageUrl: e.target.value})}
                            required
                            placeholder="https://example.com/room-image.jpg"
                        />
                    </div>

                    <div className="form-group">
                        <label>Price per Night ($)</label>
                        <input
                            type="number"
                            value={room.pricePerNight}
                            onChange={(e) => setRoom({...room, pricePerNight: e.target.value})}
                            required
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={room.underMaintenance}
                                onChange={(e) => setRoom({...room, underMaintenance: e.target.checked})}
                            />
                            Under Maintenance
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn">Update Room</button>
                    </div>
                </form>
            </div>
        </div>
    );
};