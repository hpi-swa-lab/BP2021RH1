import adresses from '../config/adresses.json';

export const contact = async ({
  recipient,
  sender_name,
  reply_email,
  subject,
  message,
}: {
  recipient: string;
  sender_name: string;
  reply_email: string;
  subject: string;
  message: string;
}) => {
  const sendTo = adresses[recipient];
  strapi.log.debug(`Trying to relay ${sender_name}'s message to ${sendTo}`);

  try {
    const emailOptions = {
      to: sendTo,
      subject: subject,
      html: `<p>Absender: ${sender_name} ${reply_email}</p> <p>${message}</p>`,
    };
    await strapi.plugins['email'].services.email.send(emailOptions);
    strapi.log.debug(`Email sent to ${sendTo}`);
  } catch (err) {
    strapi.log.error(`Error sending email to ${sendTo}`, err);
    throw new Error('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
  }
};
