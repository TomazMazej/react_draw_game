require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

// Database connection
connection();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Requests
const Users = require('./models/user')

// Dobimo vse uporabnike
app.get('/users', async (req, res) => {
    const users = await Users.User.find();

    res.json(users);
})

// Dobimo ime uporabnika glede na email
app.get('/users/:e', async (req, res) => {
    const user = await Users.User.findOne({ email: req.params.e });

    res.json(user);
})

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
