const router = require('express').Router()
const SkillController = require('../controllers/skillController')
const fileUploader = require('../middlewares/fileUploader');

router.post('/', fileUploader.uploadFile, SkillController.createSkill)
router.get('/', SkillController.getAllSkills)
router.put('/:id', fileUploader.uploadFile, SkillController.updateSkill)
router.delete('/:id', SkillController.deleteSkill)
router.post('/:id/restore', SkillController.restoreSkill)

module.exports = router