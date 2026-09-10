const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB connection successful');
    } catch (err) {
        console.log('DB connection failed');
        console.log(err.name, err.message);
        process.exit(1);
    }
};

module.exports = connectDB;