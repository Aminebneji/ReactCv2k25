import React, {useEffect, useState} from "react";
import "../assets/styles/timeline.css";
import timelineData from "../assets/data/timeline.json";
import techData from "../assets/data/techno.json";

interface TimelineItem {
    technologies: number[];
    date: string;
    image: string;
    title: string;
    description: string;
    link?: string;
}

const Timeline: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    useEffect(() => {
        const timelineItems: NodeListOf<Element> = document.querySelectorAll(".timeline__item");
        const handleScroll = () => {
            const offsets: number[] = Array.from(timelineItems).map(
                (item: Element) => (item as HTMLElement).offsetTop
            );

            timelineItems.forEach((item: Element, index: number) => {
                const elementTop: number = offsets[index];
                const nextElementTop: number = offsets[index + 1] || Infinity;
                const windowScrollY: number = window.scrollY;

                if (
                    windowScrollY >= elementTop - 200 &&
                    (index === timelineItems.length - 1 || windowScrollY < nextElementTop - 200)
                ) {
                    setActiveIndex(index);
                }
            });
        };

        window.addEventListener("scroll", handleScroll, {passive: true});
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    return (
        <article>
            <h2 className="h2 article-title">Parcours</h2>
            <div className="timeline">
                <div className="timeline__vertical-line"/>

                {timelineData.map((item: TimelineItem, index: number) => (
                    <div
                        key={index}
                        className={`timeline__item ${
                            activeIndex === index ? "timeline__item--active" : ""
                        }`}
                    >
                        <div
                            className={`timeline__marker ${
                                activeIndex === index ? "timeline__marker--active" : ""
                            }`}
                        >
                            <span className="timeline__marker-date">{item.date}</span>
                        </div>
                        <div className="timeline__content">
                            <div className="timeline__info">
                                <img
                                    className="timeline__img"
                                    src={item.image}
                                    alt={item.title}
                                    style={{
                                        maxWidth: "100px",
                                        borderRadius: "12px",
                                        objectFit: "cover",
                                    }}
                                />
                                <div className="timeline__details">
                                    <h3 className="timeline__name">{item.title}</h3>
                                </div>
                            </div>
                            <p className="timeline__description">{item.description}</p>
                            {item.link && (
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="timeline__link"
                                >
                                    Voir le projet
                                </a>
                            )}
                            {item.technologies && (
                                <div className="timeline__technologies">
                                    {item.technologies.map((techId) => {
                                        const tech = techData.find((tech) => tech.id === techId);
                                        return tech ? (
                                            <div key={tech.id} className="timeline__tech-item"
                                                 style={{textAlign: "center"}}>
                                                <img
                                                    src={tech.icon}
                                                    alt={tech.name}
                                                    title={tech.name}
                                                    className="timeline__tech-icon"
                                                    style={{
                                                        height: "30px",
                                                        margin: "5px",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

            </div>
        </article>
    );
};

export default Timeline;
