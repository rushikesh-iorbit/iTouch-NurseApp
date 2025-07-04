// screens/WardScreen.tsx
import React, { useState } from 'react';
import SvgWardSvg4 from '../svg/WardSvg4';

// import { WithColorPicker } from '../components/WithColorPickerProps';
import { WithColorPicker } from '../components/WithColorPicker';
import SvgWardSvg5 from '../svg2/WardSvg5';

const WardScreen = () => {
  const [colorMap, setColorMap] = useState<Record<string, string>>({});

  return (
    <WithColorPicker>
      <SvgWardSvg5
        colorMap={colorMap}
        width={300}
        height={300}
        selectedId={null}
        selectionMode="color"
      />
    </WithColorPicker>
  );
};

export default WardScreen;