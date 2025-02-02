import { useState } from 'react';
import axios from 'axios';
import './modal.css';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

console.log('CreateBooking Modal Rendered:', { isOpen }); 

export const CreateBooking = ({ isOpen, onClose, onBookingCreated }) => {
    const [newBooking, setNewBooking] = useState({
        roomId: '',
        clientId: '',
        startDate: '',
        endDate: ''
    });

    const handleCreateBooking = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/bookings`, newBooking, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onBookingCreated(); // Callback to refresh bookings list
            onClose(); // Close the modal
            setNewBooking({ roomId: '', clientId: '', startDate: '', endDate: '' });
        } catch (error) {
            console.error('Error creating booking:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Create New Booking</h2>
                <form onSubmit={handleCreateBooking}>
                    <div className="form-group">
                        <label>Room ID</label>
                        <input
                            type="number"
                            value={newBooking.roomId}
                            onChange={(e) => setNewBooking({...newBooking, roomId: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Client ID</label>
                        <input
                            type="number"
                            value={newBooking.clientId}
                            onChange={(e) => setNewBooking({...newBooking, clientId: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Start Date</label>
                        <input
                            type="date"
                            value={newBooking.startDate}
                            onChange={(e) => setNewBooking({...newBooking, startDate: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>End Date</label>
                        <input
                            type="date"
                            value={newBooking.endDate}
                            onChange={(e) => setNewBooking({...newBooking, endDate: e.target.value})}
                            required
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="submit" className="submit-btn">Create Booking</button>
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};