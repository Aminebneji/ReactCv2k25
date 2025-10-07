import React, { useState } from 'react';
import '../assets/styles/contact.css';




const ContactForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isFormValid, setFormValid] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);


    // on vérifie le champ pour s'assurer qu'il s'agit bien d'un email, pour le reste des champs le backend va faire le taf
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        const updatedData = { ...formData, [name]: value };
        setFormData(updatedData);

        setFormValid(
            updatedData.name.trim() !== '' &&
            validateEmail(updatedData.email) &&
            updatedData.message.trim() !== ''
        );
    };


    // ici le but c'est de contraindre l'envoie d'un mail unique par utilisateur en utilisant le local storage
    const isSubmissionAllowed = (): boolean => {
        const lastSubmission: string | null = localStorage.getItem('lastSubmission');
        if (lastSubmission) {
            const oneWeekInMs: number = 7 * 24 * 60 * 60 * 1000;
            const timeElapsed: number = Date.now() - parseInt(lastSubmission, 10);
            return timeElapsed > oneWeekInMs;
        }
        return true;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isSubmissionAllowed()) {
            setFeedbackMessage('Vous envoyez trop de messages');
            return;
        }

        setSubmitting(true);
        setFeedbackMessage('Votre message est en cours d’envoi...');

        try {
            const response: Response = await fetch(`${process.env.REACT_APP_API_URL}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.status === 202 || response.status === 200) {
                setFeedbackMessage('Votre message est en cours d’envoi...');

                setTimeout(() => {
                    setFeedbackMessage('Message envoyé avec succès ✅');
                    localStorage.setItem('lastSubmission', Date.now().toString());
                }, 1500);
            } else {
                const data = await response.json();
                setFeedbackMessage(data.error || 'Une erreur est survenue.');
            }
        } catch (error) {
            console.error('Erreur lors de l’envoi du formulaire:', error);
            setFeedbackMessage('Une erreur est survenue côté serveur.');
        } finally {
            setTimeout(() => {
                setSubmitting(false);
                setFormData({ name: '', email: '', message: '' });
            }, 2500);
        }
    };



    return (
        <article>
            <form className="contact-form" onSubmit={handleSubmit}>
                <h2 className="h2 article-title">Contact</h2>
                <div className="input-wrapper">
                    <input
                        type="text"
                        name="name"
                        className="form-input"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Votre Nom"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        className="form-input"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Votre Email"
                        required
                    />
                    <textarea
                        name="message"
                        className="form-input"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Votre Message"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="form-btn"
                    disabled={!isFormValid || isSubmitting}
                >
                    {isSubmitting ? 'Envoi...' : 'Envoyer'}
                </button>
                {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}
            </form>
        </article>
    );
};

export default ContactForm;
