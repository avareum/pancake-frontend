import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Logo: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 217 146" {...props}>
      <defs>
        <linearGradient x1="98.003%" y1="0%" x2="98.496%" y2="100%" id="a">
          <stop stopColor="#B45746" offset="0%" />
          <stop stopColor="#C67261" offset="18.714%" />
          <stop stopColor="#DB9587" offset="50.779%" />
          <stop stopColor="#C67261" offset="82.693%" />
          <stop stopColor="#B45746" offset="100%" />
        </linearGradient>
        <linearGradient x1="99.491%" y1="2.429%" x2="100%" y2="97.571%" id="b">
          <stop stopColor="#B45746" offset="0%" />
          <stop stopColor="#C67261" offset="18.714%" />
          <stop stopColor="#DB9587" offset="50.779%" />
          <stop stopColor="#C67261" offset="82.693%" />
          <stop stopColor="#B45746" offset="100%" />
        </linearGradient>
      </defs>
      <g fill="none" fillRule="evenodd">
        <path fill="url(#a)" d="m217 0-73.883 132L87 27.187l16.513-.017 44.253 84.956L210.726 0z" />
        <path fill="#503D63" d="M77 132.794 134.746 27 191 132.555l-16.558.014-44.827-85.829L82.817 133z" />
        <path fill="url(#b)" d="M0 145.808 65.875 27 99.59 90.039 122 131.96l-16.512.018-44.739-85.346L5.806 146z" />
      </g>
    </Svg>
  );
};

export default Logo;
