import { Box } from "@mui/material";
import { getCountryIso2 } from "constants/countryFlags";

interface CountryFlagProps {
  country: string | null | undefined;
  /** flag width in px (height keeps 4:3 ratio) */
  width?: number;
}

const CountryFlag = ({ country, width = 22 }: CountryFlagProps) => {
  const iso2 = getCountryIso2(country);
  const height = Math.round((width * 3) / 4);

  if (!iso2) {
    // Neutral placeholder when we don't have a flag mapping
    return (
      <Box
        sx={{
          width,
          height,
          borderRadius: "2px",
          backgroundColor: "#E2E8F0",
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <Box
      component="img"
      src={`https://flagcdn.com/w40/${iso2}.png`}
      srcSet={`https://flagcdn.com/w80/${iso2}.png 2x`}
      alt={country ?? iso2}
      loading="lazy"
      sx={{
        width,
        height,
        objectFit: "cover",
        borderRadius: "2px",
        flexShrink: 0,
        boxShadow: "0 0 0 1px rgba(0,0,0,0.06)",
      }}
    />
  );
};

export default CountryFlag;
