const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema za sobo
const roomSchema = new Schema({
    name: {
        type: String,
        required: true
    }
})

const room = mongoose.model("room", roomSchema);

module.exports = room;