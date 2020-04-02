import React from "react";
import { Accordion, AccordionSection } from '@quintype/em/components/accordion'
import { Loader } from "@quintype/em/components/loader";
import styles from './migrator.module.css';

export default function ResultList({finalResult}) {
  //add props for accordion labels

  const errorItems = finalResult && finalResult.errors.map((error) => {
    return (
      <li>
        <span className={styles['message']}>{error.message}</span>
        {Object.values(error.metadata).map((item) => {
          return (<p className={styles['message']}>{item}</p>)
        })}
      </li>
    )
  })

  const warningItems = finalResult && finalResult.warnings.map((warning) => {
    return (
      <li>
        <span className={styles['message']}>{warning.message}</span>
        {Object.values(warning.metadata).map((item) => {
          return (<p className={styles['message']}>{item}</p>)
        })}
      </li>
    )
  })

  const successItems = finalResult && finalResult.successful.map((success) => {
    return (
      <li>
        <span className={styles['message']}>{success.message}</span>
        {Object.values(success.metadata).map((item) => {
          return (<p className={styles['message']}>{item}</p>)
        })}
      </li>
    )
  })

  return (
    <>
    {!finalResult ?
      <>
      <Loader />
        <p className={styles['content']}>
          Please wait, validation is in progress. This can take 5-10
          minutes. Please don't close the tab.
        </p>
      </>
      :
      <Accordion>
      <AccordionSection
        label='View more'
        children={
          <>
            <p>Errors</p>
            <ul className={styles['error-list']}>{errorItems}</ul>
            <p>Warnings</p>
            <ul className={styles["warning-list"]}>{warningItems}</ul>
            <p>Looking good</p>
            <ul className={styles["success-list"]}>{successItems}</ul>
          </>
        } />
      </Accordion>
      }
    </>
  );
}
