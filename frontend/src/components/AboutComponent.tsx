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
                    Je suis un développeur qui aime apprendre et se dépasser en explorant des projets variés.
                    Ce qui me motive, c’est de résoudre des problèmes, créer des solutions utiles et continuer à grandir dans ce que je fais.
                    Les projets que j’explore me rendent plus solide à chaque étape, et c’est précisément ça qui me passionne.
                </p>
            </section>
            <section className="techno">
                <Technologies technologies={technologiesData}/>
            </section>
        </article>
    );
};

export default About;
