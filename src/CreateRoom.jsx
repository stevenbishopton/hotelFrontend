import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateRoom.css';


const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const CreateRoom = () => {
    const navigate = useNavigate();
    const [newRoom, setNewRoom] = useState({
        roomNumber: '',
        roomType: '',
        description: '',
        imageUrl: '',
        pricePerNight: '',
        underMaintenance: false
    });

    const [error, setError] = useState('');

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('token');
            const roomData = {
                ...newRoom,
                pricePerNight: parseFloat(newRoom.pricePerNight)
            };

            await axios.post(`${API_BASE_URL}/api/rooms`, roomData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            navigate('/admin'); // Redirect back to admin dashboard
        } catch (error) {
            setError(error.response?.data?.message || 'Error creating room');
        }
    };

    return (
        <div className="create-room-page">
            <div className="create-room-container">
                <div className="page-header">
                    <h1>Create New Room</h1>
                    <button 
                        className="back-button"
                        onClick={() => navigate('/admin')}
                    >
                        Back to Dashboard
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleCreateRoom} className="room-form">
                    <div className="form-group">
                        <label>Room Number</label>
                        <input
                            type="text"
                            value={newRoom.roomNumber}
                            onChange={(e) => setNewRoom({...newRoom, roomNumber: e.target.value})}
                            required
                            placeholder="e.g., A101"
                        />
                    </div>

                    <div className="form-group">
                        <label>Room Type</label>
                        <select
                            value={newRoom.roomType}
                            onChange={(e) => setNewRoom({...newRoom, roomType: e.target.value})}
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
                            value={newRoom.description}
                            onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
                            required
                            placeholder="Room description..."
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label>Image URL</label>
                        <input
                            type="url"
                            value={newRoom.imageUrl}
                            onChange={(e) => setNewRoom({...newRoom, imageUrl: e.target.value})}
                            required
                            placeholder="https://example.com/room-image.jpg"
                        />
                    </div>

                    <div className="form-group">
                        <label>Price per Night ($)</label>
                        <input
                            type="number"
                            value={newRoom.pricePerNight}
                            onChange={(e) => setNewRoom({...newRoom, pricePerNight: e.target.value})}
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
                                checked={newRoom.underMaintenance}
                                onChange={(e) => setNewRoom({...newRoom, underMaintenance: e.target.checked})}
                            />
                            Under Maintenance
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn">Create Room</button>
                    </div>
                </form>
            </div>
        </div>
    );
};