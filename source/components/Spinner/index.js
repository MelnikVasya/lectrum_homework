// Core
import React from "react";

// Instruments
import Styles from "./styles.m.css";

const Spinner = ({ isSpinning }) =>
    isSpinning && <div className = { Styles.spinner } />;

export default Spinner;
