// svg/WardSvg4.tsx
import React from 'react';
import Svg, { Path, Text, Circle, Rect } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

interface WardSvgProps extends SvgProps {
  colorMap: Record<string, string>;
  currentColor?: string;
  onElementPress?: (id: string) => void;
  onColorChange?: (id: string, color: string) => void;
  width: number;
  height: number;
  selectedId: string | null;
  selectionMode: 'color' | 'element';
}


const SvgWardSvg4: React.FC<WardSvgProps> = ({ 
  colorMap = {}, 
  onElementPress,
  width, 
  height,
  selectedId,
  selectionMode,
  ...props 
}) => {
  const renderBed = (x: number, y: number, id: string, label: string) => {
    const isSelected = selectedId === id;
    const strokeColor = isSelected ? '#ff0000' : '#000';
    const strokeWidth = isSelected ? 3 : 1;
    
    return (
      <>
        <Path
          id={id}
          fill={colorMap[id] || '#e0f7fa'}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          d={`M${x} ${y}h50v100h-50z`}
          onPress={() => onElementPress?.(id)}
        />
        <Rect 
          width={40} 
          height={15} 
          x={x + 5} 
          y={y + 10} 
          fill="#fff8e1" 
          rx={3} 
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        <Text x={x + 5} y={y - 5} fontSize={12} fontWeight={isSelected ? 'bold' : 'normal'}>
          {label}
        </Text>
        {isSelected && (
          <Rect
            x={x - 5}
            y={y - 5}
            width={60}
            height={110}
            fill="none"
            stroke="#ff0000"
            strokeWidth={2}
            strokeDasharray="4 2"
          />
        )}
      </>
    );
  };

  const renderNurse = (cx: number, cy: number, id: string, label: string) => {
    const isSelected = selectedId === id;
    const strokeColor = isSelected ? '#ff0000' : '#000';
    const strokeWidth = isSelected ? 3 : 1;
    
    return (
      <>
        <Circle
          id={id}
          cx={cx}
          cy={cy}
          r={20}
          fill={colorMap[id] || '#ccc'}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          onPress={() => onElementPress?.(id)}
        />
        <Text 
          x={cx - 15} 
          y={cy + 5} 
          fontSize={10} 
          fontWeight={isSelected ? 'bold' : 'normal'}
        >
          {label}
        </Text>
        {isSelected && (
          <Circle
            cx={cx}
            cy={cy}
            r={25}
            fill="none"
            stroke="#ff0000"
            strokeWidth={2}
            strokeDasharray="4 2"
          />
        )}
      </>
    );
  };

  return (
    <Svg width={width} height={height} viewBox="0 0 1000 600" {...props}>
      {/* Outer Border */}
      <Path fill="#f9f9f9" stroke="#000" strokeWidth={2} d="M10 10h980v580H10z" />

      {/* Door */}
      <Path fill="#8B4513" d="M10 270h30v80H10z" />
      <Text x={1} y={318} fill="#fff" fontSize={16} transform="rotate(-90 12 305)">
        {'Door'}
      </Text>

      {/* Nursing Station */}
      <Path fill="#cce5ff" stroke="#000" d="M850 230h120v150H850z" />
      <Text x={875} y={270} fontSize={12}>
        {'Nursing Station'}
      </Text>

      {/* Nurses */}
      {renderNurse(880, 320, 'nurse-1', 'Nurse 1')}
      {renderNurse(940, 320, 'nurse-2', 'Nurse 2')}

      {/* Partition Lines */}
      <Path stroke="#000" strokeDasharray={4} d="M40 145h920" />
      <Path stroke="#000" strokeDasharray={4} d="M40 455h920" />
      <Path stroke="#000" strokeDasharray={4} d="M150 30v115" />
      <Path stroke="#000" strokeDasharray={4} d="M290 30v115" />
      <Path stroke="#000" strokeDasharray={4} d="M430 30v115" />
      <Path stroke="#000" strokeDasharray={4} d="M570 30v115" />
      <Path stroke="#000" strokeDasharray={4} d="M710 30v115" />
      <Path stroke="#000" strokeDasharray={4} d="M150 455v115" />
      <Path stroke="#000" strokeDasharray={4} d="M290 455v115" />
      <Path stroke="#000" strokeDasharray={4} d="M430 455v115" />
      <Path stroke="#000" strokeDasharray={4} d="M570 455v115" />
      <Path stroke="#000" strokeDasharray={4} d="M710 455v115" />

      {/* Beds Top (1–6) */}
      {[
        { x: 60, id: 'bed-1', label: 'Bed 1' },
        { x: 200, id: 'bed-2', label: 'Bed 2' },
        { x: 340, id: 'bed-3', label: 'Bed 3' },
        { x: 480, id: 'bed-4', label: 'Bed 4' },
        { x: 620, id: 'bed-5', label: 'Bed 5' },
        { x: 760, id: 'bed-6', label: 'Bed 6' },
      ].map(bed => renderBed(bed.x, 30, bed.id, bed.label))}

      {/* Beds Bottom (7–12) */}
      {[
        { x: 60, id: 'bed-7', label: 'Bed 7' },
        { x: 200, id: 'bed-8', label: 'Bed 8' },
        { x: 340, id: 'bed-9', label: 'Bed 9' },
        { x: 480, id: 'bed-10', label: 'Bed 10' },
        { x: 620, id: 'bed-11', label: 'Bed 11' },
        { x: 760, id: 'bed-12', label: 'Bed 12' },
      ].map(bed => renderBed(bed.x, 470, bed.id, bed.label))}
    </Svg>
  );
};

export default SvgWardSvg4;