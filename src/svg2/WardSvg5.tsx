import React from 'react';
import Svg, { Path, Text, Circle, Rect, G, Line } from 'react-native-svg';
import { ColorableSvgProps, processChildren } from '../Helper/svg-utils';
const SvgWardSvg5: React.FC<ColorableSvgProps> = props => {
  const { width, height, ...svgProps } = props;
  return (
    <Svg viewBox="0 0 1000 600" {...svgProps} {...props}>
      {processChildren(
        <Svg width={1000} height={600} {...props}>
          <Path
            fill="#f9f9f9"
            stroke="#000"
            strokeWidth={2}
            d="M10 10h980v580H10z"
          />
          <Path fill="#8B4513" d="M10 270h30v80H10z" />
          <Text
            x={1}
            y={318}
            fill="#fff"
            fontSize={16}
            transform="rotate(-90 12 305)"
          >
            {'Door'}
          </Text>
          <Path fill="#cce5ff" stroke="#000" d="M850 230h120v150H850z" />
          <Text x={875} y={270} fontSize={12}>
            {'Nursing Station'}
          </Text>
          <Circle id="nurse-1" cx={880} cy={320} r={20} fill="#ccc" />
          <Text x={865} y={325} fontSize={10}>
            {'Nurse 1'}
          </Text>
          <Circle id="nurse-2" cx={940} cy={320} r={20} fill="#ccc" />
          <Text x={925} y={325} fontSize={10}>
            {'Nurse 2'}
          </Text>
          <Path stroke="#000" strokeDasharray={4} d="M40 145h920M40 455h920" />
          <Path id="bed-1" fill="#e0f7fa" stroke="#000" d="M60 30h50v100H60z" />
          <Rect width={40} height={15} x={65} y={40} fill="#fff8e1" rx={3} />
          <Text x={65} y={25} fontSize={12}>
            {'Bed 1'}
          </Text>
          <Path
            id="bed-2"
            fill="#e0f7fa"
            stroke="#000"
            d="M200 30h50v100h-50z"
          />
          <Rect width={40} height={15} x={205} y={40} fill="#fff8e1" rx={3} />
          <Text x={205} y={25} fontSize={12}>
            {'Bed 2'}
          </Text>
          <Path
            id="bed-3"
            fill="#e0f7fa"
            stroke="#000"
            d="M340 30h50v100h-50z"
          />
          <Rect width={40} height={15} x={345} y={40} fill="#fff8e1" rx={3} />
          <Text x={345} y={25} fontSize={12}>
            {'Bed 3'}
          </Text>
          <Path
            id="bed-4"
            fill="#e0f7fa"
            stroke="#000"
            d="M480 30h50v100h-50z"
          />
          <Rect width={40} height={15} x={485} y={40} fill="#fff8e1" rx={3} />
          <Text x={485} y={25} fontSize={12}>
            {'Bed 4'}
          </Text>
          <Path
            id="bed-5"
            fill="#e0f7fa"
            stroke="#000"
            d="M620 30h50v100h-50z"
          />
          <Rect width={40} height={15} x={625} y={40} fill="#fff8e1" rx={3} />
          <Text x={625} y={25} fontSize={12}>
            {'Bed 5'}
          </Text>
          <Path
            id="bed-6"
            fill="#e0f7fa"
            stroke="#000"
            d="M760 30h50v100h-50z"
          />
          <Rect width={40} height={15} x={765} y={40} fill="#fff8e1" rx={3} />
          <Text x={765} y={25} fontSize={12}>
            {'Bed 6'}
          </Text>
          <Path
            stroke="#000"
            strokeDasharray={4}
            d="M150 30v115M290 30v115M430 30v115M570 30v115M710 30v115"
          />
          <Path
            id="bed-7"
            fill="#e0f7fa"
            stroke="#000"
            d="M60 470h50v100H60z"
          />
          <Rect width={40} height={15} x={65} y={550} fill="#fff8e1" rx={3} />
          <Text x={65} y={585} fontSize={12}>
            {'Bed 7'}
          </Text>
          <Path
            id="bed-8"
            fill="#e0f7fa"
            stroke="#000"
            d="M200 470h50v100h-50z"
          />
          <Rect width={40} height={15} x={205} y={550} fill="#fff8e1" rx={3} />
          <Text x={205} y={585} fontSize={12}>
            {'Bed 8'}
          </Text>
          <Path
            id="bed-9"
            fill="#e0f7fa"
            stroke="#000"
            d="M340 470h50v100h-50z"
          />
          <Rect width={40} height={15} x={345} y={550} fill="#fff8e1" rx={3} />
          <Text x={345} y={585} fontSize={12}>
            {'Bed 9'}
          </Text>
          <Path
            id="bed-10"
            fill="#e0f7fa"
            stroke="#000"
            d="M480 470h50v100h-50z"
          />
          <Rect width={40} height={15} x={485} y={550} fill="#fff8e1" rx={3} />
          <Text x={485} y={585} fontSize={12}>
            {'Bed 10'}
          </Text>
          <Path
            id="bed-11"
            fill="#e0f7fa"
            stroke="#000"
            d="M620 470h50v100h-50z"
          />
          <Rect width={40} height={15} x={625} y={550} fill="#fff8e1" rx={3} />
          <Text x={625} y={585} fontSize={12}>
            {'Bed 11'}
          </Text>
          <Path
            id="bed-12"
            fill="#e0f7fa"
            stroke="#000"
            d="M760 470h50v100h-50z"
          />
          <Rect width={40} height={15} x={765} y={550} fill="#fff8e1" rx={3} />
          <Text x={765} y={590} fontSize={12}>
            {'Bed 12'}
          </Text>
          <Path
            stroke="#000"
            strokeDasharray={4}
            d="M150 455v115M290 455v115M430 455v115M570 455v115M710 455v115"
          />
        </Svg>,
        props,
      )}
    </Svg>
  );
};
export default SvgWardSvg5;
