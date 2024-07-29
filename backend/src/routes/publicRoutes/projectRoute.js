const router = require('express').Router()
const ProjectController = require('../../controllers/projectController')

router.get('/', ProjectController.getAllProjects)
router.get('/:id', ProjectController.getProjectById)


module.exports = router