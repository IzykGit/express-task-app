const mongoose = require('mongoose')
const { Schema } = mongoose;

const tasksSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    date: {
        typeof: Date,
    }
}, { timestamps: true})

const Tasks = mongoose.model('Tasks', tasksSchema);

module.exports = Tasks