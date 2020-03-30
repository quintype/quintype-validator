import React from "react";
import { Accordion, AccordionSection } from '@quintype/em/components/accordion'

export default function ResultList({finalResult}) {
  const errItems = finalResult.map((line) => {
    const [msg, ids] = line.split('\t')
    return (
      <li>
        <p>{msg}</p>
        <p>{ids}</p>
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
              <ul>{errItems}</ul>
              <p>Warnings</p>
              <ul>{errItems}</ul>
              <p>Looking good</p>
              <ul>{errItems}</ul>
            </>
          } />
          <AccordionSection
          label='Sub'
          children={
            <>
              <p>Errors</p>
              <ul>{errItems}</ul>
              <p>Warnings</p>
              <ul>{errItems}</ul>
              <p>Looking good</p>
              <ul>{errItems}</ul>
            </>
          } />
      </Accordion>
    </>
  );
}
  