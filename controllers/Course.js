const Course = require("../models/Course");
const Tag = require("../models/tags");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//Create Course Handeler function

exports.createCourse = async (req, res) => {
  try {
    //We are getting the user id to verify if the user is an instructor or a student
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;

    //get thumbnail
    const thumbnail = req.files.thumbnailImage;

    //validation if one of the field is empty
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findbyId(userId);
    console.log("instructor details", instructorDetails);

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor details not found",
      });
    }
    //check given tag is valid or not

    const tagDetails = await tag.findbyId(tag);
    if (!tagDetails) {
      return res.status(400).json({
        success: false,
        message: "Tag details not found",
      });
    }
    //upload Image to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    //create an Entry for new Course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    //User is instructor so ad the new course to the User schema for the instructor

    await User.findbyIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Course Created Successfully",
      data: newCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

//getAllCourses handler function

exports.showAllCourses = async (req, res) => {
  try {
    const allCourses = await Courses.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndreviews: true,
        studentEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Data for all courses fetched successfully",
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot fetch all course data",
      error: error.message,
    });
  }
};
