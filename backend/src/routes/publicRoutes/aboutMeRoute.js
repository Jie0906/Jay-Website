const router = require('express').Router()
const AboutMeController = require('../../controllers/aboutMeController')

router.get('/', AboutMeController.getAllAboutMe)

module.exports = router