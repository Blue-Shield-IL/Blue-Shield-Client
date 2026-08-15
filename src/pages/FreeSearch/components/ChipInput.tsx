import { useState, type KeyboardEvent } from "react";
import { Box, InputBase, Typography } from "@mui/material";

interface ChipInputProps {
  placeholder: string;
  values: string[];
  onChange: (values: string[]) => void;
}

const ChipInput = ({ placeholder, values, onChange }: ChipInputProps) => {
  const [draft, setDraft] = useState("");

  const addChip = () => {
    const v = draft.trim();
    if (v && !values.includes(v)) {
      onChange([...values, v]);
    }
    setDraft("");
  };

  const removeChip = (chip: string) => {
    onChange(values.filter(c => c !== chip));
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addChip();
    } else if (e.key === "Backspace" && !draft && values.length) {
      removeChip(values[values.length - 1]);
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 0.6,
        backgroundColor: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderRadius: "10px",
        px: 1.2,
        py: 0.8,
        minHeight: 44,
        transition: "border-color 0.15s",
        "&:focus-within": {
          borderColor: "#2563EB",
          boxShadow: "0 0 0 3px rgba(37,99,235,0.1)",
        },
      }}
    >
      {values.map(chip => (
        <Box
          key={chip}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            backgroundColor: "#EFF6FF",
            color: "#2563EB",
            borderRadius: "6px",
            px: 0.8,
            py: 0.2,
            fontSize: "12px",
            fontWeight: 500,
          }}
        >
          {chip}
          <Box
            component="span"
            onClick={() => removeChip(chip)}
            sx={{
              cursor: "pointer",
              fontSize: "14px",
              lineHeight: 1,
              color: "#60A5FA",
              "&:hover": { color: "#1E3A8A" },
            }}
          >
            ×
          </Box>
        </Box>
      ))}
      <InputBase
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={handleKey}
        onBlur={addChip}
        placeholder={values.length ? "" : placeholder}
        sx={{ flex: 1, minWidth: 60, fontSize: "14px" }}
      />
      <Typography
        onClick={addChip}
        sx={{
          color: "#9CA3AF",
          fontSize: "18px",
          cursor: "pointer",
          px: 0.5,
          "&:hover": { color: "#2563EB" },
        }}
      >
        +
      </Typography>
    </Box>
  );
};

export default ChipInput;
