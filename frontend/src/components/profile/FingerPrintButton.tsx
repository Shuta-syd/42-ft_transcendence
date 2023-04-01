import React from 'react';
import {IconButton} from "@mui/material";
import {Fingerprint} from "@mui/icons-material";

interface Props {
    onClick: () => void;
}

const FingerPrintButton = ({onClick}: Props) => {
    console.log("FingerPrintButton clicked");
    return (
        <div>
            <IconButton
                aria-label="fingerprint"
                color="secondary"
                onClick={onClick}
            >
                your id:
                <Fingerprint />
            </IconButton>
        </div>
    )
}

export default FingerPrintButton;
