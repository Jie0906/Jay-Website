const mongoose = require('mongoose');
const AboutMe = require('../models/aboutMeModel')

class AboutMeController {
    createAboutMe = async (req, res, next) => {
        try{
            const { type, title, subtitle, content, date } = req.body
            if ( !type || !title || !content ){
                const error = new Error('Field cannot be empty.')
                error.status = 400
                throw error
            }
            let infor = {
                type: type,
                title: title,
                subtitle: subtitle,
                content : content, 
                date: date
            }
            if (req.file) {
              infor.imagePath = req.filePath;
              infor.imageUrl = req.fileUrl;
          }
          const newAboutMe = await AboutMe.create(infor);

          return res.status(201).json({
              message: 'Created new content successfully!',
              newAboutMe
              
          });
        }
        catch (error) {
          if (req.file) {
            await fileUploader.deleteFile(req.file.path); 
        }
            next(error)
        }
    }
    getAllAboutMe = async (req, res, next) => {
      try {
          const aboutMeContent = await AboutMe.find({ deleted: false });
          res.status(200).json(aboutMeContent);
      } catch (error) {
          next(error);
      }
  };
    
    getAboutMeById = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            const error = new Error('Invalid ID');
            error.status = 400;
            throw error;
            }
        const aboutMeContent = await AboutMe.findOne({ _id: req.params.id, deleted: false });
        if (!aboutMeContent) {
            const error = new Error('Content not found');
            error.status = 404;
            throw error;
    }
        return res.status(200).json(project);
        } catch (error) {
        next(error);
        }
    };

    updateAboutMe = async (req, res, next) => {
    try {
        const { type, title, subtitle, content, date } = req.body
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        const error = new Error('Invalid ID');
        error.status = 400;
        throw error;
        }
        let infor = {
            type: type,
            title: title,
            subtitle: subtitle,
            content : content, 
            date: date
        } 
        if (req.file) {
          infor.imagePath = req.filePath;
          infor.imageUrl = req.fileUrl;
        }
        const aboutMeContent = await AboutMe.findByIdAndUpdate(req.params.id, infor);
        if (!aboutMeContent) {
        const error = new Error('Content not found');
        error.status = 404;
        throw error;
        }
        return res.status(200).json({
            message : "Updated content seccessfully!"
        });
    } catch (error) {
      if (req.file) {
        await fileUploader.deleteFile(req.file.path);
    }
        next(error);
    }
    };

    deleteAboutMe = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        const error = new Error('Invalid ID');
        error.status = 400;
        throw error;
        }
        const aboutMeContent = await AboutMe.delete({ _id: req.params.id });
        if (!aboutMeContent) {
        const error = new Error('Content not found');
        error.status = 404;
        throw error;
        }
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
    };

    restoreAboutMe = async (req, res, next) => {
        try {
          if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            const error = new Error('Invalid ID');
            error.status = 400;
            throw error;
          }
          const aboutMeContent = await AboutMe.restore({ _id: req.params.id });
          if (!aboutMeContent) {
            const error = new Error('Content not found');
            error.status = 404;
            throw error;
          }
          return res.status(200).json({ message: 'Content restored', aboutMeContent });
        } catch (error) {
          next(error);
        }
      };

}

module.exports = new AboutMeController();