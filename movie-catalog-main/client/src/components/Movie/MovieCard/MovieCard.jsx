import { Link } from 'react-router-dom';
import movieCardStyles from './MovieCard.module.css';

const MovieCard = ({ title, image, movieId }) => {
  const cardStyle = {
    backgroundImage: `url(${image})`,
  };

  return (
    <Link to={`/movies/${movieId}`} className={movieCardStyles.movieCard} style={cardStyle}>
      <div className={movieCardStyles.movieDetails}>
        <h3 className={movieCardStyles.movieTitle}>{title}</h3>
      </div>
    </Link>
  );
};

export default MovieCard;
