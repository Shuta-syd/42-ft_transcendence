import { FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import React from "react";

type CustomRadioGroupProps = {
  field?: any; // useFormを使用するときのfields
  label: string;
  formControlLabels: string[];
  setType: any; // useState setter
}

/**
 * @returns formControlLabelsを展開したRadioGroupコンポーネント
 */
export default function CustomRadioGroup(props: CustomRadioGroupProps) {
  const { setType } = props;

  const handleOnChange = (value: any) => {
    setType(value);
  }

  return (
    <>
      <FormLabel>{props.label}</FormLabel>
      <RadioGroup
        row
        value={props.field.value}
        onChange={(e) => { props.field.onChange(e);  handleOnChange(e.target.value)}}
      >
        {props.formControlLabels.map((label, idx) => (
          <FormControlLabel key={idx}  value={label} control={<Radio />} label={label} />
        ))}
      </RadioGroup>
    </>
  )
}
