import { Step, StepLabel, Stepper } from "@mui/material";
import React from "react";

const steps = ['Enter user profile', 'Upload profile image', 'Setting 2FA'];

type SignupStepperProps = {
  activeStep: any; // useState value
}

export default function SignupStepper(props: SignupStepperProps) {
  const { activeStep } = props;

  return (
    <Stepper activeStep={activeStep}>
    {steps.map((label, idx) => (
      <Step key={idx}>
        <StepLabel>{label}</StepLabel>
      </Step>
    ))}
  </Stepper>
  )
}
