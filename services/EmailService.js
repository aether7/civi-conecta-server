const nodemailer = require('nodemailer');
const config = require('../config');

class EmailService {
  async send({ from, to, subject, html }) {
    const options = await this.getTransportObject();
    const transporter = nodemailer.createTransport(options);
    return transporter.sendMail({ from, to, subject, html });
  }

  async getTransportObject() {
    const { user, pass } = await nodemailer.createTestAccount();

    return {
      host: config.email.transport.host || undefined,
      port: config.email.transport.port || undefined,
      secure: config.email.transport.secure || undefined,
      service: config.email.transport.service || user,
      auth: {
        user: config.email.transport.username || user,
        pass: config.email.transport.password || pass,
      }
    };
  }
}

module.exports = EmailService;
