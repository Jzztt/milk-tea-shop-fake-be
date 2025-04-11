import cloudinary from "../config/cloudinary.js";

const uploadImage = async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      stream.end(req.file.buffer);
    });

    res.status(200).json({
      message: "Image uploaded successfully",
      data: {
        url: result.secure_url,
        public_id: result.public_id,
      },
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const deleteImage = async (req, res) => {
  try {

    const { public_id } = req.body;
    await cloudinary.uploader.destroy(public_id);
    res.json({ message: "Image deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


export const  UploadController = { uploadImage, deleteImage };