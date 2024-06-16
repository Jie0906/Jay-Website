const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

class FileUploader {
    constructor() {
        this.storage = multer.diskStorage({
            destination: this.destination.bind(this),
            filename: this.filename.bind(this)
        });
        this.upload = multer({ 
            storage: this.storage,
            fileFilter: this.fileFilter.bind(this) 
        }).single('image');
        this.uploadFile = this.uploadFile.bind(this);
        this.deleteFile = this.deleteFile.bind(this); // 綁定上下文
    }

    async destination(req, file, cb) {
        try {
            const routeParts = req.baseUrl.split('/');
            const routeType = String(routeParts[2]);
            const uploadType = this.getUploadType(file.mimetype || file.originalname);
            if (!uploadType) {
                return cb(new Error('Invalid upload type'));
            }
            const uploadPath = path.resolve(__dirname, '../../../../Jay_website_uploaded_file', routeType, uploadType);
            console.log(uploadPath);
            await fs.mkdir(uploadPath, { recursive: true });
            cb(null, uploadPath);
        } catch (error) {
            cb(error);
        }
    }

    getUploadType(mimeOrFilename) {
        const mimeToTypeMap = {
            'image/jpeg': 'jpeg',
            'image/jpg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif'
        };

        // 如果是 MIME 類型
        if (mimeToTypeMap[mimeOrFilename]) {
            return mimeToTypeMap[mimeOrFilename];
        }

        // 如果是文件擴展名
        const extname = path.extname(mimeOrFilename).toLowerCase();
        if (extname) {
            return extname.substring(1); // 去掉擴展名前的點
        }

        return null;
    }

    filename(req, file, cb) {
        try {
            cb(null, `${Date.now()}${path.extname(file.originalname)}`);
        } catch (error) {
            cb(error);
        }
    }

    fileFilter(req, file, cb) {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Error: Only images (jpeg, jpg, png, gif) are allowed'));
        }
    }

    uploadFile(req, res, next) {
        this.upload(req, res, (err) => {
            if (err) {
                return next(err);
            }
            next();
        });
    }

    async deleteFile(filePath) {
        try {
            await fs.unlink(filePath);
            console.log(`Deleted file: ${filePath}`);
        } catch (error) {
            console.error(`Failed to delete file: ${filePath}`, error);
        }
    }
}

module.exports = new FileUploader();
