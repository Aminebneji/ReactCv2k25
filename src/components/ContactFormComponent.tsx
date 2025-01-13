import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import '../assets/styles/contact.css';

const ContactForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isFormValid, setFormValid] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));

        setFormValid(
            formData.name.trim() !== '' &&
            validateEmail(formData.email) &&
            formData.message.trim() !== ''
        );
    };

    const isSubmissionAllowed = (): boolean => {
        const lastSubmission = localStorage.getItem('lastSubmission');
        if (lastSubmission) {
            const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
            const timeElapsed = Date.now() - parseInt(lastSubmission, 10);
            return timeElapsed > oneWeekInMs;
        }
        return true;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const serviceId: string = process.env.REACT_APP_EMAILJS_SERVICE_ID ?? "";
        const templateId: string = process.env.REACT_APP_EMAILJS_TEMPLATE_ID ?? "";
        const userId: string = process.env.REACT_APP_EMAILJS_USER_ID ?? "";

        if (!isSubmissionAllowed()) {
            setFeedbackMessage('Vous envoyez trop de messages, laissez-lui le temps de lire le pauvre.');
            return;
        }

        setSubmitting(true);
        setFeedbackMessage(null);

        try {
            const result = await emailjs.send(
                serviceId,
                templateId,
                {
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                },
                userId
            );

            console.log('Email envoyé avec succès:', result.text);
            setFeedbackMessage('Votre message a été envoyé avec succès.');
            localStorage.setItem('lastSubmission', Date.now().toString());
        } catch (error) {
            console.error('Erreur lors de l’envoi de l’e-mail:', error);
            setFeedbackMessage('Une erreur est survenue.');
        } finally {
            setTimeout(() => {
                setSubmitting(false);
                setFormData({ name: '', email: '', message: '' });
            }, 2000);
        }
    };

    return (
        <article>
            <form className="contact-form" onSubmit={handleSubmit}>
                <h2 className="h2 article-title">Contacte</h2>
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
