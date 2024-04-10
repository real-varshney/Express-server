import { Resend } from 'resend';
import express from 'express';
import cors from 'cors';
import {Token} from './Modules/Token.js';
import {getTokenfromDb} from './Modules/Token.js'


const app = express();
const PORT = 8000;



app.use(express.json());

const sender = new Resend(process.env.RESNEDKEY)
app.use(cors())

app.get("/sendemail", async (req, res) => {
  // Extract the email from the query parameters
  const userEmail = req.query.email;
  const username = req.query.username;
  const token = Token(username);
 
  // Check if the email is provided
  if (!userEmail) {
     return res.status(400).json({ error: "Email is required" });
  }

  const verificationLink = `http://localhost:3000/verify?username=${username}&token=${token}`;
 
  const { data, error } = await sender.emails.send({
   from: 'onboarding@resend.dev',
   to: userEmail, 
   subject: 'Welcome to dribbble! Please Verify Your Email',
   html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #4CAF50;">Welcome to dribbble!</h2>
        <p>Hello ${username},</p>
        <p>Thank you for signing up! We're excited to have you on board. To complete your account setup, please verify your email address by clicking the button below:</p>
        <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px;">Verify Email</a>
        <p>If you didn't sign up for dribbble, you can ignore this email.</p>
        <p>Thank you for choosing dribbble!</p>
        <p>Best Regards,</p>
        <p>Vishal Varshney</p>
        <p>FullStack developer</p>
        <p>vishalvarshney888@gmail.com</p>
      </div>
   `,
  });
 
  if (error) {
     return res.status(400).json({ error });
  }
 
  res.status(200).json({ data });
 });
 
app.get('/verify', async(req, res) => {
   const username = req.query.username;
   const token = req.query.token;
   const requiredtoken = await getTokenfromDb(username);
   if (requiredtoken === token) {
      res.status(200).json({ message: "Email verified successfully" });
   } else {
      res.status(400).json({ message: "Invalid token"});
   }
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
