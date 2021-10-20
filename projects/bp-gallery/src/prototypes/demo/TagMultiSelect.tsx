import React from "react";
import { MenuItem, TextField } from "@mui/material";

const TagMultiSelect = ({ values, selectedValues, onValueChange, onSelectClose, label = "", disabled = false }) => (
  <TextField
    select
    SelectProps={{ multiple: true, onClose: onSelectClose }}
    disabled={ disabled }
    label={ label }
    value={ selectedValues }
    onChange={ (evt) => onValueChange(evt.target.value)}
  >
    {
      values.map(value =>
        <MenuItem
          key={ value.id }
          value={ value }
          divider
        >
          { value.name }
        </MenuItem>
      )
    }
  </TextField>
);

export default TagMultiSelect;
