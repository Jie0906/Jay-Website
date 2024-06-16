const router = require('express').Router()
const ProjectController = require('../controllers/projectController')
const fileUploader = require('../middlewares/fileUploader')

router.post('/', fileUploader.uploadFile, ProjectController.createProject)
router.get('/', ProjectController.getAllProjects)
router.get('/:id', ProjectController.getProjectById)
router.put('/:id', fileUploader.uploadFile, ProjectController.updateProject)
router.delete('/:id', ProjectController.deleteProject)
router.post('/:id/restore', ProjectController.restoreProject)

module.exports = router