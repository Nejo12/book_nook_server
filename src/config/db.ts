import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected . . .');
  } catch (err: any) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;

// import mongoose, { ConnectOptions } from 'mongoose';

// const connectDB = async () => {
//   try {
//     await mongoose.connect(
//       process.env.MONGODB_URI as string,
//       {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       } as ConnectOptions,
//     );
//     console.log('MongoDB Connected . . .');
//   } catch (err: any) {
//     console.error(err.message);
//     // Exit process with failure
//     process.exit(1);
//   }
// };

// export default connectDB;
