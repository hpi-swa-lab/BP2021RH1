import { sanitize } from "isomorphic-dompurify";

const mailText = (
  archiveName: string,
  senderName: string,
  replyTo: string,
  websiteUrl: string,
  message: string
) =>
  sanitize(
    `Liebes Team des Archivs <b>${archiveName}</b>,<br>
<br>
Wir möchten Sie über eine Nachricht informieren, die über das Kontaktformular auf unserer Website harz-history.de eingegangen ist. Die Details der Nachricht lauten wie folgt:<br>
<br>
<b>Absender:</b> ${senderName || "anonym"}<br>
${replyTo ? `<b>E-Mail-Adresse:</b> ${replyTo}<br>` : ""}
<b>Nachricht:</b><br>
<br>
<div style='white-space: pre-wrap;'>${message}</div>
<br>
Wir möchten Sie darauf hinweisen, dass diese Nachricht automatisch generiert wurde. Bitte antworten Sie deshalb nicht direkt auf diese E-Mail, sondern wenden Sie sich falls gegeben an die E-Mail-Adresse des Absenders.
<br>
Sie erhalten diese E-Mail, da Ihre E-Mail-Adresse für das Archiv "${archiveName}" auf ${websiteUrl} eingetragen wurde.<br>
<br>
Mit freundlichen Grüßen<br>
<br>
Das Harz History Team`,
    { USE_PROFILES: { html: true } }
  );

export default mailText;
