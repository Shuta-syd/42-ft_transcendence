import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import React from "react";

type CustomRadioGroupProps = {
  label: string;
  fromControlLabels: string[];
}

export default function CustomRadioGroup(props: CustomRadioGroupProps) {
  return (
    <>
      <FormControl>
        <FormLabel>{props.label}</FormLabel>
        <RadioGroup
          row
        >
          {props.fromControlLabels.map((label, idx) => (
            <FormControlLabel key={idx}  value={label} control={<Radio />} label={label} />
          ))}
        </RadioGroup>
      </FormControl>
    </>
  )
}
