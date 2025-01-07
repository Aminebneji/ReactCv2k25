import React from 'react';
import "../src/assets/styles/main.css";
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import SidebarComponent from "./components/SidebarComponent";
import AboutComponent from "./components/AboutComponent";
import TimelineComponent from "./components/TimelineComponent";
import ContactForm from "./components/ContactFormComponent";

const Navigation = () => {
    return (
        <nav className="navbar">
            <ul className="navbar-list">
                <li><Link to="/" className="navbar-link">Presentation</Link></li>
                <li><Link to="/timeline" className="navbar-link">Experiences</Link></li>
                <li><Link to="/contact" className="navbar-link">Contacts</Link></li>
            </ul>
        </nav>
    );
};

const App = () => {
    return (
        <Router>
            <main className="main">
                <SidebarComponent />
                <Navigation />
                <div className="main-content">
                    <Routes>
                        <Route path="/" element={<AboutComponent />} />
                        <Route path="/timeline" element={<TimelineComponent />} />
                        <Route path="/contact" element={<ContactForm />} />
                    </Routes>
                </div>
            </main>
        </Router>
    );
};

export default App;
