const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const port = 3000;
const TodoModel = require('./TodoAppModel/Todo');
const app = express();

// Load environment variables from .env file
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.listen({ port }, () => {
    console.log("App is running at http://localhost:", port);
});

// Connecting to MongoDB Server using environment variable
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB successfully...");
    })
    .catch((error) => {
        console.log(error);
    });

// Get tasks for a specific user
app.get('/Tasks', async (req, res) => {
    try {
        const userId = req.query.userId; // Retrieve userId from query parameters
        const result = await TodoModel.find({ userId: userId });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific task by ID
app.get('/Tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await TodoModel.findById(id);
        if (!result) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a specific task by ID
app.put('/updateTask/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.body.userId; // Ensure the userId is included in the request
        const update = await TodoModel.findOneAndUpdate(
            { _id: id, userId: userId },
            { task: req.body.task },
            { new: true }
        );
        if (!update) {
            return res.status(404).json({ message: "Task not found or user not authorized" });
        }
        res.status(200).json(update);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new task
app.post('/AddTask', async (req, res) => {
    try {
        const { task, userId } = req.body;
        const newTask = await TodoModel.create({ task, userId });
        res.status(200).json(newTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a task by ID
app.delete('/deleteTask/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.body.userId; // Ensure the userId is included in the request
        const deleteTask = await TodoModel.findOneAndDelete({ _id: id, userId: userId });
        if (!deleteTask) {
            return res.status(404).json({ message: "Task not found or user not authorized" });
        }
        res.status(200).json({ message: "Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});
