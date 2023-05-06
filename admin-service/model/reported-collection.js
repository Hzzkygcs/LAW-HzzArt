const Joi = require('joi');
const mongoose = require('mongoose');
const {generateValidationFunction} = require("../modules/joi-validate/generate-valdiation-function");
const {getTime} = require("../modules/util/get-time");

const reportedCollectionDbSchema = new mongoose.Schema({
    collectionId: {
        type: String,
        minlength: 1,
        maxlength: 40,
        required: true
    },    
    reportedBy: {
        type: String,
        minlength: 1,
        maxlength: 40,
        required: true
    },
    owner: {
        type: String,
        minlength: 1,
        maxlength: 40,
        required: true,
    },         
    reason: {
        type: String,
        minlength: 1,
        maxlength: 40,
        required: true
    },
    dateTime: {
        type: String,
        required: true
    }
});

module.exports.ReportedCollectionMethods = {
    setDateTime: async function () {
        this.dateTime = getTime();
    }
}

reportedCollectionDbSchema.methods.setDateTime = module.exports.ReportedCollectionMethods.setDateTime;

reportedCollectionDbSchema.methods.getObjectRepresentation = function (){
    const ret = this.toObject();
    delete ret['_id'];
    delete ret['__v'];
    return ret;
};

module.exports.ReportedCollection = mongoose.model('ReportedCollection', reportedCollectionDbSchema);

const reportedCollectionJoiSchema = {
    collectionId: {
        collectionId: Joi.string().min(1).max(40).required()
    },
    reportedBy: {
        reportedBy: Joi.string().min(1).max(40).required()
    },
    owner: {
        owner: Joi.string().min(1).max(40).required()
    },
    reason: {
        reason: Joi.string().min(1).max(40).required()
    },
    date: {
        date: Joi.string()
    }
}

module.exports.getReportedCollectionJoiValidation = function (requiredFields) {
    const schema = {};
    for (const field of requiredFields) {
        Object.assign(schema, reportedCollectionJoiSchema [field]);
    }
    const result = Joi.object(schema);
    return generateValidationFunction(result);
}