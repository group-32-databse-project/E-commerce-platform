import './App.css';
import Card from './cards.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CheckoutPage from './checkout.jsx';
import HomePage from './home.jsx';
import Guest from './homeComponent/loginpage/guest.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="api/cart" element={<Card />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/guest" element={<Guest/>} />
      </Routes>
    </Router>
  );
}

export default App;

