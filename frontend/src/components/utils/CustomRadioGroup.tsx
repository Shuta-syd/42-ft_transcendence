import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import React from "react";

type CustomRadioGroupProps = {
  fields?: any; // useFormを使用するときのfields
  value?: any;
  label: string;
  formControlLabels: string[];
}

/**
 * @returns formControlLabelsを展開したRadioGroupコンポーネント
 */
export default function CustomRadioGroup(props: CustomRadioGroupProps) {
  return (
    <>
      <FormControl>
        <FormLabel>{props.label}</FormLabel>
        <RadioGroup
          row
          value={props.value}
        >
          {props.formControlLabels.map((label, idx) => (
            <FormControlLabel key={idx}  value={label} control={<Radio />} label={label} />
          ))}
        </RadioGroup>
      </FormControl>
    </>
  )
}
