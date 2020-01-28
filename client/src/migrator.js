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
  
  handleclick(e) {
    e.preventDefault();
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
              <form>
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
      url: ""
    };
  }
  render() {
    return (
        <Migrator
          url={this.state.url}
          onChange={url =>
            this.setState({
              url: url
            })
          }
        />
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
