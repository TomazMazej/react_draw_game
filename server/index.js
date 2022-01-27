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
app.get('/users', async (req, res) => {
    const lists = await Users.User.find();

    res.json(lists);
})

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
