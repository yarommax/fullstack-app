//пакет для загрузки файлов
const multer = require('multer');
//Работа с различными форматами данных
const moment = require('moment');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        const date = moment().format('DDMMYYYY-HHmmss_SSS');
        cb(null, `${date}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const limits = {
    fileSize: 1024 * 1024 * 5
}

//создание базовой конфигурации для загрузки файлов
module.exports = multer({
    storage, fileFilter, limits
});