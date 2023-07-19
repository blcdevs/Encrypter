const models = require('../models/index');
const { Op } = require("sequelize");

// CREATE, READ, DESTROY
exports.credQuery = async (model, queryType, data) => {
    const credQuery = await models[model][queryType](data);
    return credQuery;
}

// UPDATE
exports.updateQuery = async (model, queryType, data, whereClause) => {
    const updateQuery = await models[model][queryType](
        data,
        whereClause
    );
    return updateQuery;
}