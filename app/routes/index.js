var express = require("express");

const userRouter = require("../userApp/user/userRouter");
const storyRouter = require("../userApp/story/storyRouter");

module.exports = function (app) {
  app.use("/api/user", userRouter);
  app.use("/api/story", storyRouter);
};

/**
 * @swagger
 * tags :
 *  name : User
 *  description : User
 */

/**
 * @swagger
 * components:
 *  securitySchemes:
 *   jwt:
 *    type: http
 *    scheme: bearer
 *    in : header
 *    bearerFormat: JWT
 */

/**
 * @swagger
 * definitions:
 *   register:
 *     type : object
 *     properties:
 *          email :
 *              type : string
 *              description : 'Email'
 *              required: true
 *          fullName :
 *              type : string
 *              description : 'fullName'
 *              required: true
 *          password :
 *              type : string
 *              description : 'Password'
 *              required: true
 *   login:
 *     type : object
 *     properties:
 *          email :
 *              type : string
 *              description : 'Email'
 *              required: true
 *          password :
 *              type : string
 *              description : 'Password'
 *              required: true
 */

/**
 *
 * @swagger
 * path:
 * /api/user/register:
 *  post :
 *   tags : [User]
 *   summary : User Register
 *   description :  User Register
 *   requestBody :
 *    content :
 *     application/json:
 *      schema :
 *        $ref: '#/definitions/register'
 *   responses :
 *    200 :
 *     description : Registration successfully completed.
 *    400 :
 *     description : Something went wrong(Dynamic messages based on conditions)
 *    500 :
 *     description : Internal Server error
 */

/**
 *
 * @swagger
 * path:
 * /api/user/login:
 *  post :
 *   tags : [User]
 *   summary : User Login
 *   description :  User Login
 *   requestBody :
 *    content :
 *     application/json:
 *      schema :
 *        $ref: '#/definitions/login'
 *   responses :
 *    200 :
 *     description : Login successfully completed.
 *    400 :
 *     description : Something went wrong(Dynamic messages based on conditions)
 *    500 :
 *     description : Internal Server error
 */
