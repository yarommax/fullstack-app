//подключение модели
const Category = require('../models/Category');
const Position = require('../models/Position');
const errorHandler = require('../utils/errorHandler');


//localhost:5000/api/category/
module.exports.getAll = async function(req, res) {
    try {
        //поиск только тех категорий , которые создал юзер
        const categories = await Category.find({user: req.user.id});
            res.status(200).json(categories);
    } catch(e) {
        errorHandler(res, e);
    }
}

module.exports.getById = async function(req, res) {
    try {
        const category = await Category.findById(req.params.id);
        res.status(200).json(category);
    } catch(e) {
        errorHandler(res, e);
    }
}

module.exports.remove = async function(req, res) {
    try {
        //при удалении категории нужно также удалить и позиции имеющиеся для этой категории
        await Category.remove({_id: req.params.id});
        //в параметрах запроса лежит айди категории. мы ищем необходимые позиции
        //у которых поле категории равняется полю айди категории (req.params.id)
        await Position.remove({category: req.params.id});
        res.status(200).json({
            message: 'Category removed'
        });
    } catch(e) {
        errorHandler(res, e);
    }
}

module.exports.create = async function(req, res) {
    const category = new Category({
        name: req.body.name,
        user: req.user.id,
        imageSrc: req.file ? req.file.path : ''
    });

    try {
        await category.save();
        res.status(201).json(category);
    } catch(e) {
        errorHandler(res, e);
    }
}

module.exports.update = async function(req, res) {
    const updated = {
        name: req.body.name
    };

    if(req.file) {
        updated.imageSrc = req.file.path;
    }

    try {
        const category = await Category.findOneAndUpdate(
            {_id: req.params.id},
            {$set: updated},
            {new: true}
            )
        res.status(200).json(category);
    } catch(e) {
        errorHandler(res, e);
    }
}