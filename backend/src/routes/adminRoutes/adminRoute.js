const router = require('express').Router()
const UserController = require('../../controllers/userController')
const AboutMeController = require('../../controllers/aboutMeController')
const BlogController = require('../../controllers/blogController')
const SkillController = require('../../controllers/skillController')
const ProjectController = require('../../controllers/projectController')
const fileUploader = require('../../middlewares/fileUploader')
const TokenController = require('../../middlewares/jwtHandler')

router.post('/signUp', UserController.createUser)
router.post('/login', UserController.login)
router.post('/logout', UserController.logout)

router.post('/aboutMe/', TokenController.verifyJWT, fileUploader.uploadFile, AboutMeController.createAboutMe)
router.get('/aboutMe/', TokenController.verifyJWT, AboutMeController.getAllAdminAboutMe)
router.get('/aboutMe/:id', TokenController.verifyJWT, AboutMeController.getAboutMeById)
router.put('/aboutMe/:id', TokenController.verifyJWT, fileUploader.uploadFile, AboutMeController.updateAboutMe)
router.delete('/aboutMe/:id', TokenController.verifyJWT, AboutMeController.deleteAboutMe)
router.post('/aboutMe/:id/restore', TokenController.verifyJWT, AboutMeController.restoreAboutMe)

router.post('/blog/', TokenController.verifyJWT, BlogController.createBlog)
router.get('/blog/', TokenController.verifyJWT, BlogController.getAllAdminBlogs)
router.get('/blog/:id', TokenController.verifyJWT, BlogController.getAdminBlogById)
router.put('/blog/:id', TokenController.verifyJWT, BlogController.updateBlog)
router.delete('/blog/:id', TokenController.verifyJWT, BlogController.deleteBlog)
router.post('/blog/:id/restore', TokenController.verifyJWT, BlogController.restoreBlog)

router.post('/skill/', TokenController.verifyJWT, fileUploader.uploadFile, SkillController.createSkill)
router.get('/skill/', TokenController.verifyJWT, SkillController.getAllAdminSkills)
router.put('/skill/:id', TokenController.verifyJWT, fileUploader.uploadFile, SkillController.updateSkill)
router.delete('/skill/:id', TokenController.verifyJWT, SkillController.deleteSkill)
router.post('/skill/:id/restore', TokenController.verifyJWT, SkillController.restoreSkill)

router.post('/project/',TokenController.verifyJWT, fileUploader.uploadFile, ProjectController.createProject)
router.get('/project/',TokenController.verifyJWT, ProjectController.getAllAdminProjects)
router.get('/project/:id',TokenController.verifyJWT, ProjectController.getAdminProjectById)
router.put('/project/:id',TokenController.verifyJWT, fileUploader.uploadFile, ProjectController.updateProject)
router.delete('/project/:id',TokenController.verifyJWT, ProjectController.deleteProject)
router.post('/project/:id/restore',TokenController.verifyJWT, ProjectController.restoreProject)


module.exports = router