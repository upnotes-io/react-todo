import React from 'react';
import checkclasses from './checkbox.module.css'

export default function Checkbox() {
    return (
        <div className={checkclasses.checkbox__circle}>
      <div className={checkclasses.checkbox__square}>
        <input type="checkbox" id="checkbox"/>
        <svg>
          <path
            className={checkclasses.checked}
            d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
          ></path>
          <path
            className={checkclasses.unchecked}
            d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
          ></path>
        </svg>
      </div>
    </div>
    )
}
