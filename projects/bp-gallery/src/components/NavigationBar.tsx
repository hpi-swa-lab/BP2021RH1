import { Icon } from '@mui/material';
import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavigationBar.scss';
import { Location } from 'history';

export interface NavigationElement {
  name: string;
  icon: string;
  target: string | ((previousLocation: Location) => { pathname: string; hash: string; state: any });
  isActive?: () => boolean;
}

export interface NavigationProps {
  elements?: NavigationElement[];
}

const NavigationBar = (props: NavigationProps) => {
  return (
    <div className='nav-bar'>
      {props.elements?.map(element =>
        element.isActive ? (
          <NavLink
            to={element.target}
            key={element.name}
            isActive={element.isActive}
            className='nav-element'
          >
            <Icon>{element.icon}</Icon>
            <span className='nav-element-title'>{element.name}</span>
          </NavLink>
        ) : (
          <NavLink to={element.target} key={element.name} className='nav-element'>
            <Icon>{element.icon}</Icon>
            <span className='nav-element-title'>{element.name}</span>
          </NavLink>
        )
      )}
    </div>
  );
};

export default NavigationBar;
