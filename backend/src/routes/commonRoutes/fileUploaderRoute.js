const express = require('express');
const router = express.Router();
const fileUploader = require('../../middlewares/fileUploader')

router.post('/upload', fileUploader.uploadFile, (req, res) => {
    res.status(200).json({
        message: 'File uploaded successfully',
        file: req.file
    });
});

module.exports = router;
