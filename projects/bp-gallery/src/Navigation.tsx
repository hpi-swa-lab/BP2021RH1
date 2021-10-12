import { Home } from "@mui/icons-material";
import React from "react";
import { Link, NavLink } from "react-router-dom";

import './Navigation.scss';

const Navigation = () => (
  <div className='navbar'>
    <ul>
      <li>
        <NavLink exact={true} activeClassName='selected' to='/'><Home></Home></NavLink>
      </li>
      <li>
        <NavLink activeClassName='selected' to='/prototypes/demo'>Demo</NavLink>
      </li>
    </ul>
  </div>
);

export default Navigation;
