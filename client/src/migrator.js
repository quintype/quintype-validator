import React, { Component } from "react";
import styles from "./migrator.module.css";
import { TextField } from "@quintype/em/components/text-field";
import { Button } from "@quintype/em/components/button";
import Select from "@quintype/em/components/select";
import { FileUpload } from "@quintype/em/components/file-upload";
import "@quintype/em/global.css";

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
    };
    this.onChangehandler = this.onChangehandler.bind(this);
    this.onChangeSelecthandler = this.onChangeSelecthandler.bind(this);
  }

  onChangehandler = validatetype => {
    this.setState({ validatetype });
  };

  onChangeSelecthandler = selecttype => {
    this.setState({ selecttype });
  };

  render() {
    const { validatetype, selecttype } = this.state;
    return (
      <div className={styles["migrator"]}>
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
            onChange={this.onChangehandler}
          />

          {validatetype && validatetype.value === "Direct text input" ? (
            <TextField label={"Type url here"} classname={styles.input} />
          ) : validatetype && validatetype.value === "File Upload" ? (
            <FileUpload fieldLabel="Upload File" placeholder="Choose File" />
          ) : validatetype && validatetype.value === "S3 Location" ? (
            <TextField
              label={"Type url here"}
              classname={styles.input}
            />
          ) : null}
           <Button type="primary">Validate</Button>
        </div>
      </div>
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
