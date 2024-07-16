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
        this.deleteFile = this.deleteFile.bind(this);
    }

    // 文件存儲邏輯
    async destination(req, file, cb) {
        try {
            const uploadPath = this.getUploadPath(req, file);
            console.log(uploadPath);
            await fs.mkdir(uploadPath, { recursive: true });
            req.uploadPath = uploadPath; // 將 uploadPath 存儲到 req 對象中
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

        if (mimeToTypeMap[mimeOrFilename]) {
            return mimeToTypeMap[mimeOrFilename];
        }

        const extname = path.extname(mimeOrFilename).toLowerCase();
        if (extname) {
            return extname.substring(1); // 去掉擴展名前的點
        }

        return null;
    }

    getUploadPath(req, file) {
        const routeParts = req.baseUrl.split('/');
        const routeType = String(routeParts[2]);
        const uploadType = this.getUploadType(file.mimetype || file.originalname);
        if (!uploadType) {
            throw new Error('Invalid upload type');
        }
        return path.resolve(__dirname, '../../../../Jay_website_uploaded_file', routeType, uploadType);
    }

    filename(req, file, cb) {
        try {
            cb(null, `${Date.now()}${path.extname(file.originalname)}`);
        } catch (error) {
            cb(error);
        }
    }

    // 文件過濾邏輯
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

    // 文件上傳邏輯
    uploadFile(req, res, next) {
        this.upload(req, res, (err) => {
            if (err) {
                return next(err);
            }
            this.setFileUrls(req);
            if (req.file) {
                return next();
            } else {
                next(new Error('No file uploaded'));
            }
        });
    }

    setFileUrls(req) {
        if (req.file) {
            const filePath = path.relative(path.join(__dirname, '../../../../Jay_website_uploaded_file'), req.file.path);
            const cleanPath = filePath.replace(/\\/g, '/').replace(/\.\.\//g, ''); // 移除相對路徑部分
            const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${cleanPath}`;
            req.filePath = req.uploadPath; // 使用 destination 方法中設置的 uploadPath
            req.fileUrl = fileUrl;
        }
    }

    // 文件刪除邏輯
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
