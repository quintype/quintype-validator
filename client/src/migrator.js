import React, { Component } from "react";
import styles from "./migrator.module.css";
import Select from "@quintype/em/components/select";
import { Button } from "@quintype/em/components/button";
import { TextArea } from "@quintype/em/components/text-area";
import "@quintype/em/global.css";
import { Loader } from "@quintype/em/components/loader";

const selectOptions = [{ label: "Story", value: "story" }];

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
      responseData: [],
      isResponse: false,
      isLoading: false
    };
    this.validateHandler = this.validateHandler.bind(this);
    this.onChangeSelecthandler = this.onChangeSelecthandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
      disabled: !this.state.disabled
    });
    const data = {
      validate: this.state.validatetype.value,
      select: this.state.selecttype.value,
      text: this.state.text.replace(/\r?\n|\r/g, "")
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
      .then(response => {
        this.setState({
          responseData: this.state.responseData.concat(response),
          isResponse: true,
          isLoading: true
        });
      });
    setTimeout(() => this.setState({ isLoading: false }), 1000);
  }
  render() {
    const { validatetype, selecttype, text } = this.state;
    const submitDisabled = validatetype && selecttype && text;
    return (
      <div className={styles["migrator"]}>
        {this.state.disabled && !this.state.isResponse ? (
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
                onChange={this.validateHandler}
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
            {this.state.isLoading ? (
              <ResultsPage />
            ) : (
              <p>{JSON.stringify(this.state.responseData[0])}</p>
            )}
          </div>
        )}
      </div>
    );
  }
}

function ResultsPage() {
  return (
    <div className={styles["migrator"]}>
      <Heading />
      <div className={styles["container"]}>
        <p>Results</p>
        <Loader />
        <p>Please wait, validation is in progress. This can take 5-10 minutes. Please don't close the tab.</p>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <section className={styles["migrator-heading"]}>
      <h1 className={styles["heading"]}>Migration Data Validator</h1>
      <p className={styles["content"]}>
        Quis blandit turpis cursus in hac habitasse. Scelerisque in dictum non
        consectetur a. Ullamcorper morbi tincidunt ornare massa eget egestas
        purus viverra accumsan.
      </p>
    </section>
  );
}
export default Heading;
