import mailText from "../services/mailText";

export const contact = async ({
  recipient,
  sender_name,
  subject,
  reply_email,
  message,
  ctx,
}: {
  recipient: string;
  sender_name: string;
  subject: string;
  reply_email: string;
  message: string;
  ctx: any;
}) => {
  const archive = await strapi.entityService.findOne(
    "api::archive-tag.archive-tag",
    Number(recipient),
    { fields: ["email", "name"] }
  );

  const sendTo = archive?.email;
  strapi.log.debug(`Trying to relay ${sender_name}'s message to ${sendTo}`);

  if (!sendTo)
    return ctx.badRequest(
      "Das gewünschte Archiv hat noch keine E-Mail angegeben."
    );

  try {
    const emailOptions = {
      to: sendTo,
      subject: `Neue Nachricht über das Kontaktformular: ${subject}`,
      replyTo: reply_email ? reply_email : undefined,
      html: mailText(
        archive?.name ?? "",
        sender_name,
        reply_email,
        "harz-history.de",
        message
      ),
    };
    await strapi.plugins["email"].services.email.send(emailOptions);
    strapi.log.debug(`Email sent to ${sendTo}`);
    return ctx.send({ message: "Email sent." }, 201);
  } catch (err) {
    strapi.log.error(`Error sending email to ${sendTo}`, err);
    return ctx.badRequest(err);
  }
};
