const mongoose = require('mongoose');
const Blog = require('../models/blogModel')

class BlogController {
    createBlog = async (req, res, next) => {
        try{
            const { title, content, category, date } = req.body
            if (!title || !content || !category ){
                const error = new Error('Field cannot be empty.')
                error.status = 400
                throw error
            }
            let infor = {
                title: title,
                content : content, 
                category: category,
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
    // 獲取所有博客（帶分頁和搜索）
    getAllBlogs = async (req, res, next) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
    
        const query = { deleted: false };
        if (search) {
          query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } }
          ];
        }
    
        const totalPosts = await Blog.countDocuments(query);
        
        if (totalPosts === 0) {
          return res.status(200).json({
            posts: [],
            totalPages: 0,
            currentPage: page
          });
        }
        
        const posts = await Blog.find(query)
          .sort({ date: -1 })
          .limit(limit)
          .skip((page - 1) * limit)
          .exec();
        
        res.status(200).json({
          posts,
          totalPages: Math.ceil(totalPosts / limit),
          currentPage: page
        });
      } catch (error) {
        next(error);
      }
    };

    // 獲取單個博客
    getBlogById = async (req, res, next) => {
      try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
          const error = new Error('Invalid ID');
          error.status = 400;
          throw error;
        }
        
        const post = await Blog.findOne({ _id: id, deleted: false });
        
        if (!post) {
          const error = new Error('Post not found');
          error.status = 404;
          throw error;
        }
        
        res.status(200).json(post);
      } catch (error) {
        next(error);
      }
    };

    // 获取所有博客（带分页和搜索）
    getAllAdminBlogs = async (req, res, next) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const query = {};
        if (search) {
          query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } }
          ];
        }

        const totalPosts = await Blog.countDocuments(query);

        if (totalPosts === 0) {
          return res.status(200).json({
            posts: [],
            totalPages: 0,
            currentPage: page
          });
        }

        const posts = await Blog.find(query)
          .sort({ date: -1 })
          .limit(limit)
          .skip((page - 1) * limit)
          .select('+createdAt +updatedAt +deletedAt +deleted')
          .exec();

        const formattedPosts = posts.map(post => ({
          ...post._doc,
          isDeleted: post.deleted || false,
          createdAt: post.createdAt ? post.createdAt.toISOString() : null,
          updatedAt: post.updatedAt ? post.updatedAt.toISOString() : null,
          deletedAt: post.deletedAt ? post.deletedAt.toISOString() : null
        }));

        res.status(200).json({
          posts: formattedPosts,
          totalPages: Math.ceil(totalPosts / limit),
          currentPage: page
        });
      } catch (error) {
        next(error);
      }
    };

    // 获取单个博客
    getAdminBlogById = async (req, res, next) => {
      try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
          const error = new Error('Invalid ID');
          error.status = 400;
          throw error;
        }
        const post = await Blog.findOneWithDeleted({ _id: id });
        
        if (!post) {
          const error = new Error('Post not found');
          error.status = 404;
          throw error;
        }
        
        const formattedPost = {
          id: post._id,
          title: post.title,
          category: post.category,
          content: post.content,
          date: post.date,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          deleted: post.deleted,
          deletedAt: post.deletedAt
        };
        
        res.status(200).json(formattedPost);
      } catch (error) {
        next(error);
      }
    };

    updateBlog = async (req, res, next) => {
    try {
        const { title, content, category, date } = req.body;
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        const error = new Error('Invalid ID');
        error.status = 400;
        throw error;
        }
        let infor = {
            title: title,
            content : content, 
            category: category,
            date : date || Date.now()
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