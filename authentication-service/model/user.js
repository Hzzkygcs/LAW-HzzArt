const Joi = require('joi');
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const {generateValidationFunction} = require("../modules/joi-validate/generate-valdiation-function");
const {hashValue} = require("../modules/util/hash");
const {InvalidPasswordException} = require("../modules/exceptions/InvalidPasswordException");
const {UnequalLastPasswordUpdateDate} = require("../modules/exceptions/UnequalLastPasswordUpdateDate");




const userDbSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 40,
        unique: true
    },
    password: {  // hashed
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
    },
    lastPasswordUpdateDate: {  // hashed
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
    }
});

module.exports.UserMethods = {

    setPassword: async function (value) {
        value = await hashValue(value);
        this.password = value;
        await this.setLastPasswordUpdateDateToNow();
    },
    setLastPasswordUpdateDateToNow: async function (){
        const currentDate = new Date().toISOString();
        this.lastPasswordUpdateDate = await hashValue(currentDate);
    },
    validateLastPasswordUpdateDate: async function (lastPasswordUpdateDateStr){
        const lastPassUpdateDatesAreEqual = await bcrypt.compare(lastPasswordUpdateDateStr, this.password);
        if (!lastPassUpdateDatesAreEqual)
            throw new UnequalLastPasswordUpdateDate();
    }
}

userDbSchema.methods.setPassword = module.exports.UserMethods.setPassword;
userDbSchema.methods.setLastPasswordUpdateDateToNow = module.exports.UserMethods.setLastPasswordUpdateDateToNow;
userDbSchema.methods.validatePasswordAsync = async function (otherPassword){
    const passwordIsValid = await bcrypt.compare(otherPassword, this.password);
    if (!passwordIsValid)
        throw new InvalidPasswordException();
};
userDbSchema.methods.validateLastPasswordUpdateDate = module.exports.UserMethods.validateLastPasswordUpdateDate;
userDbSchema.methods.getObjectRepresentation = function (){
    const ret = this.toObject();
    delete ret['password'];
    delete ret['_id'];
    delete ret['__v'];
    return ret;
};


module.exports.User = mongoose.model('User', userDbSchema);

const passwordRequirements = Joi.string().required();
const userJoiSchema = {
    username: {
        username: Joi.string().required().min(1).max(40),
    },
    password: {
        password: passwordRequirements,
    },
    old_password: {
        old_password: passwordRequirements,
    },
    new_password: {
        new_password: passwordRequirements,
    },
    lastLoginDate: {
        password: Joi.date().required(),
    }
};


module.exports.getUserJoiValidation = function (requiredFields) {
    const schema = {};
    for (const field of requiredFields) {
        Object.assign(schema, userJoiSchema[field]);
    }
    const result = Joi.object(schema);
    return generateValidationFunction(result);
}