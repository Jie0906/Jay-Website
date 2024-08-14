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

router.post('/aboutMe/', fileUploader.uploadFile, AboutMeController.createAboutMe)
router.get('/aboutMe/', AboutMeController.getAllAboutMe)
router.get('/aboutMe/:id', AboutMeController.getAboutMeById)
router.put('/aboutMe/:id', fileUploader.uploadFile, AboutMeController.updateAboutMe)
router.delete('/aboutMe/:id', AboutMeController.deleteAboutMe)
router.post('/aboutMe/:id/restore', AboutMeController.restoreAboutMe)

router.post('/blog/', BlogController.createBlog)
router.get('/blog/', BlogController.getAllBlogs)
router.get('/blog/:id', BlogController.getBlogById)
router.put('/blog/:id', BlogController.updateBlog)
router.delete('/blog/:id', BlogController.deleteBlog)
router.post('/blog/:id/restore', BlogController.restoreBlog)

router.post('/skill/', fileUploader.uploadFile, SkillController.createSkill)
router.get('/skill/', SkillController.getAllSkills)
router.put('/skill/:id', fileUploader.uploadFile, SkillController.updateSkill)
router.delete('/skill/:id', SkillController.deleteSkill)
router.post('/skill/:id/restore', SkillController.restoreSkill)

router.post('/project/', fileUploader.uploadFile, ProjectController.createProject)
router.get('/project/', ProjectController.getAllProjects)
router.get('/project/:id', ProjectController.getProjectById)
router.put('/project/:id', fileUploader.uploadFile, ProjectController.updateProject)
router.delete('/project/:id', ProjectController.deleteProject)
router.post('/project/:id/restore', ProjectController.restoreProject)


module.exports = router