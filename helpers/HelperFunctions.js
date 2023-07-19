require('dotenv').config();

const helperQuery = require('./HelperQuery');
const { Op } = require("sequelize");

const today = new Date();
const extendDate = new Date(today);
extendDate.setDate(today.getDate() + 365);

// RANDOM STRING GENERATION
exports.randomString = async (length, type) => {
    let result = '';
    const characters = type.toLowerCase() == "string" ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' : '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// FORMATTED DATETIME (START DATE)
exports.formattedDateTime = async () => {
    const date = today.getFullYear() + "-" + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date;
}
// DUE DATE
exports.dueDate = async () => {
    const dueDate = extendDate.getFullYear() + "-" + (extendDate.getMonth() + 1) + "-" + extendDate.getDate() + " " + extendDate.getHours() + ":" + extendDate.getMinutes() + ":" + extendDate.getSeconds();
    return dueDate;
}
// EXTENDED DATE
exports.extendDate = async () => {
    return extendDate;
}

// ADD LOGIN AUDIT
exports.addLoginAudit = async (credentials) => {
    return await helperQuery.credQuery("AdminLogAudit", "create", credentials);
}

// ADD ADMIN PAGE LOGIN
exports.addPageAudit = async (credentials) => {
    return await helperQuery.credQuery("AdminPageAudit", "create", credentials);
}

// ADD ATTEMPTED LOGIN DEVICE
exports.addAttemptedDevice = async (credentials) => {
    return await helperQuery.credQuery("AttemptedDevice", "create", credentials);
}

// ADD ATTEMPTED USER
exports.addAttemptedUser = async (credentials) => {
    return await helperQuery.credQuery("AttemptedUser", "create", credentials);
}
