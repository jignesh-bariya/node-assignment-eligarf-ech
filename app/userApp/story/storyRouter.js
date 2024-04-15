const storyRouter = require("express").Router();
const storyController = require("./storyController");
const validator = require("./storyValidator");
const validate = require("../../utils/validator");
const { userVerifyToken } = require("../../utils/utils");

storyRouter.post(
  "/",
  userVerifyToken,
  validate(validator.createStory),
  storyController.createStory
); //Done
storyRouter.get("/", userVerifyToken, storyController.storyList); //Done
storyRouter.get("/:id", userVerifyToken, storyController.getStory); //Done
storyRouter.put(
  "/:id",
  userVerifyToken,
  validate(validator.updateStory),
  storyController.updateStory
); //Done
storyRouter.delete("/:id", userVerifyToken, storyController.deleteStory); //Done

module.exports = storyRouter;

/**
 * @swagger
 * tags :
 *  name : Story
 *  description : Story
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
 *   storyCreate:
 *     type : object
 *     properties:
 *          title :
 *              type : string
 *              description : 'title'
 *              required: true
 *          description :
 *              type : string
 *              description : 'description'
 *              required: true
 *          location :
 *              type : string
 *              description : 'location'
 *              required: true
 *          status :
 *              type : string
 *              description : 'status'
 *              required: true
 *   storyUpdate:
 *     type : object
 *     properties:
 *          title :
 *              type : string
 *              description : 'title'
 *              required: false
 *          description :
 *              type : string
 *              description : 'description'
 *              required: false
 *          location :
 *              type : string
 *              description : 'location'
 *              required: false
 *          status :
 *              type : string
 *              description : 'status'
 *              required: false
 */

/**
 *
 * @swagger
 * path:
 * /api/story:
 *  post :
 *   tags : [Story]
 *   summary : Story Create
 *   description :  Story Create
 *   requestBody :
 *    content :
 *     application/json:
 *      schema :
 *        $ref: '#/definitions/storyCreate'
 *   responses :
 *    200 :
 *     description : Story successfully created.
 *    400 :
 *     description : Something went wrong(Dynamic messages based on conditions)
 *    500 :
 *     description : Internal Server error
 *   security :
 *    - jwt : []
 */

/**
 *
 * @swagger
 * path:
 * /api/story:
 *  get :
 *   tags : [Story]
 *   summary : Story List
 *   description :  Story List
 *   parameters:
 *      - name: page
 *        in: query
 *        description: Page Number
 *        required: false
 *        schema:
 *          type: integer
 *          minimun: 1
 *      - name: limit
 *        in: query
 *        description: Record Per Page
 *        required: false
 *        schema:
 *          type: integer
 *          minimun: 1
 *      - name: filter
 *        in: query
 *        description: Search Value
 *        required: false
 *        schema:
 *          type: string
 *   responses :
 *    200 :
 *     description : Story list fetched successfully.
 *    400 :
 *     description : Something went wrong(Dynamic messages based on conditions)
 *    500 :
 *     description : Internal Server error
 *   security :
 *    - jwt : []
 */

/**
 *
 * @swagger
 * path:
 * /api/story/{id}:
 *  get :
 *   tags : [Story]
 *   summary : Story Get
 *   description :  Story Get
 *   parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *   responses :
 *    200 :
 *     description : Story details fetched successfully.
 *    400 :
 *     description : Something went wrong(Dynamic messages based on conditions)
 *    500 :
 *     description : Internal Server error
 *   security :
 *    - jwt : []
 */

/**
 *
 * @swagger
 * path:
 * /api/story/{id}:
 *  put :
 *   tags : [Story]
 *   summary : Story Update
 *   description :  Plan Update
 *   parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *   requestBody :
 *    content :
 *     application/json:
 *      schema :
 *        $ref: '#/definitions/storyUpdate'
 *   responses :
 *    200 :
 *     description : Plan details fetched successfully.
 *    400 :
 *     description : Something went wrong(Dynamic messages based on conditions)
 *    500 :
 *     description : Internal Server error
 *   security :
 *    - jwt : []
 */

/**
 *
 * @swagger
 * path:
 * /api/story/{id}:
 *  delete :
 *   tags : [Story]
 *   summary : Story Delete
 *   description :  Story Delete
 *   parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *   responses :
 *    200 :
 *     description : Story deleted successfully.
 *    400 :
 *     description : Something went wrong(Dynamic messages based on conditions)
 *    500 :
 *     description : Internal Server error
 *   security :
 *    - jwt : []
 */
