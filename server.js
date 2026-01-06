
require('dotenv').config();
const express = require('express')
const app = express()
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')
const path = require('path')
const connectDB = require('./db/connectDB')
const expresslayouts = require('express-ejs-layouts')
const session = require('express-session')
const nocache = require('nocache')

app.use(nocache())

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}))


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(expresslayouts)
app.set('layout', 'layout')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/user', userRoutes)
app.use('/admin', adminRoutes)

const PORT = process.env.PORT

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log("____________Server started____________");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
