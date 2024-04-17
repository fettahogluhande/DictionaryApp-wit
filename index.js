import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Create an Express app
const app = express();

// Load environment variables from .env file
dotenv.config();

// Set the port from environment variables or default to 7000
const PORT = process.env.PORT || 7000;

// Get the MongoDB connection URL from environment variables
const MONGOURL = process.env.MONGO_URL;

// Connect to MongoDB and start the server
mongoose.connect(MONGOURL).then(() => {
    console.log("Database connected successfully.");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => console.log(error));

const wordSchema = new mongoose.Schema({
    words: String
});

const UserModel = mongoose.model("words", wordSchema);

app.use(express.json()); // Middleware to parse JSON bodies

// CORS middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/getWord", async (req, res) => {
    const wordData = await UserModel.find();
    res.json(wordData);
});

app.post("/saveWord", async (req, res) => {
    const { word } = req.body;
    try {
        const wordEntry = new UserModel({ words: word });
        await wordEntry.save();
        res.status(201).json({ message: "Word saved successfully" });
    } catch (error) {
        console.error("Error saving word:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
