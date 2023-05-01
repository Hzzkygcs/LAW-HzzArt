const express = require("express");
const route = express.Router();

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Hello World',
            version: '1.0.0',
        },
    },
    apis: ['./routes*.js'],
};
const openapiSpecification = swaggerJSDoc(options);

route.use('/', swaggerUi.serve);
route.get('/', swaggerUi.setup(openapiSpecification));
module.exports.route = route;