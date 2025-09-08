import { Link } from "react-router-dom";
import styles from "./Cta.module.css";

const Cta = () => (
    <section className={styles.section}>
        <div className="container">
            <h2 className={styles.heading}>Ready to Host Your Next Event?</h2>
            <Link to="/signup" className={styles.button}>
                Get Started Now
            </Link>
        </div>
    </section>
);

export default Cta;
