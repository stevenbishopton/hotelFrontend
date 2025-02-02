import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NavBar } from "./NavBar";
import { Hero } from "./Hero";
import { Amenities } from "./Amenities";
import { AllRoomsPage } from "./AllRoomsPage";
import { Footer } from "./Footer";
import { LoginPage } from "./LoginPage";
import { AdminDashboard } from "./AdminDashboard";
import { CreateRoom } from "./CreateRoom";
import { UpdateRoom } from "./UpdateRoom";
import { RoomDetail } from "./RoomDetail";
import { PaymentSuccess } from './PaymentSuccess';
import { PaymentCancel } from './PaymentCancel';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RegisterPage } from "./RegisterPage";

function App() {
  return (
    <Router>
      <NavBar />
      <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/amenities" element={<Amenities />} />
        <Route path="/rooms" element={<AllRoomsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/rooms/create" element={<CreateRoom />} />
        <Route path="/admin/rooms/update/:id" element={<UpdateRoom />} />
        <Route path="/rooms/:id" element={<RoomDetail />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />
        

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
