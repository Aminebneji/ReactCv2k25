import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import rateLimit, {RateLimitRequestHandler} from 'express-rate-limit';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import validator from 'validator';
import SMTPTransport from "nodemailer/lib/smtp-transport";

dotenv.config();

const app = express();
const PORT: string = process.env.PORT || '5000';

app.use(cors());
app.use(bodyParser.json());

//rate limiter
const limiter:RateLimitRequestHandler = rateLimit({
    windowMs: 2 * 60 * 60 * 1000, // 2 heures
    max: 20,
    handler: (req, res) => {
        res.status(429).json({
            error: "Trop de requêtes. Réessayez dans 2 heures.",
        });
    },
});
app.use(limiter);

// Validation des champs
function validateFields(name: string, email: string, message: string): boolean {
    return (
        validator.isLength(name, { min: 1, max: 50 }) &&
        validator.isEmail(email) &&
        validator.isLength(message, { min: 1, max: 500 })
    );
}

// Vérifiction si email exist
async function checkEmailExists(email: string): Promise<boolean> {
    // Simulez un appel ou ajoutez une API tierce pour valider réellement l'email
    return validator.isEmail(email); // Remplacer par une vérification avancée si nécessaire
}

// Envoi email
async function sendEmail(
    name: string,
    email: string,
    message: string
): Promise<void> {
    const transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options> = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER || "",
        to: process.env.RECEIVER_EMAIL || "",
        replyTo: email || "false",
        subject: `Nouveau message de ${name}`,
        text: `[ ${message} ] Recontacte par mail : ${email}`,
    };

    await transporter.sendMail(mailOptions);
}

// Route
app.post('/api/send-email', limiter, async (req, res) => {
    const { name, email, message } = req.body;

    // Validation des champs
    if (!validateFields(name, email, message)) {
        return res.status(400).json({ error: 'Les champs sont invalides.' });
    }

    // Vérification de l'existence de l'email
    const emailExists:boolean = await checkEmailExists(email);
    if (!emailExists) {
        return res.status(400).json({ error: "L'email fourni est invalide ou inexistant." });
    }

    // Assainissement des données
    const sanitizedName:string = validator.escape(name);
    const sanitizedEmail:string = validator.normalizeEmail(email) || "";
    const sanitizedMessage:string = validator.escape(message);

    try {
        await sendEmail(sanitizedName, sanitizedEmail, sanitizedMessage);
        res.status(200).json({ message: 'Email envoyé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l’envoi de l’e-mail:', error);
        res.status(500).json({ error: 'Une erreur est survenue. Réessayez plus tard.' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend sur le port ${PORT}`);
});
