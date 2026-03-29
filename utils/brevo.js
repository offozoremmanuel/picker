const BrevoClient = require("@getbrevo/brevo");
const emailTemplate = require('../email');

const brevoClient = new BrevoClient.TransactionalEmailsApi()

brevoClient.setApiKey(BrevoClient.TransactionalEmailsApiApiKeys.apiKey, process.env.brevoApikey);

const brevo = async (userEmail, userName,html) => {
  try {
      const sendSmtpEmail = new BrevoClient.SendSmtpEmail()
    const data = {
        htmlContent: html,
        sender: {
            email: "offozoremmy@gmail.com",
            name: "emmanuel from Splita",
        },
        subject: "Hello from Splita!",
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