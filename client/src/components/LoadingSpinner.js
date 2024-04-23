import { Spinner } from "react-bootstrap";

function LoadingSpinner() {
    return(
        <Spinner animation="border" 
        variant="primary"
        role="status">
            <span className="visually-hidden">로딩중...</span>
        </Spinner>
    )
}

export default LoadingSpinner;