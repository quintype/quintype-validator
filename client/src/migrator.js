import React, { Component } from "react";
import styles from "./migrator.module.css";
import Select from "@quintype/em/components/select";
import { Button } from "@quintype/em/components/button";
import { TextArea } from "@quintype/em/components/text-area";
import "@quintype/em/global.css";
import { Loader } from "@quintype/em/components/loader";
import classnames from "classnames/bind";

const cx = classnames.bind(styles);

const selectOptions = [
  { label: "Story", value: "story" },
  { label: "Section", value: "section" },
  { label: "Authors", value: "authors" },
  { label: "Story Attributes", value: "story attributes" }
];
const validateOptions = [
  { label: "Direct text input", value: "Direct text input" },
  { label: "File Upload", value: "File Upload" },
  { label: "S3 Location", value: "S3 Location" }
];

export class Migrator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validatetype: null,
      selecttype: null,
      disabled: true,
      text: ""
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

  handleclick(e) {
    e.preventDefault();
    this.setState({
      disabled: !this.state.disabled
    });
  }

  handleChange = value => {
    this.setState({ text: value });
  };

  render() {
    const { validatetype, selecttype, text, direct } = this.state;
    return (
      <div className={styles["migrator"]}>
        {this.state.disabled ? (
          <div>
            <Heading />
            <div className={styles["container"]}>
              <Select
                label="Select Type"
                options={selectOptions}
                value={selecttype}
                onChange={this.onChangeSelecthandler}
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
                    placeholder="Enter the text"
                    onChange={value => this.handleChange(value)}
                    value={text}
                  />
                ) : null}
                <Button
                  type="primary"
                  onClick={e => this.handleclick(e)}
                  disabled={!this.state.text}
                >
                  Validate
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <MigratorResultPage />
        )}
      </div>
    );
  }
}

export class MigratorResultPage extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Heading />
        <div className={cx("migrator", "result")}>
          <h2 className={styles["result-heading"]}>Results</h2>
          <div className={styles["result-loader"]}>
            <Loader />
            <div>
              Please wait, validation is in progress. This can take 5-10
              minutes. Please don't close the tab.
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
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
