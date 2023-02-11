const nodemailer = require('nodemailer');
const config = require('../config');

class EmailService {
  async send({ from, to, subject, html }) {
    const options = await this.getTransportObject();
    const transporter = nodemailer.createTransport(options);
    return transporter.sendMail({ from, to, subject, html });
  }

  async getTransportObject() {
    const testAccount = await nodemailer.createTestAccount();

    return {
      host: config.email.transport.host ?? testAccount.smtp.host,
      port: config.email.transport.port ?? testAccount.smtp.port,
      secure: config.email.transport.secure ?? testAccount.smtp.secure,
      auth: {
        user: config.email.transport.username ?? testAccount.user,
        pass: config.email.transport.password ?? testAccount.pass
      }
    };
  }
}

module.exports = EmailService;
