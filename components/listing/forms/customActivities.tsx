import React, { useState } from "react";
import { Box, Button, Chip, Input, MenuItem, Popover } from "@mui/material";

const CustomActivitySelector = ({
  data,
  value,
  onChange,
}: {
  data: string[];
  value: { type: string; durationHours: number }[];
  onChange: (activities: { type: string; durationHours: number }[]) => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (activityType: string) => {
    const exists = value.find((a) => a.type === activityType);
    if (exists) {
      // Remove activity if already selected
      onChange(value.filter((a) => a.type !== activityType));
    } else {
      // Add new activity with default durationHours
      onChange([...value, { type: activityType, durationHours: 1 }]);
    }
  };

  const handleDurationChange = (
    activityType: string,
    durationHours: number,
  ) => {
    onChange(
      value.map((a) => (a.type === activityType ? { ...a, durationHours } : a)),
    );
  };

  const isOpen = Boolean(anchorEl);

  return (
    <div className="relativeflex flex-col">
      {(isOpen || value.length > 0) && (
        <p className="absolute -top-2 left-2.5 z-50 bg-white px-0.5 text-xs text-gray-400">
          Activity Type
        </p>
      )}

      <Button
        variant="outlined"
        onClick={handleOpen}
        sx={{
          textTransform: "none",
          width: "100%",
          border: isOpen ? "2px solid #0891b2" : "1px solid #d1d5db",
          borderRadius: "4px",
          padding: "10px 14px",
          backgroundColor: "white",
          "&:hover": {
            borderColor: "#d1d5db",
          },
          "&.Mui-focused": {
            borderColor: "#0891b2",
            borderWidth: "2px",
          },
          justifyContent: "start",
          minHeight: "2.75rem",
          color: value.length > 0 ? "#1f2937" : "#6b7280",
        }}
      >
        {value.length > 0
          ? value.map((a) => `${a.type} (${a.durationHours} hrs)`).join(", ")
          : isOpen
          ? ""
          : "Activity Type"}
      </Button>
      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            width: anchorEl ? anchorEl.offsetWidth : "auto",
          },
        }}
      >
        <Box sx={{ maxHeight: 400, overflowY: "auto", p: 1 }}>
          {data.map((activity) => {
            const selected = value.find((a) => a.type === activity);

            return (
              <Box
                key={activity}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1,
                  gap: 2,
                }}
              >
                <MenuItem
                  onClick={() => handleSelect(activity)}
                  sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: selected ? "#e0f2fe" : "transparent",
                  }}
                >
                  <span>{activity}</span>
                  {selected && <Chip label="Selected" size="small" />}
                </MenuItem>
                {selected && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Input
                      value={selected.durationHours}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value >= 0) {
                          handleDurationChange(activity, value);
                        }
                      }}
                      inputProps={{ min: 0.5 }}
                      startAdornment={
                        <span
                          style={{
                            fontSize: "0.875rem",
                            color: "#6b7280",
                            marginRight: "4px",
                          }}
                        >
                          hrs
                        </span>
                      }
                      sx={{
                        width: 100,
                        textAlign: "center",
                        "& .MuiInputAdornment-root": {
                          marginRight: "4px",
                        },
                      }}
                    />
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </Popover>
    </div>
  );
};

export default CustomActivitySelector;
