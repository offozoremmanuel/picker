const BrevoClient = require("@getbrevo/brevo");
const emailtemplate = require('../email');

const brevoClient = new BrevoClient.TransactionalEmailsApi()

brevoClient.setApiKey(BrevoClient.TransactionalEmailsApiApiKeys.apiKey, process.env.BERVO_API_KEY);

const brevo = async (userEmail, userName,html) => {
  try {
      const sendSmtpEmail = new BrevoClient.SendSmtpEmail()
    const data = {
        htmlContent: html,
        sender: {
            email: process.env.USER_EMAIL,
            name: "emmanuel from Picker",
        },
        subject: "Hello from Picker!",
    };
    sendSmtpEmail.to = [{
        email: userEmail
    }] 
    sendSmtpEmail.subject = data.subject
    sendSmtpEmail.htmlContent = data.htmlContent
    sendSmtpEmail.sender = data.sender
   
    await brevoClient.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = {brevo}