import { StarFill } from "react-bootstrap-icons";

function starRating(rate) {

    const totalStar = 5;
    const yellowStar = rate;
    const grayStar = totalStar - yellowStar;

    const yellowStars = Array.from({length:yellowStar}, (_, index) => (
        <StarFill key={index} style={{color: '#FFC100'}}></StarFill>
    ))
    const grayStars = Array.from({length:grayStar}, (_, index) => (
        <StarFill key={index} style={{color: '#bebdbd'}}></StarFill>
    ))

    return (
        <div>
            {yellowStars}
            {grayStars}
        </div>
    )
}

export default starRating;