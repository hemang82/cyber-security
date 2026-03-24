"use client";

import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import dayjs, { Dayjs } from "dayjs";
import { useTheme } from "@/context/ThemeContext";

interface MUIDatePickerProps {
    label?: string;
    value: string | null;
    onChange: (formattedValue: string) => void;
    minDate?: Date;
}

/**
 * MUIDatePicker Component
 * 
 * A high-fidelity Date and Time picker following Material UI design patterns as requested.
 * It integrates with the project's existing dark/light theme context.
 */
export default function MUIDatePicker({ label, value, onChange, minDate }: MUIDatePickerProps) {
    const { theme: projectTheme } = useTheme();

    // Sync MUI internal theme with our project's dark/light state
    const muiTheme = createTheme({
        palette: {
            mode: projectTheme === "dark" ? "dark" : "light",
            primary: {
                main: "#465fff", // Match project brand color
            },
            background: {
                paper: projectTheme === "dark" ? "#1e293b" : "#ffffff",
                default: projectTheme === "dark" ? "#0f172a" : "#ffffff",
            }
        },
        typography: {
            fontFamily: "inherit", // Inherit Outfit font from layout
        },
    });

    const handleDateChange = (newValue: Dayjs | null) => {
        if (newValue) {
            // Using the project's consistent format
            onChange(newValue.format("DD-MM-YYYY HH:mm:ss"));
        }
    };

    return (
        <ThemeProvider theme={muiTheme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="w-full">
                    <DateTimePicker
                        label={label || "Schedule Scan"}
                        value={value ? dayjs(value, "DD-MM-YYYY HH:mm:ss") : null}
                        onChange={handleDateChange}
                        minDateTime={minDate ? dayjs(minDate) : undefined}
                        format="DD/MM/YYYY hh:mm A"
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                size: "small",
                                sx: {
                                    // Custom styling to fit the project's form aesthetic
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "12px",
                                        height: '44px',
                                        fontSize: '14px',
                                        backgroundColor: projectTheme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.01)",
                                        "& fieldset": {
                                            borderColor: projectTheme === "dark" ? "#334155" : "#e2e8f0",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#465fff",
                                        },
                                    },
                                    "& .MuiInputLabel-root": {
                                        fontSize: '13px',
                                        top: '-4px'
                                    }
                                }
                            },
                            popper: {
                                sx: {
                                    // Style the popup picker to match premium look
                                    "& .MuiPaper-root": {
                                        borderRadius: "16px",
                                        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                                        border: projectTheme === "dark" ? "1px solid #334155" : "1px solid #f1f5f9",
                                    }
                                }
                            }
                        }}
                    />
                </div>
            </LocalizationProvider>
        </ThemeProvider>
    );
}
