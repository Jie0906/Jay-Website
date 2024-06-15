const router = require('express').Router()
const BlogController = require('../controllers/blogController')

router.post('/', BlogController.createBlog)
router.get('/', BlogController.getAllBlogs)
router.get('/:id', BlogController.getBlogById)
router.put('/:id', BlogController.updateBlog)
router.delete('/:id', BlogController.deleteBlog)
router.post('/:id/restore', BlogController.restoreBlog)

module.exports = router