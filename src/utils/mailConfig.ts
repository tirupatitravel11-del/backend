import dotenv from "dotenv";
export interface MailAccType {
  service: {
    email: string;
    password: string;
  };
  support: {
    email: string;
    password: string;
  };
  training: {
    email: string;
    password: string;
  };
  career: {
    email: string;
    password: string;
  };
  test: {
    email: string;
    password: string;
  };
}
dotenv.config()

export const MAIL_ACCOUNTS = {
  services: {
    email: process.env.SERVICES_EMAIL!,
    password: process.env.SERVICES_EMAIL_PASSWORD!,
  },
  support: {
    email: process.env.SUPPORT_EMAIL!,
    password: process.env.SUPPORT_EMAIL_PASSWORD!,
  },
  training: {
    email: process.env.TRAINING_EMAIL!,
    password: process.env.TRAINING_EMAIL_PASSWORD!,
  },
  careers: {
    email: process.env.CAREERS_EMAIL!,
    password: process.env.CAREERS_EMAIL_PASSWORD!,
  },
  test: {
    email: process.env.TEST_EMAIL!,
    password: process.env.TEST_EMAIL_PASSWORD!,
  },
};

