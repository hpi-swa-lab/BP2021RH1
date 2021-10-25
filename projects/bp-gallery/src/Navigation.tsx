import React from "react";
import { NavLink } from "react-router-dom";
import { Home } from "@mui/icons-material";

import "./Navigation.scss";

const ACTIVE_LINK_CLASS_NAME: string = "selected";

const Navigation = () => (
  <div className="navbar">
    <div className='logo'>
      <img src='/bad-harzburg-stiftung-logo.png'/>
    </div>
    <ul>
      <li>
        <NavLink exact to="/" activeClassName={ ACTIVE_LINK_CLASS_NAME }>
          <Home />
        </NavLink>
      </li>
      <li>
        <NavLink to="/prototypes/demo" activeClassName={ ACTIVE_LINK_CLASS_NAME }>
          Demo 1
        </NavLink>
      </li>
      <li>
        <NavLink to="/prototypes/timeline-demo" activeClassName={ ACTIVE_LINK_CLASS_NAME }>
          Demo 2
        </NavLink>
      </li>
    </ul>
  </div>
);

export default Navigation;
