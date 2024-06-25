const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require("cors")
const session = require('express-session')
const path = require("path") 

const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler')
const userRoute = require('./routes/userRoute')
const blogRoute = require('./routes/blogRoute')
const projectRoute = require('./routes/projectRoute')
const skillRoute = require('./routes/skillRoute')
const aboutMeRoute = require('./routes/aboutMeRoute')
const fileUploaderRoute = require('./routes/fileUploaderRoute')

const app = express()
app.use(cors())
app.use(express.static(__dirname))
app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))

app.use('/api/user', userRoute)
app.use('/api/blog', blogRoute)
app.use('/api/project', projectRoute)
app.use('/api/skill', skillRoute)
app.use('/api/aboutMe', aboutMeRoute)
app.use('/api/', fileUploaderRoute)


app.use(notFoundHandler)
app.use(errorHandler)

module.exports = app



