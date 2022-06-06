import React from 'react';

const Die = ({ value }) => {
  return(
    <div className='face'>
      {Array(value)
				.fill(0)
				.map((_, i) => <span className='pip' key={i} />)}
    </div>
  )
}

export default Die;