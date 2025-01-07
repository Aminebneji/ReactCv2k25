import React, { useState } from "react";
import "../assets/styles/techno.css";

interface Technology {
    id: number;
    name: string;
    icon: string;
    description: string;
}

interface TechnologiesProps {
    technologies: Technology[];
}

const Technologies: React.FC<TechnologiesProps> = ({ technologies }) => {
    const [modalActive, setModalActive] = useState(false);
    const [selectedTechnology, setSelectedTechnology] = useState<Technology | null>(null);

    const openModal = (technology: Technology) => {
        setSelectedTechnology(technology);
        setModalActive(true);
    };

    const closeModal = () => {
        setModalActive(false);
        setSelectedTechnology(null);
    };

    return (
        <section className="technologies">
            <h3 className="h3 technologies-title">Technologies</h3>

            <ul className="technologies-list has-scrollbar">
                {technologies.map((technology) => (
                    <li className="technologies-item" key={technology.id}>
                        <div
                            className="content-card"
                            onClick={() => openModal(technology)}
                        >
                            <figure className="technologies-icon-box">
                                <img
                                    src={technology.icon}
                                    alt={`Icon of ${technology.name}`}
                                    width="60"
                                />
                                <h4 className="h4 technologies-item-title">
                                    {technology.name}
                                </h4>
                            </figure>

                            <div className="technologies-text">
                                <p>{technology.description}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {modalActive && selectedTechnology && (
                <div className="modal-container active">
                    <div className="overlay active" onClick={closeModal}></div>
                    <div className="technologies-modal">
                        <button className="modal-close-btn" onClick={closeModal}>
                            ✕
                        </button>
                        <div className="modal-icon-box">
                            <img
                                src={selectedTechnology.icon}
                                alt={`Icon of ${selectedTechnology.name}`}
                                width="80"
                            />
                        </div>
                        <h4 className="modal-title">{selectedTechnology.name}</h4>
                        <div className="modal-content">{selectedTechnology.description}</div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Technologies;
