import type { init } from "@strapi/provider-email-amazon-ses/dist/index";
import { StrapiContext } from "../../../types";
import mailText from "../services/mailText";

enum MailError {
  ARCHIVE_NOT_FOUND = "Das gewünschte Archiv konnte nicht gefunden werden.",
  EMAIL_NOT_FOUND = "Das gewünschte Archiv hat noch keine E-Mail-Adresse angegeben.",
}
type EmailOptions = Partial<Parameters<ReturnType<typeof init>["send"]>[0]>;

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
  ctx: StrapiContext;
}) => {
  let archive;

  try {
    archive = await strapi.entityService.findOne(
      "api::archive-tag.archive-tag",
      Number(recipient),
      { fields: ["email", "name"] }
    );
  } catch (error) {
    strapi.log.error(
      `Error while querying database with archive id '${recipient}':`,
      error
    );

    return ctx.badRequest(MailError.ARCHIVE_NOT_FOUND);
  }

  if (!archive) return ctx.badRequest(MailError.ARCHIVE_NOT_FOUND);

  const sendTo = archive.email;
  if (!sendTo) return ctx.badRequest(MailError.EMAIL_NOT_FOUND);

  strapi.log.debug(`Trying to relay ${sender_name}'s message to ${sendTo}`);

  try {
    const emailOptions: EmailOptions = {
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

    return ctx.created({ message: "Email sent." });
  } catch (error) {
    strapi.log.error(`Error sending email to ${sendTo}`, error);

    return ctx.badRequest(error as object);
  }
};
