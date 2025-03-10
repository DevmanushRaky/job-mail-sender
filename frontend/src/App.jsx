import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { HrMail } from './pages/HrMail';
import { Apply } from './pages/Apply';
import { MailLog } from './pages/MailLog';
import './App.css';
import { About } from './pages/About';
import { Faq } from './pages/Faq';
import { NotFound } from './pages/Notfound';

function App() {
  return (
    <Router>
      <Navbar />
      <div className='main-content'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hrmail" element={<HrMail />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/maillog" element={<MailLog />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="*" element={<NotFound />}  />
        </Routes>
      </div>
    </Router >
  );
}

export default App;
