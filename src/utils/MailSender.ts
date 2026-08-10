
import nodemailer from "nodemailer";

export const MailSender = async ({
  email,
  cc,
  bcc,
  finalSubject,
  finalHTML,
  emailAccount,
}: any) => {

  const isGmail = emailAccount.email.toLowerCase().endsWith("@gmail.com");

  console.log("Using SMTP:", isGmail ? "GMAIL" : "HOSTINGER");

  const transporter = nodemailer.createTransport(
    isGmail
      ? {
          service: "gmail",
          auth: {
            user: emailAccount.email,
            pass: emailAccount.password,
          },
        }
      : {
          host: "smtp.hostinger.com",
          port: 465,
          secure: true,
          auth: {
            user: emailAccount.email,
            pass: emailAccount.password,
          },
        }
  );

  await transporter.sendMail({
    from: `"Tirupati travels" <${emailAccount.email}>`, // ✅ fixed
    to: email.email,
    cc: cc?.length ? cc : undefined,
    bcc: bcc?.length ? bcc : undefined,
    subject: finalSubject,
    html: finalHTML,
  });

  console.log("✅ Email sent successfully");
};