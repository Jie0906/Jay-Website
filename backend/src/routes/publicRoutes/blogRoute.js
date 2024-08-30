const router = require('express').Router()
const BlogController = require('../../controllers/blogController')

router.get('/', BlogController.getAllBlogs)
router.get('/:id', BlogController.getBlogById)

module.exports = router