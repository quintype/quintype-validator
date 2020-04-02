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
        {/* <span className={styles["error-id"]}>{ids}</span> */}
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
            <ul className={styles["warning-list"]}>{errorItems}</ul>
            <p>Looking good</p>
            <ul className={styles["success-list"]}>{errorItems}</ul>
          </>
        } />
      </Accordion>
      }
    </>
  );
}
