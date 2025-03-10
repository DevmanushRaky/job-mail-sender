import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      <h1 className="display-1 fw-bold text-danger">404</h1>
      <h2 className="text-muted">Oops! Page Not Found</h2>
      <p className="text-muted">
        The page you are looking for doesnot exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary mt-3">
        Go Back Home
      </Link>
    </div>
  );
};
