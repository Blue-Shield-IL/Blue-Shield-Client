import type { SVGProps } from "react";

interface LogoProps extends SVGProps<SVGSVGElement> {
  strokeOpacity?: number | string;
}

const Logo = ({ strokeOpacity, strokeWidth = 1.5, ...props }: LogoProps) => (
  <svg viewBox="0 0 32 32" fill="none" {...props}>
    <path
      d="M16 3L5 7.5v8.5c0 7.5 11 13 11 13s11-5.5 11-13V7.5L16 3z"
      stroke="white"
      strokeWidth={strokeWidth}
      fill="none"
      opacity={strokeOpacity}
    />
    <clipPath id="leftHalfLogo">
      <rect x="5" y="3" width="11" height="26" />
    </clipPath>
    <path
      d="M16 3L5 7.5v8.5c0 7.5 11 13 11 13s11-5.5 11-13V7.5L16 3z"
      fill="white"
      clipPath="url(#leftHalfLogo)"
    />
  </svg>
);

export default Logo;
