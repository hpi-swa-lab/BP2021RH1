import { Icon } from '@mui/material';
import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavigationBar.scss';

export interface NavigationElement {
  name: string;
  icon: string;
  target: string;
}

export interface NavigationProps {
  elements?: NavigationElement[];
}

const NavigationBar = (props: NavigationProps) => {
  return (
    <div className='nav-bar'>
      {props.elements?.map(prop => {
        return (
          <NavLink
            to={prop.target}
            activeClassName='active'
            key={prop.name}
            className='nav-element'
          >
            <Icon>{prop.icon}</Icon>
            <span className='nav-element-title'>{prop.name}</span>
          </NavLink>
        );
      })}
    </div>
  );
};

export default NavigationBar;
