import React, { Component } from "react";
import styles from "./migrator.module.css";
import { Loader } from "@quintype/em/components/loader";
import { ValidationForm } from './validation-form'
import "@quintype/em/global.css";

export class Migrator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formEnabled: true,
      result: ''
    };
  }

  setData = (state) => {
    this.setState(state)
  }

  render() {
    const {
      formEnabled,
      result
    } = this.state;
    return (
      <div className={styles["migrator"]}>
        {formEnabled ? 
          <ValidationForm
            sendData={this.setData}
            /> : (
            <ResultsPage
              result={result}
            />
        )}
      </div>
    );
  }
}

function ResultsPage({result}) {
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

export function Heading() {
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
export default Heading;
