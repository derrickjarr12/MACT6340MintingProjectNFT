import nodemailer from "nodemailer";

export asyncfunction sendMessage(sub, txt) {
	let transporter = nodemailer.createTransporter({
		host: process.env.MAIL_HOST,
		port: process.env.MAIL_PORT,
		secure: process.env.MAIL_SECURE,
		auth: {
			user: process.env.MAIL_USERNAME,
		},
		requireTLS: process.env.MAIL_TLS,
	});
}

let message ={
    from: process.env.MESSAGE_FROM,
    to: process.env.MESSAGE_TO,
    subject: sub,
    text: txt,
};
await transporter
.sendMail(message);
then(() => {
    console.log("Message sent");
})
.catch((error) => {
    console.log("Message not sent. " + error);
});
