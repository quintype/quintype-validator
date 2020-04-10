import React from "react";
import Heading from './Heading'
import ResultList from './ResultList'
import styles from "./migrator.module.css";
import { parseResult } from './validator-utils'

export default function Result({result}) {

  const finalResult = result && parseResult(result)

  return (
    <>
      <div className={styles['migrator']}>
        <Heading />
        <div className={styles['container']}>
          <>
          <p className={styles['result-heading']}>Results</p>
          <p className={styles['content']}>{finalResult.total}</p>
          <p className={styles['content']}>{finalResult.failed}</p>
          <ResultList finalResult={finalResult} />
          </>
        </div>
      </div>
    </>
  );
}