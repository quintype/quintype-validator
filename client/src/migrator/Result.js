import React from 'react'
import ResultList from './ResultList'
import FileDownload from './FileDownload'
import { Loader } from '@quintype/em/components/loader'
import styles from './migrator.module.css'
import { parseResult } from './validator-utils'

export default function Result ({ result }) {
  const finalResult = result && parseResult(result)

  return (
    <>
      {!finalResult
        ? <>
          <Loader />
          <p className={styles.content}>
          Please wait, validation is in progress. This can take 5-10
          minutes. Please don't close the tab.
          </p>
        </>
        : <>
          <div className={styles['result-heading']}>
            <div id={styles.heading}>Results</div>
            <div id={styles.download}>
              <a href={finalResult.errorFile} download={`result-${Date.now()}.csv`}>
                <FileDownload />Download Report
              </a>
            </div>
          </div>
          <div className={styles['result-statistics']}>
            <div>
              <div className={styles['statistic-heading']}>Total validated {finalResult.dataType}</div>
              <div className={styles['statistic-reading']}>{finalResult.total}</div>
            </div>
            <div>
              <div className={styles['statistic-heading']}>Successfully validated</div>
              <div className={styles['statistic-reading']}>
                {finalResult.successful}<div id={styles['success-reading']} />
              </div>
            </div>
            <div>
              <div className={styles['statistic-heading']}>Failed {finalResult.dataType}</div>
              <div className={styles['statistic-reading']}>
                {finalResult.failed}<div id={styles['fail-reading']} />
              </div>
            </div>
          </div>
          <div className={styles['result-messages']}>
            <ResultList finalResult={finalResult} />
          </div>
        </>}
    </>
  )
}
