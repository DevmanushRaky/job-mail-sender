import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="brand">
        <Link to="/" onClick={() => setMenuOpen(false)}>Job Mail Sender</Link>
      </div>

      {/* Hamburger Menu Icon */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX /> : <FiMenu />}
      </div>

      {/* Navigation Links */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li><Link to="/hrmail" onClick={() => setMenuOpen(false)}>HR Mail</Link></li>
        <li><Link to="/apply" onClick={() => setMenuOpen(false)}>Apply Job</Link></li>
        <li><Link to="/maillog" onClick={() => setMenuOpen(false)}>Mail Log</Link></li>
        <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
        <li><Link to="/faq" onClick={() => setMenuOpen(false)}>Faq</Link></li>
      </ul>
    </nav>
  );
};
