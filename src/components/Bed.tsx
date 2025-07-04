import React from 'react';
import { Rect, Circle, Text as SvgText } from 'react-native-svg';
import { Animated } from 'react-native';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export const Bed = ({ bed, color, isBlinking, blinkAnim }: any) => {
  const { name, x, y, vertical } = bed;
  const w = vertical ? 50 : 100;
  const h = vertical ? 100 : 50;
  const opacity = isBlinking
    ? blinkAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] })
    : 1;

  const mattressProps = {
    x: x + (vertical ? 0 : 10),
    y: y + (vertical ? 10 : 0),
    width: vertical ? w : w - 20,
    height: vertical ? h - 20 : h,
    rx: 6,
    fill: '#fff',
    stroke: color,
    strokeWidth: 3,
    opacity,
  };

  return (
    <>
      {vertical ? (
        <>
          <Rect x={x} y={y} width={w} height={10} rx={3} fill={color} opacity={0.7} />
          <Rect x={x} y={y + h - 10} width={w} height={10} rx={3} fill={color} opacity={0.7} />
        </>
      ) : (
        <>
          <Rect x={x} y={y} width={10} height={h} rx={3} fill={color} opacity={0.7} />
          <Rect x={x + w - 10} y={y} width={10} height={h} rx={3} fill={color} opacity={0.7} />
        </>
      )}

      {isBlinking ? <AnimatedRect {...mattressProps} /> : <Rect {...mattressProps} />}

      <Circle cx={x + 8} cy={y + h - 4} r={4} fill={color} opacity={0.5} />
      <Circle cx={x + w - 8} cy={y + h - 4} r={4} fill={color} opacity={0.5} />

      <SvgText
        x={x + 10}
        y={y + (vertical ? h / 2 : h + 18)}
        fontSize="14"
        fill="black"
      >{name}</SvgText>
    </>
  );
};
