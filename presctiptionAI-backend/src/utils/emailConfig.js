// emailConfig.js
const config = require('../config/config');
const nodemailer = require('nodemailer');

// Create a transporter using Gmail OAuth2
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.nodemailerConfig.email,       // Your email address
    pass: config.nodemailerConfig.password,        // Your email password (or app password for Gmail)
  },
});

const mailOptions = {
  from: 'rishabh.vishwakarma@unthinkable.co',  // Sender address
  to: ['rishabh.vishwakarma@unthinkable.co'],   // List of recipients
  subject: '[MediMindAI] | Please check your prescription attched',  // Subject line
  text: 'Hello',   // Plain text body
  html: '<b>Hello from <i>Node.js</i>!</b>',  // HTML body
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending email:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});

// transporter.sendMail(mailOptions);

module.exports = transporter;
