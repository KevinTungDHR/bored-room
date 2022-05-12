import React from 'react';
import { Card } from './card';

const GridRow = (row) => {
  return (
    <div className='row-container'>
      {[0, 1, 2, 3].map((idx) => {
          return Card(row[idx])
      })}
    </div>
  )
}

export default GridRow;

// assets.rows[0][0] = card
// assets.rows[0].length = card