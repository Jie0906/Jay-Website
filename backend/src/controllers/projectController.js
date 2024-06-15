const mongoose = require('mongoose');
const Project = require('../models/projectModel')

class ProjectController {
    createProject = async (req, res, next) => {
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
            await Project.create(infor)
            return res.status(201).json({
                message: 'Created new project successfully!'
              });
        }
        catch (error) {
            next(error)
        }
    }
    getAllProjects = async (req, res, next) => {
        try {
          const projects = await Project.find({ deleted: false });
          res.status(200).json(projects);
        } catch (error) {
          next(error);
        }
      };
    
    getProjectById = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            const error = new Error('Invalid ID');
            error.status = 400;
            throw error;
            }
        const project = await Project.findOne({ _id: req.params.id, deleted: false });
        if (!project) {
            const error = new Error('Project not found');
            error.status = 404;
            throw error;
    }
        return res.status(200).json(project);
        } catch (error) {
        next(error);
        }
    };

    updateProject = async (req, res, next) => {
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
        const project = await Project.findByIdAndUpdate(req.params.id, infor);
        if (!project) {
        const error = new Error('Project not found');
        error.status = 404;
        throw error;
        }
        return res.status(200).json({
            message : "Updated project seccessfully!"
        });
    } catch (error) {
        next(error);
    }
    };

    deleteProject = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        const error = new Error('Invalid ID');
        error.status = 400;
        throw error;
        }
        const project = await Project.delete({ _id: req.params.id });
        if (!project) {
        const error = new Error('Project not found');
        error.status = 404;
        throw error;
        }
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
    };

    restoreProject = async (req, res, next) => {
        try {
          if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            const error = new Error('Invalid ID');
            error.status = 400;
            throw error;
          }
          const project = await Project.restore({ _id: req.params.id });
          if (!project) {
            const error = new Error('Project not found');
            error.status = 404;
            throw error;
          }
          return res.status(200).json({ message: 'Project restored', project });
        } catch (error) {
          next(error);
        }
      };

}

module.exports = new ProjectController();