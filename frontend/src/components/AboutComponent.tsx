import React from "react";
import Technologies from "./TechnologiesComponent"
import technologiesData from "../assets/data/techno.json";
import "../assets/styles/about.css"

const About: React.FC = () => {
    return (
        <article className="about active " data-page="about">
            <header>
                <h2 className="h2 article-title">Présentation</h2>
            </header>
            <section className="about-text">
                <p>
                    Je suis un développeur en quête de nouvelles connaissances et d'évolution.
                    Mon objectif est d'explorer une variété de projets pour continuer à progresser,
                    aussi bien sur le plan technique que professionnel.
                    Mes éxperiences passées ont confirmé mon attrait naturel pour le développement.
                </p>
            </section>
            <section className="techno">
                <Technologies technologies={technologiesData}/>
            </section>
        </article>
    );
};

export default About;
