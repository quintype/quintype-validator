import React, { Component } from "react";
import styles from "./migrator.module.css";
import { TextField } from "@quintype/em/components/text-field";
import { Button } from "@quintype/em/components/button";
import Select from "@quintype/em/components/select";
import { TextArea } from "@quintype/em/components/text-area";
import { FileUpload } from "@quintype/em/components/file-upload";
import { Loader } from "@quintype/em/components/loader";
import "@quintype/em/global.css";
import { Link } from "react-router-dom";
import classnames from "classnames/bind";
import request from "superagent-bluebird-promise";

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

const cx = classnames.bind(styles);
export class Migrator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validatetype: null,
      selecttype: null,
      disabled: true
    };
    this.validateHandler = this.validateHandler.bind(this);
    this.onChangeSelecthandler = this.onChangeSelecthandler.bind(this);
  }

  validateHandler = validatetype => {
    this.setState({ validatetype });
  };

  onChangeSelecthandler = selecttype => {
    this.setState({ selecttype });
  };

  submit(e) {
    this.props.onSubmit(this.props.url);
    e.preventDefault();
  }

  handleclick(e) {
    e.preventDefault();
    this.props.onSubmit(this.props.url);
    this.setState({
      disabled: !this.state.disabled
    });
  }

  render() {
    const { validatetype, selecttype } = this.state;

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
              <form onSubmit={e => this.submit(e)}>
                {validatetype && validatetype.value === "Direct text input" ? (
                  <TextArea
                    label="Enter the Markup to validate:"
                    placeholder="Enter the text"
                    value={this.props.url}
                    onChange={value => this.props.onChange(value)}
                  />
                ) : validatetype && validatetype.value === "File Upload" ? (
                  <FileUpload
                    fieldLabel="Upload File"
                    placeholder="Choose File"
                  />
                ) : validatetype && validatetype.value === "S3 Location" ? (
                  <TextField
                    label={"Type url here"}
                    onChange={value => this.props.onChange(value)}
                    value={this.props.url}
                  />
                ) : null}
                <Button
                  type="primary"
                  onClick={e => this.handleclick(e)}
                  disabled={!this.props.url}
                >
                  Validate
                </Button>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export class MigratorComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      response: null,
      loading: false,
      error: null
    };
  }

  loadRules(url) {
    request
      .post(`${process.env.REACT_APP_API_HOST || ""}/api/validate.json`, {
        url: url
      })
      .then(response =>
        this.setState({
          response: response.body,
          loading: false,
          url: response.body.url
        })
      )
      .catch(e => this.setState({ loading: false, error: e.message }));
  }

  processUrl(url) {
    if (this.state.loading) return;

    this.setState(
      {
        url: url,
        loading: true,
        error: null
      },
      () => this.loadRules(url)
    );
  }

  import(response) {
    this.setState({
      response: response,
      error: null,
      loading: false,
      url: response.url
    });
  }

  render() {
    return (
      <div>
        <Migrator
          onSubmit={url => this.processUrl(url)}
          url={this.state.url}
          onChange={url =>
            this.setState({
              url: url
            })
          }
        />
        {this.state.error && (
          <div className="error-message">{this.state.error}</div>
        )}
        {this.state.loading && <MigratorResultPage />}
        {!this.state.loading && this.state.response && <DisplayResults />}
      </div>
    );
  }
}

export function DisplayResults() {
  return (
    <div className={styles["migrator"]}>
      <Heading />
      <div className={cx("container", "result-section")}>Displayed</div>
    </div>
  );
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
    <section className={styles["migrator"]}>
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
