import mongoose from "mongoose";

const connectMongoDB = async (dbUrl) => {
  try {
    await mongoose.connect(dbUrl);
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};

export default connectMongoDB;
