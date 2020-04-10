import React from "react";
import styles from "./migrator.module.css";

export default function Heading() {
    return (
      <section className={styles["migrator-heading"]}>
        <h1 className={styles["heading"]}>Migration Validator</h1>
        <p className={styles["content"]}>
          Migration Data Validator checks for the intermediate files for JSON
          schema errors, File type & encoding errors and mandatory errors and
          generates a report after the validation process is completed
        </p>
      </section>
    );
  }