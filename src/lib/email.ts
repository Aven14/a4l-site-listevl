import nodemailer from 'nodemailer'

// Configuration du transporteur d'e-mail
const createTransporter = () => {
  // Configuration depuis les variables d'environnement
  const smtpConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true pour 465, false pour autres ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  }

  // Si pas de configuration SMTP, utiliser un transporteur de test (pour le développement)
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️  SMTP non configuré, utilisation d\'un transporteur de test')
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'test@ethereal.email',
        pass: 'test',
      },
    })
  }

  return nodemailer.createTransport(smtpConfig)
}

/**
 * Envoie un e-mail de vérification avec un code à 6 chiffres
 */
export async function sendVerificationEmail(
  email: string,
  code: string,
  username?: string
): Promise<void> {
  const transporter = createTransporter()

  const mailOptions = {
    from: `"Catalogue Véhicule A4L" <${process.env.SMTP_USER || 'noreply@a4l.com'}>`,
    to: email,
    subject: 'Vérification de votre compte - Catalogue Véhicule A4L',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
              border-radius: 10px;
              padding: 30px;
              color: #fff;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              width: 60px;
              height: 60px;
              border-radius: 12px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 24px;
              margin-bottom: 20px;
            }
            .code-box {
              background: rgba(16, 185, 129, 0.1);
              border: 2px solid #10b981;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin: 30px 0;
            }
            .code {
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              color: #10b981;
              font-family: 'Courier New', monospace;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid rgba(255, 255, 255, 0.1);
              text-align: center;
              font-size: 12px;
              color: #888;
            }
            .warning {
              background: rgba(239, 68, 68, 0.1);
              border-left: 4px solid #ef4444;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">A4L</div>
              <h1 style="margin: 0; color: #fff;">Vérification de votre compte</h1>
            </div>
            
            <p>Bonjour${username ? ` ${username}` : ''},</p>
            
            <p>Merci de vous être inscrit sur <strong>Catalogue Véhicule A4L</strong> !</p>
            
            <p style="color: #888; font-size: 14px; margin-top: 10px;">
              <em>Note : Ce site est un catalogue non-officiel créé par des joueurs du serveur Arma For Life. 
              Nous ne sommes pas affiliés au serveur officiel Arma For Life.</em>
            </p>
            
            <p>Pour activer votre compte, veuillez entrer le code de vérification suivant :</p>
            
            <div class="code-box">
              <div class="code">${code}</div>
            </div>
            
            <div class="warning">
              <strong>⚠️ Important :</strong>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Ce code est valide pendant <strong>10 minutes</strong> uniquement</li>
                <li>Ne partagez jamais ce code avec personne</li>
                <li>Si vous n'avez pas créé de compte, ignorez cet e-mail</li>
              </ul>
            </div>
            
            <p>Si vous n'avez pas demandé ce code, vous pouvez ignorer cet e-mail en toute sécurité.</p>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} Catalogue Véhicule A4L - Site non-officiel créé par des joueurs</p>
              <p style="font-size: 11px; color: #666; margin-top: 5px;">
                Ce site n'est pas affilié au serveur officiel Arma For Life.
              </p>
              <p>Cet e-mail a été envoyé automatiquement, merci de ne pas y répondre.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Bonjour${username ? ` ${username}` : ''},

Merci de vous être inscrit sur Catalogue Véhicule A4L !

Note : Ce site est un catalogue non-officiel créé par des joueurs du serveur Arma For Life. 
Nous ne sommes pas affiliés au serveur officiel Arma For Life.

Pour activer votre compte, veuillez entrer le code de vérification suivant :

${code}

Ce code est valide pendant 10 minutes uniquement.

Si vous n'avez pas créé de compte, ignorez cet e-mail.

© ${new Date().getFullYear()} Catalogue Véhicule A4L - Site non-officiel créé par des joueurs
Ce site n'est pas affilié au serveur officiel Arma For Life.
    `.trim(),
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('✅ E-mail de vérification envoyé:', info.messageId)
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'e-mail:', error)
    throw new Error('Impossible d\'envoyer l\'e-mail de vérification')
  }
}

/**
 * Génère un code de vérification à 6 chiffres
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
