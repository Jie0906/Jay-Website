const app = require('./App');
const connectDB = require('./config/mongoose.config')
const dotenv = require('dotenv')

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, "0.0.0.0", () => console.log(`Server is running on port ${PORT}.`));
  } catch (error) {
    console.error("Unable to start the server:", error);
  }
};

startServer();