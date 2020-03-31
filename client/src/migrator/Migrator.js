import React, { Component } from "react";
import Result from './Result'
import styles from "./migrator.module.css";
import ValidationForm from './ValidationForm'
import "@quintype/em/global.css";

export default class Migrator extends Component {
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
            <Result
              result={result}
            />
        )}
      </div>
    );
  }
}

