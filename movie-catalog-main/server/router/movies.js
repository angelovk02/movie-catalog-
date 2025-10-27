const express = require('express');
const router = express.Router();
const { auth } = require('../utils');
const {movieController} = require('../controllers')


router.get('/', movieController.getAllMovies)
router.post('/', auth(), movieController.addMovie);

router.get('/recentMovies', movieController.getRecentMovies);

router.get('/:movieId', movieController.getMovieById);
router.put('/:movieId', auth(), movieController.updateMovieById);
router.delete('/:movieId', auth(), movieController.deleteMovieById);




router.post('/:movieId/addComment', auth(), movieController.addComment);
router.delete('/:movieId/comments/:commentId', auth(), movieController.deleteComment);


module.exports = router