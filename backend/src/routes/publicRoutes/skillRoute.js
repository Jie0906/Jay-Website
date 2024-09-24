const router = require('express').Router()
const SkillController = require('../../controllers/skillController')
const cacheMiddleware = require('../../middlewares/cacheMiddleware')

router.get('/', cacheMiddleware(300), SkillController.getAllSkills)


module.exports = router