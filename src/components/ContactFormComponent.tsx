import React, { useState } from 'react';

const ContactForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isFormValid, setFormValid] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));

        setFormValid(
            formData.name.trim() !== '' && formData.email.trim() !== '' && formData.message.trim() !== ''
        );
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

    };

    return (
        <form data-form onSubmit={handleSubmit}>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                data-form-input
                placeholder="Your Name"
                required
            />
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                data-form-input
                placeholder="Your Email"
                required
            />
            <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                data-form-input
                placeholder="Your Message"
                required
            />
            <button
                type="submit"
                data-form-btn
                disabled={!isFormValid}
            >
                Send Message
            </button>
        </form>
    );
};

export default ContactForm;
