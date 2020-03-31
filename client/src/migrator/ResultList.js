import React from "react";
import { Accordion, AccordionSection } from '@quintype/em/components/accordion'
import styles from './migrator.module.css';

export default function ResultList({finalResult}) {
  const errItems = finalResult.map((line) => {
    const [msg, ids] = line.split('\t')
    return (
      <li>
        <span className={styles["error-message"]}>{msg}</span>
        <span className={styles["error-id"]}>{ids}</span>
      </li>
    )
  })

  return (
    <>
      <Accordion>
        <AccordionSection
          label='Main'
          children={
            <>
              <p>Errors</p>
              <ul className={styles["error-list"]}>{errItems}</ul>
              <p>Warnings</p>
              <ul className={styles["warning-list"]}>{errItems}</ul>
              <p>Looking good</p>
              <ul className={styles["good-list"]}>{errItems}</ul>
            </>
          } />
      </Accordion>
    </>
  );
}
