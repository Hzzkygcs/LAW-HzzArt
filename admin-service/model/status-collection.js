const Joi = require('joi');
const mongoose = require('mongoose');
const {generateValidationFunction} = require("../modules/joi-validate/generate-valdiation-function");


const statusCollectionDbSchema = new mongoose.Schema({
    collectionId: {
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
});

statusCollectionDbSchema.methods.getObjectRepresentation = function (){
    const ret = this.toObject();
    delete ret['_id'];
    delete ret['__v'];
    return ret;
};

module.exports.StatusCollection = mongoose.model('StatusCollection', statusCollectionDbSchema);

const statusCollectionJoiSchema = {
    collectionId: {
        collectionId: Joi.string().min(1).max(40).required()
    },
    isBan: {
        isBan: Joi.boolean()
    },
}

module.exports.getStatusCollectionJoiValidation = function (requiredFields) {
    const schema = {};
    for (const field of requiredFields) {
        Object.assign(schema, statusCollectionJoiSchema [field]);
    }
    const result = Joi.object(schema);
    return generateValidationFunction(result);
}