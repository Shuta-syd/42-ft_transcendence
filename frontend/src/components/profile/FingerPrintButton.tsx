import React from 'react';
import {IconButton} from "@mui/material";
import {Fingerprint} from "@mui/icons-material";

interface Props {
    onClick: () => void;
}

function FingerPrintButton({ onClick }: Props) {
  return (
    <div
    style={{
        display: "flex",
        justifyContent: "right",
        alignItems: "right",
        marginTop: "-50px",
}}
>
    <h2
        style={{
            color: "purple",
        }}
    >
        {"YOUR ID => "}
    </h2>
    <IconButton
        aria-label="fingerprint"
        color="secondary"
        onClick={onClick}
    >
        <Fingerprint />
    </IconButton>
</div>
  )
}

export default FingerPrintButton;
