const { StoryModel } = require("../../schema");
const { http_codes, messages } = require("../../utils/constant");
const moment = require("moment");
const createStory = async (req, res) => {
  try {
    console.log("req.user", req.user);
    req.body.createdBy = req.user._id;
    const create = await StoryModel.create(req.body);
    return res.status(http_codes.ok).json({
      code: http_codes.ok,
      data: create,
      message: messages.recordCreate,
    });
  } catch (error) {
    console.error("Error in createStory", error.message);
    return res.status(http_codes.internalError).json({
      code: http_codes.internalError,
      data: {},
      message: messages.internalServerError,
    });
  }
};

const getStory = async (req, res) => {
  try {
    const get = await StoryModel.findOne({
      _id: req.params.id,
      isDeleted: false,
    });
    if (get) {
      return res.status(http_codes.ok).json({
        code: http_codes.ok,
        data: get,
        message: messages.detailsFetch,
      });
    } else {
      return res.status(http_codes.badRequest).json({
        code: http_codes.badRequest,
        data: {},
        message: messages.recordNotFound,
      });
    }
  } catch (error) {
    console.error("Error in getStory", error.message);
    return res.status(http_codes.internalError).json({
      code: http_codes.internalError,
      data: {},
      message: messages.internalServerError,
    });
  }
};

const storyList = async (req, res) => {
  try {
    const { filter, page, limit } = req.query;
    const query = {
      createdBy: req.user._id,
      isDeleted: false,
    };
    if (filter) {
      query["$or"] = [
        {
          title: { $regex: `${filter}`, $options: "i" },
        },
        {
          description: { $regex: `${filter}`, $options: "i" },
        },
        {
          location: { $regex: `${filter}`, $options: "i" },
        },
        {
          status: { $regex: `${filter}`, $options: "i" },
        },
      ];
    }

    const options = {
      page: page || 1,
      limit: limit || 10,
    };
    console.log("query", query);
    const getList = await StoryModel.paginate(query, options);
    return res.status(http_codes.ok).json({
      code: http_codes.ok,
      data: getList,
      message: messages.listFetch,
    });
  } catch (error) {
    console.error("Error in storyList", error.message);
    return res.status(http_codes.internalError).json({
      code: http_codes.internalError,
      data: {},
      message: messages.internalServerError,
    });
  }
};

const updateStory = async (req, res) => {
  try {
    const get = await StoryModel.findOne({
      _id: req.params.id,
      isDeleted: false,
    });
    if (get) {
      const update = await StoryModel.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true }
      );
      return res.status(http_codes.ok).json({
        code: http_codes.ok,
        data: update,
        message: messages.recordUpdate,
      });
    } else {
      return res.status(http_codes.badRequest).json({
        code: http_codes.badRequest,
        data: get,
        message: messages.recordNotFound,
      });
    }
  } catch (error) {
    console.error("Error in updateStory", error.message);
    return res.status(http_codes.internalError).json({
      code: http_codes.internalError,
      data: {},
      message: messages.internalServerError,
    });
  }
};

const deleteStory = async (req, res) => {
  try {
    const get = await StoryModel.findOne({
      _id: req.params.id,
      isDeleted: false,
    });
    if (get) {
      await StoryModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            isDeleted: true,
            deletedBy: req.user._id,
            deletedAt: moment.utc(),
          },
        },
        { new: true }
      );
      return res.status(http_codes.ok).json({
        code: http_codes.ok,
        data: {},
        message: messages.recordDelete,
      });
    } else {
      return res.status(http_codes.badRequest).json({
        code: http_codes.badRequest,
        data: {},
        message: messages.recordNotFound,
      });
    }
  } catch (error) {
    console.error("Error in deleteStory", error.message);
    return res.status(http_codes.internalError).json({
      code: http_codes.internalError,
      data: {},
      message: messages.internalServerError,
    });
  }
};

module.exports = {
  createStory,
  getStory,
  storyList,
  updateStory,
  deleteStory,
};
