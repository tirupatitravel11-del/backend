import nodemailer from "nodemailer";
import path from 'path';
import dotenv from 'dotenv';
import { MAIL_ACCOUNTS } from "./mailConfig";

const envPath = path.resolve(__dirname, '..', '.env');
const viewPath = path.resolve(__dirname, '../..', 'views');
dotenv.config({ path: envPath });

type MailType = "services" | "support" | "training" | "careers" | "test";
type MailTemplateOptions = {
  from: string
  to: string;
  subject: string;
  template: string;
  context: {
    user_name?: string;
    title?: string;
    decription?: string;
    content?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    message?: string;
    subject?: string;
    email?: string;
  };
};

export const MailSendCustomer = async (
  sendingmail: MailTemplateOptions,
  type: MailType,

): Promise<boolean> => {
  try {
    // console.log("Preparing to send email:", sendingmail, viewPath);

    const hbs = (await import("nodemailer-express-handlebars")).default;

    const account = MAIL_ACCOUNTS[type];

    if (!account) throw new Error("Invalid mail type");

    // console.log(account, account.email, account.password, type);

    let transporter;

    if (process.env.SERVER_TYPE === "staging") {
      transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    } else {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: account.email,
          pass: account.password,
        },
        logger: false,
        debug: false,
      });

      // transporter = nodemailer.createTransport({
      //   host: process.env.SMTP_HOST,
      //   port: Number(process.env.SMTP_PORT),
      //   secure: false,
      //   auth: {
      //     user: account.email,
      //     pass: account.password,
      //   },
      // });
    }

    // Handlebars options (TypeScript-safe)
    const handlebarOptions = {
      viewEngine: {
        partialsDir: path.join(viewPath, "partials"),
        layoutsDir: path.join(viewPath, "layouts"),
        // defaultLayout: false,
      },
      viewPath: viewPath,
      //   extName: ".hbs",
    };

    transporter.use("compile", hbs(handlebarOptions));

    // Send the mail
    const info = await transporter.sendMail(sendingmail);

    console.log("Email sent successfully:", info.response);
    console.log("Accepted:", info.accepted);

    return true;
  } catch (error) {
    console.error("Email error:", error);
    return false;
  }
};



export default MailSendCustomer;
