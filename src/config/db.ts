import mongoose from "mongoose";

const dbUrl: string | undefined = process.env.MONGO_URL;

if (!dbUrl) {
  console.error("MONGO_URL is undefined please provide database URL");
  process.exit(1);
}

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(dbUrl, { dbName: "Occasio" });

    console.log(`Server connected to host ${connect.connection.host}`);
  } catch (err: unknown) {
    console.error(`Failed to connect to database`, err);
    process.exit(1);
  }
};

export default connectDB;
