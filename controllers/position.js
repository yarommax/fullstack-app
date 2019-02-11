const Position = require('../models/Position');
const errorHandler =  require('../utils/errorHandler');


//localhost:5000/api/position/:categoryId
module.exports.getByCategoryId = async function(req, res) {
    try {
        const positions = await Position.find({
            category: req.params.categoryId,
            user: req.user.id
        });

        res.status(200).json(positions);

    } catch(e) {
        errorHandler(res, e);
    }
}

module.exports.create = async function(req, res) {
    try {
        //Асинхронное создание новой позиции и сохранение в бд. 
        const position = await new Position({
            name: req.body.name,
            cost: req.body.cost,
            category: req.body.category,
            user: req.user.id
        }).save();

        res.status(201).json(position);

    } catch(e) {
        errorHandler(res, e);
    }
}

module.exports.remove = async function(req, res) {
    try {
        //ждем пока удалиться позиция из БД. Ищем позицию по id 
        await Position.remove({_id: req.params.id});

        res.status('200').json({
            message: 'Position removed'
        });

    } catch(e) {
        errorHandler(res, e);
    }
}

module.exports.update = async function(req, res) {
    try {
        //обновление позиции. поиск необходимой поз по id , 
        const position = await Position.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            {new: true}
        );

        res.status(200).json(position);
    } catch(e) {
        errorHandler(res, e);
    }
}