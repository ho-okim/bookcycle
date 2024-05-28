import { StarFill } from "react-bootstrap-icons";
import 'bootstrap/dist/css/bootstrap.min.css';

function starRating(rate) {

    const totalStar = 5;
    const yellowStar = rate;
    const grayStar = totalStar - yellowStar;

    const yellowStars = Array.from({length:yellowStar}, (_, index) => (
        <StarFill key={index} style={{color: '#FFC100'}}></StarFill>
    ));
    const grayStars = Array.from({length:grayStar}, (_, index) => (
        <StarFill key={index} style={{color: '#bebdbd'}}></StarFill>
    ));

    return (
        <div className="d-flex align-items-center">
            {yellowStars}
            {grayStars}
        </div>
    )
}

export default starRating;