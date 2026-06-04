import express from 'express'
import nodemailer from 'nodemailer'

const router = express.Router()

router.post('/', async (req, res) => {
  const { name, email, message } = req.body

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SUPPORT_EMAIL,
        pass: process.env.SUPPORT_EMAIL_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: email,
      to: process.env.SUPPORT_EMAIL,
      subject: `Support Ticket from ${name}`,
      text: message,
    })

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to send support email' })
  }
})

export default router
