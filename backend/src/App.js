const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require("cors")
const session = require('express-session')
const path = require("path") 

require('dotenv').config()
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler')
const adminRoute = require('./routes/adminRoutes/adminRoute')
const blogRoute = require('./routes/publicRoutes/blogRoute')
const projectRoute = require('./routes/publicRoutes/projectRoute')
const skillRoute = require('./routes/publicRoutes/skillRoute')
const aboutMeRoute = require('./routes/publicRoutes/aboutMeRoute')
const fileUploaderRoute = require('./routes/commonRoutes/fileUploaderRoute')

const app = express()

const corsOptions = {
    origin: 'http://localhost:3000', // 更新为前端应用的URL
    credentials: true, // 允许发送cookie
  };
app.use(cors(corsOptions))
app.use('/uploads', express.static((path.join(__dirname, '../../../Jay_website_uploaded_file'))))
app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(express.urlencoded({extended: true}))
//common route
app.use('/api', fileUploaderRoute)
//admin route
app.use('/api/admin', adminRoute)
//public route
app.use('/api/blog', blogRoute)
app.use('/api/project', projectRoute)
app.use('/api/skill', skillRoute)
app.use('/api/aboutMe', aboutMeRoute)



app.use(notFoundHandler)
app.use(errorHandler)

module.exports = app



