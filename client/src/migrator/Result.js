import React from "react";
import Heading from './Heading'
import ResultList from './ResultList'
import { Loader } from "@quintype/em/components/loader";
import styles from "./migrator.module.css";

export default function Result({result}) {
  const parsedResult = [
    'should have required property \'slug\'.\tstory-ids: abc-12, def-23',
    'has additional property \'extra\'.\tstory-ids: abc1, abc2',
    'has wrong type for property \'headline\', expected \'string\'.\tstory-ids: abc1, abc2',
    'has incorrect value for property \'status\'. Allowed values are \'open\', \'published\'.\tstory-ids: abc1, abc2']

  return (
    <>
      <div className="migrator">
        <Heading />
        <div className={styles['container']}>
          <p className={styles['result-heading']}>Results</p>
          { !result ?
            <>
              <Loader />
              <p className={styles['content']}>
                Please wait, validation is in progress. This can take 5-10
                minutes. Please don't close the tab.
              </p>
            </>
            :
            <>
              <p>Total stories validated: 5</p>
              <p>Successful stories : 2</p>
              <p>Failed stories : 2</p>
              <ResultList finalResult={parsedResult} />
            </>}
        </div>
      </div>
    </>
  );
}
