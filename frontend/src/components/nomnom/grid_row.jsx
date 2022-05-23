import React, { useEffect } from 'react';
import { Card } from './card';

const GridRow = ({ setChosenRow, chosenRow, handleUpdate, row, idx }) => {
  // useEffect(() => {
  //   if (typeof chosenRow === 'undefined') {
  //     debugger
  //     return
  //   }
  //   debugger
  //   handleUpdate()
  // }, [chosenRow])

  return (
    <div onClick={() => setChosenRow(idx)} className='row-container'>
      {[0, 1, 2, 3, 4, 5].map((i) => {
          return <Card card={row[i]} type={{value: 'row'}} index={i} key={i} />
      })}
    </div>
  )
}

export default GridRow;
