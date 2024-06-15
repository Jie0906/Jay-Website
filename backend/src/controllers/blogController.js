const mongoose = require('mongoose');
const Blog = require('../models/blogModel')

class BlogController {
    createBlog = async (req, res, next) => {
        try{
            const { title, content, date } = req.body
            if (!title || !content || !date ){
                const error = new Error('Field cannot be empty.')
                error.status = 400
                throw error
            }
            let infor = {
                title: title,
                content : content, 
                date : date
            }
            await Blog.create(infor)
            return res.status(201).json({
                message: 'Created new post successfully!'
              });
        }
        catch (error) {
            next(error)
        }
    }
    getAllBlogs = async (req, res, next) => {
        try {
          const posts = await Blog.find({ deleted: false });
          res.status(200).json(posts);
        } catch (error) {
          next(error);
        }
      };
    
    getBlogById = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            const error = new Error('Invalid ID');
            error.status = 400;
            throw error;
            }
        const post = await Blog.findOne({ _id: req.params.id, deleted: false });
        if (!post) {
            const error = new Error('Post not found');
            error.status = 404;
            throw error;
    }
        return res.status(200).json(post);
        } catch (error) {
        next(error);
        }
    };

    updateBlog = async (req, res, next) => {
    try {
        const { title, content, date } = req.body;
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        const error = new Error('Invalid ID');
        error.status = 400;
        throw error;
        }
        let infor = {
            title: title,
            content : content, 
            date : date
        }  
        const post = await Blog.findByIdAndUpdate(req.params.id, infor);
        if (!post) {
        const error = new Error('Post not found');
        error.status = 404;
        throw error;
        }
        return res.status(200).json(post);
    } catch (error) {
        next(error);
    }
    };

    deleteBlog = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        const error = new Error('Invalid ID');
        error.status = 400;
        throw error;
        }
        const post = await Blog.delete({ _id: req.params.id });
        if (!post) {
        const error = new Error('Post not found');
        error.status = 404;
        throw error;
        }
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
    };

    restoreBlog = async (req, res, next) => {
        try {
          if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            const error = new Error('Invalid ID');
            error.status = 400;
            throw error;
          }
          const post = await Blog.restore({ _id: req.params.id });
          if (!post) {
            const error = new Error('Post not found');
            error.status = 404;
            throw error;
          }
          return res.status(200).json({ message: 'Post restored', post });
        } catch (error) {
          next(error);
        }
      };

}

module.exports = new BlogController();