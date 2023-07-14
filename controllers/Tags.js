const Tag = require("../models/tags");

//creating a Tag handler function

exports.createTag = async (req, res) => {
  try {
    //fetching name and description
    const { name, description } = req.body;

    //validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }
    //create entry in the database
    const TagDetails = await Tag.create({
      name: name,
      description: description,
    });
    //return response
    console.log(TagDetails);

    return res.status(200).json({
      success: true,
      message: "Tag Created Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get all tags handler function
exports.showAllTags = async (req, res) => {
  try {
    const allTags = await Tag.find({}, { name: true, description: true });
    res.status(200).json({
      success: true,
      message: "All tags returned Successfully",
      allTags,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
