import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import validator from 'validator';

dotenv.config();

const app = express();
const PORT: string = process.env.PORT || '5000';

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.json());

//rate limiter
const limiter: RateLimitRequestHandler = rateLimit({
    windowMs: 2 * 60 * 60 * 1000, // 2 heures
    max: 10,
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
        validator.isLength(name, { min: 1, max: 25 }) &&
        validator.isEmail(email) &&
        validator.isLength(message, { min: 1, max: 500 })
    );
}

// Vérifiction si email exist
async function checkEmailExists(email: string): Promise<boolean> {
    // Simulez un appel ou ajoutez une API tierce pour valider réellement l'email
    return validator.isEmail(email);
}

// Envoi email
async function sendEmail(name: string, email: string, message: string): Promise<void> {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        logger: true,
        debug: true,
    });

    const mailOptions = {
        from: `"Portfolio Contact" <${process.env.SENDER_EMAIL}>`,
        to: process.env.RECEIVER_EMAIL,
        subject: `Nouveau message de ${name}`,
        text: `[${message}] Recontacte par mail : ${email}`,
        replyTo: email,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Email envoyé avec succès");
    } catch (error) {
        console.error("❌ Erreur lors de l’envoi:", error);
        throw error;
    }
}

// Route principale
app.get('/', (req, res) => {
    res.status(200).send('Bienvenue sur le backend !');
});

// Route mailer
app.post('/api/send-email', limiter, async (req, res) => {
    const { name, email, message } = req.body;

    if (!validateFields(name, email, message)) {
        return res.status(400).json({ error: 'Les champs sont invalides.' });
    }

    const emailExists: boolean = await checkEmailExists(email);
    if (!emailExists) {
        return res.status(400).json({ error: "L'email fourni est invalide ou inexistant." });
    }

    const sanitizedName: string = validator.escape(name);
    const sanitizedEmail: string = validator.normalizeEmail(email) || '';
    const sanitizedMessage: string = validator.escape(message);

    res.status(202).json({ message: 'Votre message est en cours d\'envoi.' });

    setImmediate(() => {
        sendEmail(sanitizedName, sanitizedEmail, sanitizedMessage)
            .then(() => console.log('✅ Email envoyé avec succès'))
            .catch((error) => console.error('❌ Erreur lors de l’envoi de l’e-mail:', error));
    });
});

app.listen(PORT, () => {
    console.log(`Backend sur le port ${PORT}`);
});
