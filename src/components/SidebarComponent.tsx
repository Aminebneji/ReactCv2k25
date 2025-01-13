import React, { useState } from "react";
import "../assets/styles/sidebar.css";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const SidebarComponent: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleSidebar = () => {
        setIsExpanded((prev) => !prev);
    };

    return (
        <aside className={`sidebar ${isExpanded ? "active" : ""}`}>

            <div className="sidebar-info">
                <figure className="avatar-box">
                    <img src="/img/unnamed.png" alt="Amine Benneji" width="80" />
                </figure>
                <div className="info-content">
                    <h1 className="name" title="Amine Benneji">Amine Benneji</h1>
                    <p className="title">Développeur</p>
                </div>
                <button className="info-more-btn" onClick={toggleSidebar}>
                    <span>{isExpanded ? "Réduire" : "Voir plus"}</span>
                </button>
            </div>

            <div className="sidebar-info-more">
                <div className="separator"></div>
                <ul className="contacts-list">
                    <li className="contact-item">
                        <div className="icon-box">
                            <EmailIcon />
                        </div>
                        <div className="contact-info">
                            <p className="contact-title">Email</p>
                            <a href="mailto:aminebneji@gmail.com" className="contact-link">
                                aminebneji@gmail.com
                            </a>
                        </div>
                    </li>
                    <li className="contact-item">
                        <div className="icon-box">
                            <PhoneIcon />
                        </div>
                        <div className="contact-info">
                            <p className="contact-title">Téléphone</p>
                            <a href="tel:+33629411250" className="contact-link">
                                +33629411250
                            </a>
                        </div>
                    </li>
                    <li className="contact-item">
                        <div className="icon-box">
                            <LocationOnIcon />
                        </div>
                        <div className="contact-info">
                            <p className="contact-title">Localisation</p>
                            <address>LILLE, Nord, FRANCE</address>
                        </div>
                    </li>
                </ul>
                <div className="separator"></div>
                <ul className="social-list">
                    <li className="social-item">
                        <a
                            href="https://linkedin.com/in/aminebenneji"
                            className="social-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <LinkedInIcon />
                        </a>
                    </li>
                    <li className="social-item">
                        <a
                            href="https://github.com/aminebenneji"
                            className="social-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <GitHubIcon />
                        </a>
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default SidebarComponent;
