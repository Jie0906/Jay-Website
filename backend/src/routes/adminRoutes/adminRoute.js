const router = require('express').Router()
const UserController = require('../../controllers/userController')
const AboutMeController = require('../../controllers/aboutMeController')
const BlogController = require('../../controllers/blogController')
const SkillController = require('../../controllers/skillController')
const ProjectController = require('../../controllers/projectController')
const fileUploader = require('../../middlewares/fileUploader')

router.post('/signUp', UserController.createUser)
router.post('/login', UserController.login)
router.post('/logout', UserController.logout)

router.post('/', fileUploader.uploadFile, AboutMeController.createAboutMe)
router.get('/', AboutMeController.getAllAboutMe)
router.get('/:id', AboutMeController.getAboutMeById)
router.put('/:id', fileUploader.uploadFile, AboutMeController.updateAboutMe)
router.delete('/:id', AboutMeController.deleteAboutMe)
router.post('/:id/restore', AboutMeController.restoreAboutMe)

router.post('/', BlogController.createBlog)
router.get('/', BlogController.getAllBlogs)
router.get('/:id', BlogController.getBlogById)
router.put('/:id', BlogController.updateBlog)
router.delete('/:id', BlogController.deleteBlog)
router.post('/:id/restore', BlogController.restoreBlog)

router.post('/', fileUploader.uploadFile, SkillController.createSkill)
router.get('/', SkillController.getAllSkills)
router.put('/:id', fileUploader.uploadFile, SkillController.updateSkill)
router.delete('/:id', SkillController.deleteSkill)
router.post('/:id/restore', SkillController.restoreSkill)

router.post('/', fileUploader.uploadFile, ProjectController.createProject)
router.get('/', ProjectController.getAllProjects)
router.get('/:id', ProjectController.getProjectById)
router.put('/:id', fileUploader.uploadFile, ProjectController.updateProject)
router.delete('/:id', ProjectController.deleteProject)
router.post('/:id/restore', ProjectController.restoreProject)


module.exports = router