import React from "react";
import "../src/assets/styles/main.css";
import {BrowserRouter as Router, Link, Route, Routes, useLocation} from "react-router-dom";
import SidebarComponent from "./components/SidebarComponent";
import AboutComponent from "./components/AboutComponent";
import TimelineComponent from "./components/TimelineComponent";
import ContactForm from "./components/ContactFormComponent";

const Navigation = () => {
    const location = useLocation();

    return (
        <nav
            className="navbar"
            role="navigation"
            aria-label="Navigation principale"
        >
            <ul className="navbar-list">
                <li>
                    <Link
                        to="/"
                        className="navbar-link"
                        aria-current={location.pathname === "/" ? "page" : undefined}
                    >
                        Présentation
                    </Link>
                </li>
                <li>
                    <Link
                        to="/timeline"
                        className="navbar-link"
                        aria-current={location.pathname === "/timeline" ? "page" : undefined}
                    >
                        Parcours
                    </Link>
                </li>
                <li>
                    <Link
                        to="/contact"
                        className="navbar-link"
                        aria-current={location.pathname === "/contact" ? "page" : undefined}
                    >
                        Contacts
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

const App = () => {
    return (
        <Router>
            <main className="main">
                <SidebarComponent/>
                <Navigation/>
                <div
                    className="main-content"
                    role="main"
                    aria-label="Contenu principal"
                >
                    <Routes>
                        <Route path="/" element={<AboutComponent/>}/>
                        <Route path="/timeline" element={<TimelineComponent/>}/>
                        <Route path="/contact" element={<ContactForm/>}/>
                    </Routes>
                </div>
            </main>
        </Router>
    );
};

export default App;
