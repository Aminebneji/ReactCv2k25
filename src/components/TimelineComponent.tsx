import React, { useEffect, useState } from "react";
import "../assets/styles/timeline.css";
import timelineData from "../assets/data/timeline.json";

interface TimelineItem {
    date: string;
    image: string;
    title: string;
    description: string;
    link?: string;
}

const Timeline: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    useEffect(() => {
        const timelineItems = document.querySelectorAll(".timeline__item");
        const handleScroll = () => {
            const offsets = Array.from(timelineItems).map(
                (item) => (item as HTMLElement).offsetTop
            );

            timelineItems.forEach((item, index) => {
                const elementTop = offsets[index];
                const nextElementTop = offsets[index + 1] || Infinity;
                const windowScrollY = window.scrollY;

                if (
                    windowScrollY >= elementTop - 200 &&
                    (index === timelineItems.length - 1 || windowScrollY < nextElementTop - 200)
                ) {
                    setActiveIndex(index);
                }
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    return (
        <article>
            <h2 className="h2 article-title">Experiences</h2>
            <div className="timeline">
                <div className="timeline__vertical-line" />

                {timelineData.map((item: TimelineItem, index) => (
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
                        </div>
                    </div>
                ))}
            </div>
        </article>
    );
};

export default Timeline;
