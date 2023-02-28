"use strict";

module.exports = {
  contact: async (ctx) => {
    const body = ctx.request.body;
    const adresses = require("../config/adresses.json");
    const sendTo = adresses[body.recipient];
    const sender_name = body.sender_name;
    const reply_email = body.email;
    const subject = body.subject;
    const message = body.message;

    strapi.log.debug(`Trying to relay ${sender_name}'s message to ${sendTo}`);

    try {
      const emailOptions = {
        to: sendTo,
        subject: subject,
        html: `<p>Absender: ${sender_name} ${reply_email}</p> <p>${message}</p>`,
      };
      await strapi.plugins["email"].services.email.send(emailOptions);
      strapi.log.debug(`Email sent to ${sendTo}`);
      ctx.send("Ihre Nachricht ist eingegangen.");
    } catch (err) {
      strapi.log.error(`Error sending email to ${sendTo}`, err);
      ctx.send({ error: "Error sending email" });
    }
  },
};
