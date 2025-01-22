import React, {useState} from 'react';
import '../assets/styles/contact.css';




const ContactForm = () => {
    const [formData, setFormData] = useState({name: '', email: '', message: ''});
    const [isFormValid, setFormValid] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);


    // on vérifie le champ pour s'assurer qu'il s'agit bien d'un email, pour le reste des champs le backend va faire le taf
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.target;
        setFormData((prevData) => ({...prevData, [name]: value}));

        setFormValid(
            formData.name.trim() !== '' &&
            validateEmail(formData.email) &&
            formData.message.trim() !== ''
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

        // je vérifie la présence dans le local storage d'une éventuelle
        // trace d'une requête, si c'est le cas je return sinon j'initie l'envoie du message par mail

        if (!isSubmissionAllowed()) {
            setFeedbackMessage('Vous envoyez trop de messages');
            return;
        }

        setSubmitting(true);
        setFeedbackMessage(null);

        //call au backend pour le mail (avec nodemailer)
        try {
            const response: Response = await fetch(`${process.env.REACT_APP_API_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                }),
            });

            if (response.ok) {
                setFeedbackMessage('Votre message a été envoyé avec succès.');
                localStorage.setItem('lastSubmission', Date.now().toString());
            } else if (response.status === 429) {
                setFeedbackMessage("encore trop de messages, désolé");
            } else {
                const errorData = await response.json();
                setFeedbackMessage(errorData.error || 'Une erreur est survenue.');
            }
        } catch (error) {
            console.error('Erreur lors de l’envoi du formulaire:', error);
            setFeedbackMessage('Une erreur est survenue.');
        } finally {
            setTimeout(() => {
                setSubmitting(false);
                setFormData({name: '', email: '', message: ''});
            }, 2000);
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
