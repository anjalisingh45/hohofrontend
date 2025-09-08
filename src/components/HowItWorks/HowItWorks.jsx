import React from 'react';
import workflowImg from "../../assets/Steps.webp";
import styles from "./HowItWorks.module.css";

const HowItWorks = () => {
  return (
    <section className={styles.section}>
      <div className="container">
        <h3 className={styles.heading}>How It Works</h3>
        <div className={styles.wrapper}>
          <div className={styles.imageContainer}>
            <img 
              src={workflowImg} 
              alt="Workflow" 
              className={styles.image}
              onError={(e) => {
                console.error('Failed to load workflow image');
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div className={styles.stepsContainer}>
            <ul className={styles.stepsList}>
              {[
                "Sign Up",
                "Create Event & QR", 
                "Share QR for Attendees",
                "Track & Export"
              ].map((step, idx) => (
                <li key={idx} className={styles.stepItem}>
                  <h4 className={styles.stepTitle}>{idx + 1}. {step}</h4>
                  <p className={styles.stepDescription}>Step explanation goes here.</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
