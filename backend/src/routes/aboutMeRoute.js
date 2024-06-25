const router = require('express').Router()
const AboutMeController = require('../controllers/aboutMeController')
const fileUploader = require('../middlewares/fileUploader')

router.post('/', fileUploader.uploadFile, AboutMeController.createAboutMe)
router.get('/', AboutMeController.getAllAboutMe)
router.get('/:id', AboutMeController.getAboutMeById)
router.put('/:id', fileUploader.uploadFile, AboutMeController.updateAboutMe)
router.delete('/:id', AboutMeController.deleteAboutMe)
router.post('/:id/restore', AboutMeController.restoreAboutMe)

module.exports = router