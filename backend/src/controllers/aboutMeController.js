const mongoose = require('mongoose');
const AboutMe = require('../models/aboutMeModel')

class AboutMeController {
    createAboutMe = async (req, res, next) => {
        try {
            const { type, title, subtitle, content, date, startDate, endDate, company } = req.body
            if (!type || !title || !content) {
                const error = new Error('Required fields cannot be empty.')
                error.status = 400
                throw error
            }
            let infor = {
                type,
                title,
                subtitle,
                content,
                date,
                startDate,
                endDate,
                company
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
            const aboutMeContent = await AboutMe.find()
                .sort('order')
                .select('type title subtitle content date startDate endDate company imagePath imageUrl order formattedDate');
    
            const groupedContent = {
                autobiography: [],
                education: [],
                experience: []
            };
    
            aboutMeContent.forEach(item => {
                const itemObj = item.toObject({ virtuals: true });
                groupedContent[item.type].push(itemObj);
            });
    
            res.status(200).json(groupedContent);
        } catch (error) {
            next(error);
        }
    };

    getAllAdminAboutMe = async (req, res, next) => {
        try {
            const aboutMeContent = await AboutMe.findWithDeleted({})
                .sort('order')
                .select('+createdAt +updatedAt +deleted');
    
            const groupedContent = {
                autobiography: [],
                education: [],
                experience: []
            };
    
            aboutMeContent.forEach(item => {
                const itemObj = item.toObject({ virtuals: true });
                itemObj.isDeleted = item.deleted || false;
    
                groupedContent[item.type].push(itemObj);
            });
    
            res.status(200).json({
                content: groupedContent
            });
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
            return res.status(200).json(aboutMeContent);
        } catch (error) {
            next(error);
        }
    };

    updateAboutMe = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                const error = new Error('Invalid ID');
                error.status = 400;
                throw error;
            }

            let updateData = req.body;
            if (req.file) {
                updateData.imagePath = req.filePath;
                updateData.imageUrl = req.fileUrl;
            }

            const aboutMeContent = await AboutMe.findByIdAndUpdate(id, updateData, { new: true });
            if (!aboutMeContent) {
                const error = new Error('Content not found');
                error.status = 404;
                throw error;
            }

            return res.status(200).json({
                message: "Updated content successfully!",
                updatedContent: aboutMeContent
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
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: '無效的 ID' });
            }
            const aboutMeContent = await AboutMe.findById(id);
            if (!aboutMeContent) {
                return res.status(404).json({ message: '找不到要刪除的內容' });
            }
            await aboutMeContent.delete(); // 使用 mongoose-delete 的軟刪除方法
            res.status(200).json({ message: '內容已成功軟刪除', deletedContent: aboutMeContent });
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