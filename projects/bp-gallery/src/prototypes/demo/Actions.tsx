import React from "react";
import { Button } from "@mui/material";
import { Login, Logout, Panorama } from "@mui/icons-material";

const Actions = ({ loggedIn, onLogin , onLogout, pictureLoadDisabled, onPictureLoad }) => (
  <div className="actions">
    { !loggedIn && <Button variant="contained" onClick={ onLogin } startIcon={<Login />}>Log In</Button> }
    { loggedIn && <Button variant="contained" onClick={ onLogout } startIcon={<Logout />}>Log Out</Button> }
    {
      loggedIn &&
        <Button
          disabled={ pictureLoadDisabled }
          variant="outlined"
          onClick={ onPictureLoad }
          startIcon={<Panorama />}
        >
          Reload Pictures
        </Button>
    }
  </div>
);

export default Actions;
