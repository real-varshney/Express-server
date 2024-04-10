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
  const url = process.env.FRONTENDDOMAIN
  const verificationLink = `${url}/verify?username=${username}&token=${token}`;
 
  const { data, error } = await sender.emails.send({
     from: 'onboarding@resend.dev',
     to: userEmail, 
     subject: 'Verify the Email',
     html: '<h1>Verify your email</h1><p>Click the link below to verify your email</p><a href="' + verificationLink + '">Verify Email</a>',
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