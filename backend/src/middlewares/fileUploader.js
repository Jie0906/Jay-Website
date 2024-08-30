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
        return extname ? extname.substring(1) : null;
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
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }

    // 文件過濾邏輯
    fileFilter(req, file, cb) {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            cb(null, true);
        } else {
            cb(new Error('Error: Only images (jpeg, jpg, png, gif) are allowed'));
        }
    }

    // 文件上傳邏輯
    async uploadFile(req, res, next) {
        try {
            await new Promise((resolve, reject) => {
                this.upload(req, res, (err) => {
                    if (err instanceof multer.MulterError) {
                        reject({ status: 400, message: `文件上傳錯誤: ${err.message}` });
                    } else if (err) {
                        reject({ status: 500, message: `文件上傳過程中發生錯誤: ${err.message}` });
                    } else {
                        resolve();
                    }
                });
            });

            if (req.file) {
                await this.setFileUrls(req);
            }
            next();
        } catch (error) {
            next(error);
        }
    }

    async setFileUrls(req) {
        if (req.file) {
            const filePath = path.relative(path.join(__dirname, '../../../../Jay_website_uploaded_file'), req.file.path);
            const cleanPath = filePath.replace(/\\/g, '/').replace(/\.\.\//g, '');
            const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${cleanPath}`;
            req.filePath = req.uploadPath;
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
            throw error; // 重新拋出錯誤，以便調用者可以處理
        }
    }
}

module.exports = new FileUploader();