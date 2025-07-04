import * as React from 'react';
import Svg, {Defs, G, Rect} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: title, desc */
import type {SvgProps} from 'react-native-svg';
const SvgTrial = (props: SvgProps) => (
  <Svg
    width="48px"
    height="1px"
    viewBox="0 0 48 1"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}>
    <Defs />
    <G stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
      <G transform="translate(-129.000000, -156.000000)" fill="#063855">
        <G transform="translate(80.000000, 0.000000)">
          <G transform="translate(0.000000, 64.000000)">
            <G transform="translate(24.000000, 56.000000)">
              <G>
                <Rect x={25} y={36} width={48} height={1} />
              </G>
            </G>
          </G>
        </G>
      </G>
    </G>
  </Svg>
);
export default SvgTrial;
