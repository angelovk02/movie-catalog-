const movieModel = require('../models/movieModel');


function getAllMovies(req, res, next) {
    movieModel.find()
        .then(movies => res.json(movies))
        .catch(next);
}

function getRecentMovies(req, res, next) {
    movieModel.find().sort({ createdAt: -1 }).limit(3).exec((err, recentMovies) => {
        if (err) {
            console.error('Error fetching recent movies:', err);
            return res.status(500).json({ message: 'Internal Server Error', error: err.message });
        }
        res.json(recentMovies);
    });
}


// const getMovieById = (req, res, next) => {
//     const movieId = req.params.movieId
//     movieModel.findById(movieId)
//         .then(movie => res.json(movie))
//         .catch(next);
// };

const getMovieById = (req, res, next) => {
    const movieId = req.params.movieId;

    movieModel.findById(movieId)
        .populate({
            path: 'comments.userId',
            select: 'username' // Specify the field you want to populate
        })
        .exec((err, movie) => {
            if (err) {
                return next(err);
            }
            res.json(movie);
        });
};


const addComment = async (req, res) => {
    const { movieId } = req.params;
    const comment = req.body.text;
    const userId = req.user.id;

    try {
        const movie = await movieModel.findByIdAndUpdate(
            movieId,
            { $push: { comments: { userId, text: comment } } },
            { new: true }
        ).populate('comments.userId');

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.status(201).json(movie.comments[movie.comments.length - 1]);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


function addMovie(req, res, next) {
    const { title, category, director, image, summary } = req.body;


    movieModel.create({ title, category, director, image, summary })
        .then(item => res.status(200).json(item))
        .catch(next);
}


const deleteComment = async (req, res) => {
    const { movieId, commentId } = req.params;

    try {
        const movie = await movieModel.findByIdAndUpdate(
            movieId,
            { $pull: { comments: { _id: commentId } } },
            { new: true }
        ).populate('comments.userId');

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

function deleteMovieById(req, res, next) {
    const movieId = req.params.movieId;

    movieModel.findByIdAndDelete(movieId, (err, movie) => {
        if (err) {
            console.error('Error deleting movie:', err);
            return res.status(500).json({ error: 'Error deleting movie.' });
        }

        if (!movie) {
            return res.status(404).json({ error: 'Movie not found.' });
        }

        return res.json({ message: 'Movie deleted successfully.' });
    });
}



function updateMovieById(req, res, next) {
    const movieId = req.params.movieId;
    const updatedData = req.body;

    movieModel.findByIdAndUpdate(movieId, updatedData, { new: true }, (err, updatedMovie) => {
        if (err) {
            console.error('Error updating movie:', err);
            return res.status(500).json({ error: 'Error updating movie.' });
        }

        if (!updatedMovie) {
            return res.status(404).json({ error: 'Movie not found.' });
        }

        return res.json(updatedMovie);
    });
}


module.exports = {
    getAllMovies,
    addMovie,
    getMovieById,
    addComment,
    deleteComment,
    deleteMovieById,
    updateMovieById,
    getRecentMovies
}
