const router = require('express').Router()
const SkillController = require('../../controllers/skillController')

router.get('/', SkillController.getAllSkills)


module.exports = router