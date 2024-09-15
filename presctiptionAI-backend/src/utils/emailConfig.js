

const config = require('../config/config');
const nodemailer = require('nodemailer');

// Create a transporter using Gmail OAuth2
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.nodemailerConfig.email,       // Your email address
    pass: config.nodemailerConfig.password,    // Your email password (or app password for Gmail)
  },
});

// Default email content with placeholders
const defaultMailContent = {
  subject: '[MediMindAI] | Please check your prescription attached',  // Subject line
//   text: '',   // Plain text body
  html: '',  // HTML body will be set dynamically
};

// Function to create mail options dynamically
const setMailOption = (userDetails, prescription) => {
    // console.log("🚀 ~ setMailOption ~ from, to, prescription:", from, to, prescription);

  return {
    from: config.nodemailerConfig.email,  // Sender address
    to: userDetails.email || 'rishabh.vishwakarma@unthinkable.co',      // List of recipients
    subject: defaultMailContent.subject,  // Subject line
    // text: defaultMailContent.text,   // Plain text body
    html: `
    <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your MediMind AI Prescription</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #303030;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #f0eef8;
              }
              .header {
                  background-color: #6768ca;
                  color: #ffffff;
                  padding: 20px;
                  text-align: center;
                  border-radius: 5px 5px 0 0;
              }
              .content {
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 0 0 5px 5px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              h1, h2 {
                  color: #6768ca;
              }
              table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 20px;
              }
              th, td {
                  border: 1px solid #E1E1E1;
                  padding: 8px;
                  text-align: left;
              }
              th {
                  background-color: #8586C4;
                  color: #ffffff;
              }
              .section {
                  margin-bottom: 20px;
                  background-color: #f0eef8;
                  padding: 15px;
                  border-radius: 5px;
              }
              ul {
                  padding-left: 20px;
                  color: #6a6969;
              }
              .button {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #007bff;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 5px;
                  margin-top: 20px;
              }
              .footer {
                  margin-top: 20px;
                  text-align: center;
                  color: #a1a1a1;
              }
          </style>
      </head>
      <body>
          <div class="header">
              <h1>MediMind AI Prescription</h1>
          </div>
          <div class="content">
              <p>Dear ${userDetails.name},</p>
              <p>Based on your reported symptoms of <strong>cough, fever, and body ache</strong>, here is your AI-generated prescription:</p>
            <p>${JSON.stringify(prescription)}</p>
              <div class="section">
                  <h2>Medications</h2>
                  <table>
                      <tr>
                          <th>Medicine Name</th>
                          <th>Salt Name</th>
                          <th>Dosage</th>
                          <th>Description</th>
                          <th>Days</th>
                      </tr>
                      ${prescription[0].medicines.map(med => {
                        return `
                            <td>${med.medicineName}</td>
                            <td>${med.saltName}</td>
                            <td>${med.dosage}</td>
                            <td>${med.description}</td>
                            <td>${med.numberOfDays}</td>
                        `
                      })}
                  </table>
              </div>

              <div class="section">
                  <h2>Precautions</h2>
                  <ul>
                      <li>Rest and stay hydrated</li>
                      <li>Cover mouth when coughing</li>
                      <li>Avoid close contact with others</li>
                  </ul>
              </div>

              <div class="section">
                  <h2>Diet Plan</h2>
                  <ul>
                      <li>Drink warm soups and broths</li>
                      <li>Eat fruits rich in Vitamin C</li>
                      <li>Consume warm herbal teas</li>
                  </ul>
              </div>

              <div class="section">
                  <h2>Home Remedies</h2>
                  <ul>
                      <li>Gargle with warm salt water</li>
                      <li>Use a humidifier</li>
                      <li>Drink honey and lemon tea</li>
                  </ul>
              </div>

              <p style="color: #6a6969;">Please note that this is an AI-generated prescription and should not replace professional medical advice. If symptoms persist or worsen, please consult with a healthcare professional.</p>

              <p>For your convenience, here is a list of nearby doctors:</p>

              <table>
                  <tr>
                      <th>Doctor Name</th>
                      <th>Rating</th>
                      <th>Timings</th>
                  </tr>
                  <tr>
                      <td>Dr. Sharma</td>
                      <td>4.5</td>
                      <td>9:00 AM - 5:00 PM</td>
                  </tr>
                  <tr>
                      <td>Dr. Patel</td>
                      <td>4.2</td>
                      <td>10:00 AM - 6:00 PM</td>
                  </tr>
                  <tr>
                      <td>Dr. Singh</td>
                      <td>4.7</td>
                      <td>8:00 AM - 4:00 PM</td>
                  </tr>
                  <tr>
                      <td>Dr. Gupta</td>
                      <td>4.3</td>
                      <td>11:00 AM - 7:00 PM</td>
                  </tr>
                  <tr>
                      <td>Dr. Kumar</td>
                      <td>4.6</td>
                      <td>9:30 AM - 5:30 PM</td>
                  </tr>
              </table>

              <p>Take care and get well soon!</p>

              <a href="#" class="button">View Full Prescription</a>

              <div class="footer">
                  <p>Best regards,<br>The MediMind AI Team</p>
              </div>
          </div>
      </body>
    </html>
  `
  };
};

// Function to send an email
const sendEmail = async (userDetails, prescriptionParam) => {
  const mailOptions = setMailOption(userDetails, prescriptionParam);

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = {
  sendEmail,
};
