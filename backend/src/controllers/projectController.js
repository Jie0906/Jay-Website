const mongoose = require('mongoose');
const Project = require('../models/projectModel')

class ProjectController {
    createProject = async (req, res, next) => {
        try{
            const { title, content, date } = req.body
            if (!title || !content || !date ){
                const error = new Error('Required fields cannot be empty.')
                error.status = 400
                throw error
            }
            let infor = {
                title,
                content,
                date 
            }
            if (req.file) {
              infor.imagePath = req.filePath;
              infor.imageUrl = req.fileUrl; 
          }
            const newProject = await Project.create(infor)
            return res.status(201).json({
                message: 'Created new project successfully!',
                newProject
              });
        }
        catch (error) {
          if (req.file) {
            await fileUploader.deleteFile(req.file.path); // 刪除已上傳的文件
        }
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

    getAllAdminProjects = async (req, res, next) => {
      try {
        // 使用 findWithDeleted 來包括軟刪除的項目
        const projects = await Project.findWithDeleted()
          .select('+createdAt +updatedAt +deletedAt +deleted');
    
        const formattedProjects = projects.map(project => ({
          ...project._doc,
          id: project._id,
          deleted: project.deleted || false, // 使用 'deleted' 而不是 'isDeleted'
          createdAt: project.createdAt ? project.createdAt.toISOString() : null,
          updatedAt: project.updatedAt ? project.updatedAt.toISOString() : null,
          deletedAt: project.deletedAt ? project.deletedAt.toISOString() : null
        }));
    
        res.status(200).json(formattedProjects);
      } catch (error) {
        next(error);
      }
    };

    getAdminProjectById = async (req, res, next) => {
      try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
          const error = new Error('Invalid ID');
          error.status = 400;
          throw error;
        }
    
        // 使用 findOneWithDeleted 來查找包括已刪除的項目
        const project = await Project.findOneWithDeleted({ _id: id });
    
        if (!project) {
          const error = new Error('Project not found');
          error.status = 404;
          throw error;
        }
        const formattedProject = {
          title: project.title,
          content: project.content,
          date: project.date,
          imagePath: project.imagePath,
          imageUrl: project.imageUrl,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          deleted: project.deleted,
          deletedAt: project.deletedAt
        };
        return res.status(200).json(formattedProject);
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
        if (req.file) {
          infor.image = req.file.path; 
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
      if (req.file) {
        await fileUploader.deleteFile(req.file.path); // 刪除已上傳的文件
    }
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