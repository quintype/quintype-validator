import React, { Component } from "react";
import styles from "./migrator.module.css";
import Select from "@quintype/em/components/select";
import { Button } from "@quintype/em/components/button";
import { TextArea } from "@quintype/em/components/text-area";
import { Loader } from "@quintype/em/components/loader";
import "@quintype/em/global.css";

const selectOptions = [{ label: "Story", value: "Story" }];

const validateOptions = [
  { label: "Direct text input", value: "Direct text input" }
];
export class Migrator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validatetype: null,
      selecttype: null,
      disabled: true,
      text: "",
      errorMessage: "",
      responseData: [],
      isResponse: false,
      isLoading: false
    };
    this.validateHandler = this.validateHandler.bind(this);
    this.onChangeSelecthandler = this.onChangeSelecthandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleclick = this.handleclick.bind(this);
  }
  validateHandler = validatetype => {
    this.setState({ validatetype });
  };

  onChangeSelecthandler = selecttype => {
    this.setState({ selecttype });
  };

  handleChange = value => {
    this.setState({ text: value });
  };

  handleclick(e) {
    e.preventDefault();
    this.setState({
      disabled: !this.state.disabled,
      isLoading: true
    });
    const data = {
      type: this.state.selecttype.value,
      data: this.state.text
    };
    fetch("http://localhost:3000/api/validate", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        return response.json();
      })
      .catch(err => {
        this.setState({ errorMessage: err.message });
      })
      .then(response => {
        this.setState({
          responseData: this.state.responseData.concat(response),
          isResponse: true,
          isLoading: false
        });
      });
  }
  render() {
    const {
      validatetype,
      selecttype,
      text,
      isLoading,
      disabled,
      errorMessage,
      isResponse,
      responseData
    } = this.state;
    const submitDisabled = validatetype && selecttype && text;
    return (
      <div className={styles["migrator"]}>
        {disabled && !isResponse ? (
          <div>
            <Heading />
            <div className={styles["container"]}>
              <Select
                label="Select Type"
                options={selectOptions}
                value={selecttype}
                onChange={e => this.onChangeSelecthandler(e)}
              />
              <Select
                label="Validate by"
                options={validateOptions}
                value={validatetype}
                onChange={e => this.validateHandler(e)}
              />
              <form>
                {validatetype && validatetype.value === "Direct text input" ? (
                  <TextArea
                    label="Enter the Markup to validate:"
                    onChange={value => this.handleChange(value)}
                    value={text}
                    placeholder={"Enter the JSON data"}
                  />
                ) : null}
                <Button
                  type="primary"
                  onClick={e => this.handleclick(e)}
                  disabled={!submitDisabled}
                >
                  Validate
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div>
            {isLoading ? (
              <ResultsPage />
            ) : (
              <pre>{JSON.stringify(responseData[0], null, 2)}</pre>
            )}
          </div>
        )}
        {errorMessage && <pre> {errorMessage} </pre>}
      </div>
    );
  }
}

function ResultsPage() {
  return (
    <div className="migrator">
      <Heading />
      <div className={styles["container"]}>
        <h1>Results</h1>
        <Loader />
        <p className={styles["content"]}>
          Please wait, validation is in progress. This can take 5-10 minutes.
          Please don't close the tab.
        </p>
      </div>
    </div>
  );
}

function Heading() {
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
