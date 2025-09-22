import nodemailer from "nodemailer";

export async function sendMessage(sub, txt) {
  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: process.env.MAIL_SECURE === "true", // convert to boolean
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    requireTLS: process.env.MAIL_TLS === "true", // convert to boolean
  });

 let message = {
    from: process.env.MAIL_USERNAME,
    to: process.env.MESSAGE_TO,
    subject: sub,
    text: txt,
  };

try {
  await transporter.sendMail(message);
  console.log("Message sent");
} catch (error) {
  console.log("Message failed to send:", error);
  throw error; // rethrow to allow caller to handle
}
}