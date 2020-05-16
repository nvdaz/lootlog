import mongoose from 'mongoose';
import regexp from 'mongoose-regexp';

async function setupDatabase(): Promise<void> {
  try {
    regexp(mongoose);
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
      useCreateIndex: true,
    });
  } catch (err) {
    console.log('Failed connection to MONGO DATABASE');
    console.error(err.message);
  }
}

setupDatabase();
