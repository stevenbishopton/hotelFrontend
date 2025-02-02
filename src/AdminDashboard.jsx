import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './adminDashboard.css';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const AdminDashboard = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [activeTab, setActiveTab] = useState('current'); // 'current', 'checked-out', 'rooms'
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchBookings();
        fetchRooms();
    }, []);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/api/bookings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(response.data.content);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const fetchRooms = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/api/rooms`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRooms(response.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const handleDeleteRoom = async (roomId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/api/rooms/${roomId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchRooms();
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting room:', error);
        }
    };

    const getCurrentBookings = () => {
        const now = new Date();
        return bookings.filter(booking => 
            new Date(booking.endDate) >= now && !booking.checkedOut
        );
    };

    const getCheckedOutBookings = () => {
        return bookings.filter(booking => booking.checkedOut);
    };

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1>Hotel Admin Dashboard</h1>
                <button 
                    className="create-room-btn"
                    onClick={() => navigate('/admin/rooms/create')}
                >
                    Create New Room
                </button>
            </div>

            <div className="tab-navigation">
                <button 
                    className={activeTab === 'current' ? 'active' : ''}
                    onClick={() => setActiveTab('current')}
                >
                    Current Bookings
                </button>
                <button 
                    className={activeTab === 'checked-out' ? 'active' : ''}
                    onClick={() => setActiveTab('checked-out')}
                >
                    Checked Out
                </button>
                <button 
                    className={activeTab === 'rooms' ? 'active' : ''}
                    onClick={() => setActiveTab('rooms')}
                >
                    Rooms
                </button>
            </div>

            <div className="dashboard-content">
                {activeTab === 'current' && (
                    <div className="bookings-table">
                        <h2>Current Bookings</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Room</th>
                                    <th>Guest Name</th>
                                    <th>Check In</th>
                                    <th>Check Out</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getCurrentBookings().map(booking => (
                                    <tr key={booking.id}>
                                        <td>{booking.roomNumber}</td>
                                        <td>{booking.clientName}</td>
                                        <td>{new Date(booking.startDate).toLocaleDateString()}</td>
                                        <td>{new Date(booking.endDate).toLocaleDateString()}</td>
                                        <td>{booking.checkedIn ? 'Checked In' : 'Not Checked In'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'checked-out' && (
                    <div className="bookings-table">
                        <h2>Checked Out Bookings</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Room</th>
                                    <th>Guest Name</th>
                                    <th>Stay Period</th>
                                    <th>Amount Paid</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getCheckedOutBookings().map(booking => (
                                    <tr key={booking.id}>
                                        <td>{booking.roomNumber}</td>
                                        <td>{booking.clientName}</td>
                                        <td>
                                            {new Date(booking.startDate).toLocaleDateString()} - 
                                            {new Date(booking.endDate).toLocaleDateString()}
                                        </td>
                                        <td>${booking.amountPaid}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'rooms' && (
                    <div className="rooms-table">
                        <h2>Room Management</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Room Number</th>
                                    <th>Type</th>
                                    <th>Price/Night</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map(room => (
                                    <tr key={room.id}>
                                        <td>{room.roomNumber}</td>
                                        <td>{room.roomType}</td>
                                        <td>${room.pricePerNight}</td>
                                        <td>{room.underMaintenance ? 'Maintenance' : 'Available'}</td>
                                        <td>
                                            {deleteConfirm === room.id ? (
                                                <div className="delete-confirm">
                                                    <button 
                                                        className="confirm-btn"
                                                        onClick={() => handleDeleteRoom(room.id)}
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button 
                                                        className="cancel-btn"
                                                        onClick={() => setDeleteConfirm(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button 
                                                    className="delete-btn"
                                                    onClick={() => setDeleteConfirm(room.id)}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
