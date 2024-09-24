const router = require('express').Router()
const AboutMeController = require('../../controllers/aboutMeController')
const cacheMiddleware = require('../../middlewares/cacheMiddleware')

router.get('/', cacheMiddleware(300), AboutMeController.getAllAboutMe)

module.exports = router