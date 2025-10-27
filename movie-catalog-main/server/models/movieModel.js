const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    director: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
    }],
}, {timestamps: true});

module.exports = mongoose.model('Movie', movieSchema);
