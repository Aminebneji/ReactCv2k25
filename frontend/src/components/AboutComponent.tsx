import React, { useState } from "react";
import Technologies from "./TechnologiesComponent"
import technologiesData from "../assets/data/techno.json";
import "../assets/styles/about.css"

const About = () => {

    const [downloaded, setDownloaded] = useState(false);

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = "/CV.pdf";
        link.download = "CV.pdf";
        link.click();

        setDownloaded(true);

        setTimeout(() => setDownloaded(false), 3000);
    };

    return (
        <article className="about active" data-page="about">
            <header>
                <h2 className="h2 article-title">Présentation</h2>
            </header>
            <section className="about-text">
                <p>
                    Je suis un développeur qui aime apprendre et se dépasser en explorant des projets variés.
                    Ce qui me motive, c’est de résoudre des problèmes, créer des solutions utiles et continuer à grandir dans ce que je fais.
                    Les projets que j’explore me rendent plus solide à chaque étape, et c’est précisément ça qui me passionne.
                    Mon code aussi perfectible qu'il puisse être est disponible sur GitHub justement car je ne cherche ni a briller, ni à avoir raison, juste à évoluer.
                </p>
            </section>
            <section className="techno">
                <Technologies technologies={technologiesData} />
            </section>
            <section className="cv-download">
                <button className="cv-download-button" onClick={handleDownload}>Télécharger mon CV</button>

                {downloaded && (
                    <p className="feedback-message">
                        CV téléchargé !
                    </p>
                )}
            </section>
        </article>
    );
};

export default About;
