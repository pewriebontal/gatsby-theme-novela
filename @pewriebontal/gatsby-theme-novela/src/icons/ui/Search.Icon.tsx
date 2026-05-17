import React from 'react';

import { Icon } from '@types';

const SearchIcon: Icon = ({ fill = '#08080B' }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.75 18.5C15.0302 18.5 18.5 15.0302 18.5 10.75C18.5 6.46979 15.0302 3 10.75 3C6.46979 3 3 6.46979 3 10.75C3 15.0302 6.46979 18.5 10.75 18.5Z"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.25 16.25L21 21"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SearchIcon;
