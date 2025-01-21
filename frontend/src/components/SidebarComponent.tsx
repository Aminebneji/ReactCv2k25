import React, {useState} from "react";
import "../assets/styles/sidebar.css";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const SidebarComponent: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleSidebar = () => {
        setIsExpanded((prev: boolean) => !prev);
    };

    return (
        <aside
            className={`sidebar ${isExpanded ? "active" : ""}`}
            aria-label="Barre latérale avec les informations de contact et réseaux sociaux"
        >
            <div className="sidebar-info">
                <figure className="avatar-box">
                    <img
                        src="/img/avatar.png"
                        alt="avatar d'Amine Benneji"
                        width={80}
                    />
                </figure>

                <div className="info-content">
                    <h1 className="name" title="Amine Benneji">Amine Benneji</h1>
                    <p className="title">Développeur</p>
                </div>

                <button
                    className="info-more-btn"
                    onClick={toggleSidebar}
                    aria-expanded={isExpanded}
                    aria-controls="sidebar-info-more"
                >
                    <span>{isExpanded ? "Réduire" : "Voir plus"}</span>
                </button>
            </div>


            <div
                id="sidebar-info-more"
                className="sidebar-info-more"
                role="region"
                aria-hidden={!isExpanded}
            >
                <div className="separator" aria-hidden="true"></div>
                <ul className="contacts-list">
                    <li className="contact-item">
                        <div className="icon-box" aria-hidden="true">
                            <EmailIcon/>
                        </div>
                        <div className="contact-info">
                            <p className="contact-title">Email</p>
                            <a
                                href="mailto:aminebneji@gmail.com"
                                className="contact-link"
                                aria-label="Envoyer un email à aminebneji@gmail.com"
                            >
                                aminebneji@gmail.com
                            </a>
                        </div>
                    </li>
                    <li className="contact-item">
                        <div className="icon-box" aria-hidden="true">
                            <PhoneIcon/>
                        </div>
                        <div className="contact-info">
                            <p className="contact-title">Téléphone</p>
                            <a
                                href="tel:+33629411250"
                                className="contact-link"
                                aria-label="Appeler au +33629411250"
                            >
                                +33629411250
                            </a>
                        </div>
                    </li>
                    <li className="contact-item">
                        <div className="icon-box" aria-hidden="true">
                            <LocationOnIcon/>
                        </div>
                        <div className="contact-info">
                            <p className="contact-title">Localisation</p>
                            <address aria-label="Adresse de localisation">
                                LILLE, Nord, FRANCE
                            </address>
                        </div>
                    </li>
                </ul>

                <div className="separator" aria-hidden="true"></div>
                <nav aria-label="Liens vers les réseaux sociaux">
                    <ul className="social-list">
                        <li className="social-item">
                            <a
                                href="https://linkedin.com/in/aminebenneji"
                                className="social-link"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Visiter le profil LinkedIn d'Amine Benneji"
                            >
                                <LinkedInIcon/>
                            </a>
                        </li>
                        <li className="social-item">
                            <a
                                href="https://github.com/aminebenneji"
                                className="social-link"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Visiter le profil GitHub d'Amine Benneji"
                            >
                                <GitHubIcon/>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

export default SidebarComponent;
