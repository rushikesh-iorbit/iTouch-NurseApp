import React from 'react';
import { Circle, Text as SvgText } from 'react-native-svg';

export const Nurse = ({ nurse, color }: any) => (
  <>
    <Circle cx={nurse.cx} cy={nurse.cy} r={28} fill={color || '#ccc'} />
    <SvgText
      x={nurse.cx - 18}
      y={nurse.cy + 5}
      fontSize="12"
      fill="black"
    >{nurse.name}</SvgText>
  </>
);