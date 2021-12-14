import { Icon } from '@mui/material';
import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavigationBar.scss';

export interface NavigationElement {
  name: string;
  icon: string;
  target: any;
}

export interface NavigationProps {
  elements?: NavigationElement[];
}

const NavigationBar = (props: NavigationProps) => {
  return (
    <div className='nav-bar'>
      {props.elements?.map(element => (
        <NavLink
          to={element.target}
          activeClassName='active'
          key={element.name}
          className='nav-element'
        >
          <Icon>{element.icon}</Icon>
          <span className='nav-element-title'>{element.name}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default NavigationBar;
