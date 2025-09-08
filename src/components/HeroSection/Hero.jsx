import { Link } from "react-router-dom";
import heroImg from "../../assets/aac.jpg";
import styles from "./Hero.module.css";

const Hero = () => (
    <section className={styles.heroSection}>
        <div className="container">
            <div className={styles.heroWrapper}>
                <div className={styles.heroContent}>
                    <h2 className={styles.heroTitle}>
                        Manage Events <br />
                        Smarter with <span className={styles.gradientText}>pvt2.0</span>
                    </h2>
                    <p className={styles.heroDescription}>
                        Create, host, and manage your events seamlessly. Share QR registrations and track attendees in real-time.
                    </p>
                    <Link to="/signup" className={styles.heroBtn}>
                        Get Started
                    </Link>
                </div>
                <div className={styles.heroImageBox}>
                    <img src={heroImg} alt="Event Management" className={styles.heroImage} />
                </div>
            </div>
        </div>
    </section>
);

export default Hero;
