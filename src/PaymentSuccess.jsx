import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import './paymentSuccess.css';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const PaymentSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Optional: Verify payment status with backend
        const verifyPayment = async () => {
            try {
                const reference = new URLSearchParams(window.location.search).get('reference');
                if (reference) {
                    const response = await axios.get(`${API_BASE_URL}/api/payments/verify?reference=${reference}`);
                    if (!response.data.status) {
                        navigate('/payment/cancel');
                    }
                }
            } catch (error) {
                console.error('Payment verification failed:', error);
                navigate('/payment/cancel');
            }
        };

        verifyPayment();
    }, []);

    return (
        <div className="payment-success">
            <div className="success-container">
                <i className="fas fa-check-circle"></i>
                <h1>Payment Successful!</h1>
                <p>Your booking has been confirmed.</p>
            
                <button onClick={() => navigate('/')}>
                    Return to Home
                </button>
            </div>
        </div>
    );
};