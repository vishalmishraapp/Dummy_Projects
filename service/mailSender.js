const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service:'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "vishal.mishra@appventurez.com", // your ethereal email
    pass: "eebmxyacjuwfngce", // your ethereal password
  },
});

module.exports = transporter;
















// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service:"gmail",
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false, // Use `true` for port 465, `false` for all other ports
//   auth: {
//     user: "process.env.USER",
//     pass: "process.env.APP_PASSWORD",
//   },
// });

// // async..await is not allowed in global scope, must use a wrapper
// async function main() {
//   // send mail with defined transport object
//   const mailOptions = await transporter.sendMail({
//     from: '"vishal" <vishal.mishra@gmail.com>', // sender address
//     to: "vishalmishra12@yopmail.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
//   });

//   console.log("Message sent: %s", mailOptions.messageId);
//   // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
// }

// main().catch(console.error);