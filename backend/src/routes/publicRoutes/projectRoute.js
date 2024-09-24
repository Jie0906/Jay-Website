const router = require('express').Router()
const ProjectController = require('../../controllers/projectController')
const cacheMiddleware = require('../../middlewares/cacheMiddleware')

router.get('/', cacheMiddleware(300), ProjectController.getAllProjects)
router.get('/:id', cacheMiddleware(300), ProjectController.getProjectById)


module.exports = router