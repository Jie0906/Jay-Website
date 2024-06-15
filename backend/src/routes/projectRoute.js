const router = require('express').Router()
const ProjectController = require('../controllers/projectController')

router.post('/', ProjectController.createProject)
router.get('/', ProjectController.getAllProjects)
router.get('/:id', ProjectController.getProjectById)
router.put('/:id', ProjectController.updateProject)
router.delete('/:id', ProjectController.deleteProject)
router.post('/:id/restore', ProjectController.restoreProject)

module.exports = router