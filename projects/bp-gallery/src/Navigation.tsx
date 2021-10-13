import React from "react";
import { NavLink } from "react-router-dom";
import { Home } from "@mui/icons-material";

import "./Navigation.scss";

const ACTIVE_LINK_CLASS_NAME: string = "selected";

const Navigation = () => (
  <div className="navbar">
    <ul>
      <li>
        <NavLink exact to="/" activeClassName={ ACTIVE_LINK_CLASS_NAME }>
          <Home />
        </NavLink>
      </li>
      <li>
        <NavLink to="/prototypes/demo" activeClassName={ ACTIVE_LINK_CLASS_NAME }>
          Demo
        </NavLink>
      </li>
    </ul>
  </div>
);

export default Navigation;
