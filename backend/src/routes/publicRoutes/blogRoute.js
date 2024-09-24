const router = require('express').Router()
const BlogController = require('../../controllers/blogController')
const cacheMiddleware = require('../../middlewares/cacheMiddleware')

router.get('/', cacheMiddleware(300), BlogController.getAllBlogs)
router.get('/:id', cacheMiddleware(300), BlogController.getBlogById)

module.exports = router