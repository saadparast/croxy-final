const nodemailer = require('nodemailer');

// Create reusable transporter
let transporter = null;

const initTransporter = () => {
  if (!transporter) {
    // In development, use ethereal email or console logging
    if (process.env.NODE_ENV === 'development' || !process.env.EMAIL_USER) {
      console.log('Email service not configured. Emails will be logged to console.');
      return null;
    }

    transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  return transporter;
};

const sendEmail = async ({ to, subject, html, text, attachments }) => {
  try {
    const emailTransporter = initTransporter();

    // If no transporter (dev mode), just log the email
    if (!emailTransporter) {
      console.log('=== Email Log ===');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('Content:', text || html);
      console.log('================');
      return { success: true, messageId: 'console-logged' };
    }

    const mailOptions = {
      from: `"Croxy Export Import" <${process.env.EMAIL_USER || 'noreply@croxy-exim.com'}>`,
      to,
      subject,
      text: text || stripHtml(html),
      html,
      attachments
    };

    const info = await emailTransporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

// Simple HTML to text converter
const stripHtml = (html) => {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
};

module.exports = sendEmail;