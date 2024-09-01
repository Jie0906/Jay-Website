const mongoose = require('mongoose');
const Skill = require('../models/skillModel')

class SkillController {
  createSkill = async (req, res, next) => {
    try {
        const { type, title, subtitle, content } = req.body
        if (!type || !title || !content) { // 移除 subtitle 的必填檢查
            const error = new Error('Title and content cannot be empty.')
            error.status = 400
            throw error
        }
        let infor = {
          type: type,
            title: title,
            subtitle: subtitle,
            content: content
        }
        if (req.file) {
            infor.imagePath = req.filePath;
            infor.imageUrl = req.fileUrl;
        }
        const newSkill = await Skill.create(infor)
        return res.status(201).json({
            message: 'Created new skill successfully!',
            newSkill
        });
    }
    catch (error) {
        if (req.file) {
            await fileUploader.deleteFile(req.file.path);
        }
        next(error)
    }
}
    getAllSkills = async (req, res, next) => {
        try {
          const skills = await Skill.find({ deleted: false });
          res.status(200).json(skills);
        } catch (error) {
          next(error);
        }
      };


    getAllAdminSkills = async (req, res, next) => {
  try {
    const skills = await Skill.findWithDeleted()
      .select('+createdAt +updatedAt +deletedAt +deleted');
    const formattedSkills = skills.map(skill => ({
      ...skill._doc,
      isDeleted: skill.deleted || false,
      createdAt: skill.createdAt ? skill.createdAt.toISOString() : null,
      updatedAt: skill.updatedAt ? skill.updatedAt.toISOString() : null,
      deletedAt: skill.deletedAt ? skill.deletedAt.toISOString() : null
    }));
    res.status(200).json(formattedSkills);
  } catch (error) {
    next(error);
  }
};

    updateSkill = async (req, res, next) => {
    try {
        const {type, title, subtitle, content } = req.body;
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        const error = new Error('Invalid ID');
        error.status = 400;
        throw error;
        }
        let infor = {
          type: type,
          title: title,
          subtitle : subtitle, 
          content : content
        } 
        if (req.file) {
          infor.imagePath = req.filePath;
          infor.imageUrl = req.fileUrl;
        }
        const skill = await Skill.findByIdAndUpdate(req.params.id, infor);
        if (!skill) {
        const error = new Error('Skill not found');
        error.status = 404;
        throw error;
        }
        return res.status(200).json({
          message : "Updated skill seccessfully!"
        });
    } catch (error) {
        if (req.file) {
          await fileUploader.deleteFile(req.file.path); // 刪除已上傳的文件
      }
        next(error);
    }
    };

    deleteSkill = async (req, res, next) => {
      try {
          if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
              const error = new Error('Invalid ID');
              error.status = 400;
              throw error;
          }
          const skill = await Skill.delete({ _id: req.params.id });
          if (!skill) {
              const error = new Error('Skill not found');
              error.status = 404;
              throw error;
          }
          return res.status(200).json({ message: 'Skill deleted successfully' }); // 修改狀態碼為 200 並返回消息
      } catch (error) {
          next(error);
      }
  };

    restoreSkill = async (req, res, next) => {
        try {
          if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            const error = new Error('Invalid ID');
            error.status = 400;
            throw error;
          }
          const skill = await Skill.restore({ _id: req.params.id });
          if (!skill) {
            const error = new Error('Skill not found');
            error.status = 404;
            throw error;
          }
          return res.status(200).json({ message: 'Skill restored', skill });
        } catch (error) {
          next(error);
        }
      };

}

module.exports = new SkillController();