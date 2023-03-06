import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import React from "react";

export default function CustomRadioGroup() {
  return (
    <>
      <FormControl>
        <FormLabel>Channel Type</FormLabel>
        <RadioGroup
          row
        >
          <FormControlLabel value={"Public"} control={<Radio />} label="Public"/>
          <FormControlLabel value={"Protected"} control={<Radio />} label="Protected"/>
          <FormControlLabel value={"Private"} control={<Radio />} label="Private"/>
        </RadioGroup>
      </FormControl>
    </>
  )
}
