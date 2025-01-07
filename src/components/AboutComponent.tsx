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
                    Je suis un développeur à la recherche de
                    connaissances et d'évolution. Mon but
                    c'est avant tout d'explorer d'avantages de projets pour poursuivre
                    mon évolution d'un point de vue technique comme professionnel dans ce secteur d'activité.
                    J'ai suivi plusieurs formations qui m'ont permit de confirmer mon appétence pour le Dev.
                    C'est alors avec certitude que je souhaite faire carrière

                </p>
            </section>
            <section className="techno">
<Technologies technologies={technologiesData}/>
            </section>
        </article>
    );
};

export default About;
