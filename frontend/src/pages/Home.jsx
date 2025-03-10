import { Link } from "react-router-dom";

export const Home = () => {
    return (
        <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="container text-center">
                <h1 className="fw-bold display-4 text-primary">Welcome to Job Mail Sender</h1>
                <p className="lead text-dark mt-3">
                    The fastest way to apply for jobs and connect with top companies.
                </p>

                {/* How It Works Section */}
                <div className="mt-4">
                    <h3 className="fw-bold text-dark">📌 How It Works?</h3>
                    <div className="row justify-content-center mt-3">
                        <div className="col-md-8">
                            <ul className="list-group list-group-flush text-start">
                                <li className="list-group-item bg-light border-0">
                                    ✅ <strong>Get Direct HR Emails:</strong> Instantly access recruiter emails.
                                </li>
                                <li className="list-group-item bg-light border-0">
                                    ✅ <strong>Save Time:</strong> No long forms, apply in seconds.
                                </li>
                                <li className="list-group-item bg-light border-0">
                                    ✅ <strong>Apply to Multiple Companies:</strong> Reach out with a single click.
                                </li>
                                <li className="list-group-item bg-light border-0">
                                    ✅ <strong>Verified Contacts:</strong> Stay ahead with up-to-date HR details.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Why Choose Us Section */}
                <div className="mt-5">
                    <h3 className="fw-bold text-dark">🚀 Why Choose Job Mail Sender?</h3>
                    <p className="text-muted px-3 mx-auto" style={{ maxWidth: "700px" }}>
                        Traditional job applications can be slow and frustrating.
                        <strong> Job Mail Sender</strong> gives you instant access to HR contacts so you can apply directly,
                        skipping the long waiting process and speeding up your hiring journey.
                    </p>
                </div>

                {/* Call to Action Buttons */}
                <div className="d-grid gap-3 d-md-flex justify-content-center mt-4">
                    <Link to="/apply" className="btn btn-primary btn-lg px-4 py-2 fw-bold shadow-sm cta-btn">
                        Start Applying Now 🚀
                    </Link>
                    <Link to="/hrmail" className="btn btn-outline-primary btn-lg px-4 py-2 fw-bold shadow-sm cta-btn">
                        ➕ Add HR
                    </Link>
                </div>
            </div>
        </div>
    );
};
