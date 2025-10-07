import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import dotenv from 'dotenv';
import validator from 'validator';
import Mailjet from 'node-mailjet';

dotenv.config();

const app = express();
const PORT: string = process.env.PORT || '5000';

const allowedOrigins = [
    'http://localhost:3000', // local
    'https://amine-ben-neji-curriculum2k25.onrender.com' // prod
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'CORS policy: origin non autorisée';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));
app.use(bodyParser.json());

app.set('trust proxy', 1);

// rate limiter
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


const smtpUser: string = process.env.SMTP_USER ?? '';
const smtpPass: string = process.env.SMTP_PASS ?? '';

if (!smtpUser || !smtpPass) {
    throw new Error('SMTP_USER and SMTP_PASS environment variables must be defined');
}

const mailjet = Mailjet.apiConnect(
    smtpUser,
    smtpPass
);

async function sendEmail(name: string, email: string, message: string): Promise<void> {
    try {
        const request = await mailjet
            .post('send', { version: 'v3.1' })
            .request({
                Messages: [
                    {
                        From: {
                            Email: process.env.SENDER_EMAIL,
                            Name: 'Portfolio',
                        },
                        To: [
                            {
                                Email: process.env.RECEIVER_EMAIL,
                            },
                        ],
                        Subject: `Nouveau message de ${name}`,
                        TextPart: `[${message}] Recontacte par mail : ${email}`,
                        ReplyTo: {
                            Email: email,
                        },
                    },
                ],
            });
        console.log('✅ Email envoyé avec succès via Mailjet');
    } catch (err) {
        console.error('❌ Erreur lors de l’envoi via Mailjet:', err);
        throw err;
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


app.listen(PORT, () => console.log(`Backend sur le port ${PORT}`));
