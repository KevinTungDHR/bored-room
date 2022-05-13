import React from 'react';
import { Card } from './card';

const GridRow = ({ setChosenRow, row, idx }) => {
  

  return (
    <div onClick={() => setChosenRow(idx)} className='row-container'>
      {[0, 1, 2, 3, 4, 5].map((i) => {
          return <Card card={row[i]} type={{value: 'row'}} index={i} key={i} />
      })}
    </div>
  )
}

export default GridRow;

// assets.rows[0][0] = card
// assets.rows[0].length = card