const Joi = require('joi');
const mongoose = require('mongoose');
const {generateValidationFunction} = require("../modules/joi-validate/generate-valdiation-function");


const accountDbSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 1,
        maxlength: 40,
        required: true,
        unique: true
    },
    isBan : {
        type: Boolean,
        required: true,
        default: false
    },
    isAdmin : {
        type: Boolean,
        required: true,
        default: false
    },
});

accountDbSchema.methods.getObjectRepresentation = function (){
    const ret = this.toObject();
    delete ret['_id'];
    delete ret['__v'];
    return ret;
};

module.exports.Account = mongoose.model('Account', accountDbSchema);

const accountJoiSchema = {
    username: {
        username: Joi.string().min(1).max(40).required()
    },
    isBan: {
        isBan: Joi.boolean()
    },
    isAdmin: {
        isAdmin: Joi.boolean()
    }
}

module.exports.getUserJoiValidation = function (requiredFields) {
    const schema = {};
    for (const field of requiredFields) {
        Object.assign(schema, accountJoiSchema [field]);
    }
    const result = Joi.object(schema);
    return generateValidationFunction(result);
}