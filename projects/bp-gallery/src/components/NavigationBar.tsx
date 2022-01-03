import { Icon } from '@mui/material';
import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import './NavigationBar.scss';
import { Location } from 'history';

export interface NavigationElement {
  name: string;
  icon: string;
  target: string | ((previousLocation: Location) => { pathname: string; hash: string; state: any });
  isActive?: () => boolean;
  replace?: boolean;
}

export interface NavigationProps {
  elements?: NavigationElement[];
}

const NavigationBar = (props: NavigationProps) => {
  return (
    <div className='nav-bar'>
      {props.elements?.map(element => {
        const navLinkProps: NavLinkProps = {
          to: element.target,
          replace: element.replace ?? false,
          className: 'nav-element',
          isActive: !!element.isActive,
        };
        return (
          <NavLink {...navLinkProps} key={element.name}>
            <Icon>{element.icon}</Icon>
            <span className='nav-element-title'>{element.name}</span>
          </NavLink>
        );
      })}
    </div>
  );
};

export default NavigationBar;
