import React from 'react'
import { Accordion, AccordionSection } from '@quintype/em/components/accordion'
import styles from './migrator.module.css'

export default function ResultList ({ finalResult }) {
  // add props for accordion labels

  const errorItems = finalResult && finalResult.errors.map((error) => {
    return (
      <li>
        <span className={styles['error-message']}>{error.message}</span>
        {error.metadata && Object.values(error.metadata).map((item) => {
          return (<p className={styles['error-metadata']}>{item}</p>)
        })}
      </li>
    )
  })

  const warningItems = finalResult && finalResult.warnings.map((warning) => {
    return (
      <li>
        <span className={styles['error-message']}>{warning.message}</span>
        {warning.metadata && Object.values(warning.metadata).map((item) => {
          return (<p className={styles['error-metadata']}>{item}</p>)
        })}
      </li>
    )
  })

  return (
    <>
      <Accordion>
        <AccordionSection
          label='Details'
          children={
            <>
              <p className={styles['error-level']}>Errors</p>
              <ul className={styles['error-list']}>{errorItems}</ul>
              <p className={styles['error-level']}>Warnings</p>
              <ul className={styles['warning-list']}>{warningItems}</ul>
            </>
          }
        />
      </Accordion>
    </>
  )
}
