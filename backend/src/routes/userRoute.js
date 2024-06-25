const router = require('express').Router()
const UserController = require('../controllers/userController')

router.post('/signUp', UserController.createUser)
router.post('/login', UserController.login)
router.post('/logout', UserController.logout)


module.exports = router