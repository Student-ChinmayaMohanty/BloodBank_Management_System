import Home from './pages/Home';
import Router,{BrowserRouter, Route, Routes} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import OurTeam from './pages/OurTeam';
import About from './pages/About';
import Contact from './pages/Contact';
import 'jquery'; 
import 'popper.js'; 
import 'bootstrap/dist/js/bootstrap.min.js';
import "./App.css"; 
import DonorRequest from './pages/DonorRequest';
import ManageRequests from './pages/ManageRequests';

import LandingSelection from './pages/LandingSelection';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingSelection />}   />   
      <Route path="/home" element={<Home />}   />   
      <Route path="/OurTeam" element={<OurTeam/>}   />   
      <Route path="/about" element={<About />}   />
      <Route path="/contact" element={<Contact />}   />  
      <Route path="/donor-request" element={<DonorRequest />}   /> 
      <Route path="/manage-requests" element={<ManageRequests />}   /> 
    </Routes>
    </BrowserRouter>
  );
}

export default App;
