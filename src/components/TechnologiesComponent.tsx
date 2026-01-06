import React, { useState, useEffect, useRef } from "react";
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
  const [selectedTechnology, setSelectedTechnology] =
    useState<Technology | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const openModal = (technology: Technology) => {
    setSelectedTechnology(technology);
    setModalActive(true);
  };

  const closeModal = () => {
    setModalActive(false);
    setSelectedTechnology(null);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && modalActive) {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalActive]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const handleWheel = (event: WheelEvent) => {
      const isTrackpad =
        Math.abs(event.deltaX) > 0 || Math.abs(event.deltaY) < 15;
      if (!isTrackpad) {
        event.preventDefault();
        const scrollSpeed = 4;
        list.scrollLeft += event.deltaY * scrollSpeed;
      }
    };

    list.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      list.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <section className="technologies">
      <h3 className="h3 article-title">Technologies</h3>

      <ul className="technologies-list has-scrollbar" ref={listRef}>
        {technologies.map((technology) => (
          <li className="technologies-item" key={technology.id}>
            <div
              className="content-card"
              onClick={() => openModal(technology)}
              role="button"
              tabIndex={0}
              aria-label={`View details about ${technology.name}`}
            >
              <figure className="technologies-icon-box">
                <img
                  src={technology.icon}
                  alt={`Icon representing ${technology.name}`}
                  loading="lazy"
                />
              </figure>
            </div>
          </li>
        ))}
      </ul>

      {modalActive && selectedTechnology && (
        <div
          className="modal-container active"
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div className="overlay active" onClick={closeModal}></div>
          <div className="technologies-modal">
            <button
              className="modal-close-btn"
              onClick={closeModal}
              aria-label="Close modal"
            >
              ✕
            </button>
            <div className="modal-icon-box">
              <img
                src={selectedTechnology.icon}
                alt={`Icon representing ${selectedTechnology.name}`}
                width="80"
              />
            </div>
            <h4 className="modal-title" id="modal-title">
              {selectedTechnology.name}
            </h4>
            <div className="modal-content" id="modal-description">
              {selectedTechnology.description}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Technologies;
