// screens/WardScreen.tsx
import React, { useState } from 'react';
import SvgWardSvg4 from '../svg/WardSvg4';

// import { WithColorPicker } from '../components/WithColorPickerProps';
import { WithColorPicker } from '../components/WithColorPicker';

const WardScreen = () => {
  const [colorMap, setColorMap] = useState<Record<string, string>>({});

  return (
    <WithColorPicker>
      <SvgWardSvg4 
        colorMap={colorMap}
        onColorChange={(id, color) => {
          setColorMap(prev => ({ ...prev, [id]: color }));
        }}
        width={300}
        height={300}
        selectedId={null}
        selectionMode="color"
      />
    </WithColorPicker>
  );
};

export default WardScreen;