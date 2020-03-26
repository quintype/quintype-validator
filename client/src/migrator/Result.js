import React from "react";
import Heading from './Heading'
import { Loader } from "@quintype/em/components/loader";
import styles from "./migrator.module.css";

export default function Result({result}) {
    return (
      <>
        {!result ? (
          <div className="migrator">
            <Heading />
            <div className={styles["container"]}>
              <h1>Results</h1>
              <Loader />
              <p className={styles["content"]}>
                Please wait, validation is in progress. This can take 5-10
                minutes. Please don't close the tab.
              </p>
            </div>
          </div>
        ) : (
          <pre>{JSON.stringify(result, null, 2)}</pre>
        )}
      </>
    );
  }