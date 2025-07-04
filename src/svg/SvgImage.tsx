import * as React from 'react';
import Svg, {Rect, Text, Circle} from 'react-native-svg';
import type {SvgProps} from 'react-native-svg';
const SvgSvgImage = (props: SvgProps) => (
  <Svg viewBox="0 0 1000 600" {...props}>
    <Rect
      x={10}
      y={10}
      width={980}
      height={580}
      fill="#f9f9f9"
      stroke="black"
      strokeWidth={2}
    />
    <Rect x={10} y={270} width={20} height={60} fill="#8B4513" />
    <Text
      x={12}
      y={305}
      fontSize={12}
      fill="white"
      transform="rotate(-90 12,305)">
      {'Door'}
    </Text>
    <Rect
      x={400}
      y={200}
      width={200}
      height={200}
      fill="#cce5ff"
      stroke="black"
    />
    <Text x={440} y={220} fontSize={16} fill="black">
      {'Nursing Station'}
    </Text>
    <Circle cx={430} cy={270} r={15} fill="#ff9999" />
    <Text x={420} y={275} fontSize={10} fill="black">
      {'Nurse A'}
    </Text>
    <Circle cx={480} cy={270} r={15} fill="#99ff99" />
    <Text x={470} y={275} fontSize={10} fill="black">
      {'Nurse B'}
    </Text>
    <Circle cx={530} cy={270} r={15} fill="#9999ff" />
    <Text x={520} y={275} fontSize={10} fill="black">
      {'Nurse C'}
    </Text>
    <Circle cx={455} cy={320} r={15} fill="#ffff99" />
    <Text x={445} y={325} fontSize={10} fill="black">
      {'Nurse D'}
    </Text>
    <Circle cx={505} cy={320} r={15} fill="#ff99ff" />
    <Text x={495} y={325} fontSize={10} fill="black">
      {'Nurse E'}
    </Text>
    <Rect x={150} y={30} width={60} height={30} fill="#ffcccc" stroke="black" />
    <Text x={160} y={50} fontSize={12}>
      {'Bed 1'}
    </Text>
    <Rect x={250} y={30} width={60} height={30} fill="#ffcccc" stroke="black" />
    <Text x={260} y={50} fontSize={12}>
      {'Bed 2'}
    </Text>
    <Rect x={350} y={30} width={60} height={30} fill="#ccffcc" stroke="black" />
    <Text x={360} y={50} fontSize={12}>
      {'Bed 3'}
    </Text>
    <Rect x={550} y={30} width={60} height={30} fill="#ccffcc" stroke="black" />
    <Text x={560} y={50} fontSize={12}>
      {'Bed 4'}
    </Text>
    <Rect x={650} y={30} width={60} height={30} fill="#ccccff" stroke="black" />
    <Text x={660} y={50} fontSize={12}>
      {'Bed 5'}
    </Text>
    <Rect
      x={920}
      y={100}
      width={30}
      height={60}
      fill="#ccccff"
      stroke="black"
    />
    <Text x={960} y={130} fontSize={12}>
      {'Bed 6'}
    </Text>
    <Rect
      x={920}
      y={180}
      width={30}
      height={60}
      fill="#ffffcc"
      stroke="black"
    />
    <Text x={960} y={210} fontSize={12}>
      {'Bed 7'}
    </Text>
    <Rect
      x={920}
      y={260}
      width={30}
      height={60}
      fill="#ffffcc"
      stroke="black"
    />
    <Text x={960} y={290} fontSize={12}>
      {'Bed 8'}
    </Text>
    <Rect
      x={920}
      y={340}
      width={30}
      height={60}
      fill="#ffccff"
      stroke="black"
    />
    <Text x={960} y={370} fontSize={12}>
      {'Bed 9'}
    </Text>
    <Rect
      x={920}
      y={420}
      width={30}
      height={60}
      fill="#ffccff"
      stroke="black"
    />
    <Text x={960} y={450} fontSize={12}>
      {'Bed 10'}
    </Text>
    <Rect
      x={150}
      y={540}
      width={60}
      height={30}
      fill="#ffcccc"
      stroke="black"
    />
    <Text x={160} y={560} fontSize={12}>
      {'Bed 11'}
    </Text>
    <Rect
      x={250}
      y={540}
      width={60}
      height={30}
      fill="#ccffcc"
      stroke="black"
    />
    <Text x={260} y={560} fontSize={12}>
      {'Bed 12'}
    </Text>
    <Rect
      x={350}
      y={540}
      width={60}
      height={30}
      fill="#ccccff"
      stroke="black"
    />
    <Text x={360} y={560} fontSize={12}>
      {'Bed 13'}
    </Text>
    <Rect
      x={550}
      y={540}
      width={60}
      height={30}
      fill="#ffffcc"
      stroke="black"
    />
    <Text x={560} y={560} fontSize={12}>
      {'Bed 14'}
    </Text>
    <Rect
      x={650}
      y={540}
      width={60}
      height={30}
      fill="#ffccff"
      stroke="black"
    />
    <Text x={660} y={560} fontSize={12}>
      {'Bed 15'}
    </Text>
  </Svg>
);
export default SvgSvgImage;
