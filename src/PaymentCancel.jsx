import { useNavigate } from 'react-router-dom';
import './paymentCancel.css';

export const PaymentCancel = () => {
    const navigate = useNavigate();

    return (
        <div className="payment-cancel">
            <div className="cancel-container">
                <i className="fas fa-times-circle"></i>
                <h1>Payment Cancelled</h1>
                <p>Your booking was not completed.</p>
                <button onClick={() => navigate('/rooms')}>
                    Try Again
                </button>
                <button onClick={() => navigate('/')}>
                    Return to Home
                </button>
            </div>
        </div>
    );
};