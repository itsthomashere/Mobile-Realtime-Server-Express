import nodemailer from "nodemailer";

async function mainSender(email: string, title: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD,
    },
  });
  try {
    let result = await transporter.sendMail({
      from: "Thomas Chatapp mail bot <Do not reply!>",
      to: email,
      subject: title,
      html: `<h1> Your OTP : ${otp} </h1>`,
    });
    console.log(`Email sent: ${result.response}`);
    return result;
  } catch (error) {
    console.log(error);
  }
}

export { mainSender };
