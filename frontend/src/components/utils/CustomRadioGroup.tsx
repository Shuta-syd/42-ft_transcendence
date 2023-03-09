import { FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import React from "react";

type CustomRadioGroupProps = {
  field?: any; // useFormを使用するときのfields
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
      <FormLabel>{props.label}</FormLabel>
      <RadioGroup
        row
        value={props.value}
        {...props.field}
      >
        {props.formControlLabels.map((label, idx) => (
          <FormControlLabel key={idx}  value={label} control={<Radio />} label={label} />
        ))}
      </RadioGroup>
    </>
  )
}
