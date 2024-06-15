const router = require('express').Router()
const SkillController = require('../controllers/skillController')

router.post('/', SkillController.createSkill)
router.get('/', SkillController.getAllSkills)
router.put('/:id', SkillController.updateSkill)
router.delete('/:id', SkillController.deleteSkill)
router.post('/:id/restore', SkillController.restoreSkill)

module.exports = router