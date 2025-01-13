import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import validator from 'validator';

dotenv.config();

const app = express();
const PORT: string = process.env.PORT || '5000';


app.use(cors());
app.use(bodyParser.json());


const limiter = rateLimit({
    windowMs: 2 * 60 * 60 * 1000, // 2 heures
    max: 3,
    handler: (req, res) => {
        res.status(429).json({
            error: "Trop de requêtes. Réessayez dans 2 heures.",
        });
    },});
app.use(limiter);


app.post('/api/send-email', limiter, async (req, res) => {
    const { name, email, message } = req.body;

    // Validation des champs
    if (
        !validator.isLength(name, { min: 1, max: 50 }) ||
        !validator.isEmail(email) ||
        !validator.isLength(message, { min: 1, max: 500 })
    ) {
        return res.status(400).json({ error: 'Les champs sont invalides.' });
    }


    const sanitizedName = validator.escape(name);
    const sanitizedEmail = validator.normalizeEmail(email);
    const sanitizedMessage = validator.escape(message);

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER || "",
            to: process.env.RECEIVER_EMAIL || "",
            replyTo: sanitizedEmail || "false" ,
            subject: `Nouveau message de ${sanitizedName}`,
            text: `[ ${sanitizedMessage} ] Recontacte par mail : ${sanitizedEmail}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Email envoyé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l’envoi de l’e-mail:', error);
        res.status(500).json({ error: 'Une erreur est survenue. Réessayez plus tard.' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend sur le port ${PORT}`);
});
