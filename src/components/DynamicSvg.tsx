import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Text as SvgText, Circle, Rect, G, Line } from 'react-native-svg';
import { DOMParser } from 'xmldom';

type SvgElement = React.ReactElement<any>;

export interface DynamicSvgRef {
  getElementPositions: () => Record<string, { x: number; y: number; width: number; height: number }>;
}

interface DynamicSvgProps {
  svgXml: string;
  width?: string | number;
  height?: string | number;
  initialColor?: string;
  onElementSelected?: (id: string) => void;
  highlightedIds?: string[];
  emptybedsIds?: string[];
}

const DynamicSvg = forwardRef<DynamicSvgRef, DynamicSvgProps>(({
  svgXml,
  width = Dimensions.get('window').width,
  height = Dimensions.get('window').height,
  initialColor = '#4CAE51',
  onElementSelected,
  highlightedIds = [],
  emptybedsIds = []
}, ref) => {
  const [svgElements, setSvgElements] = useState<SvgElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [colorMap, setColorMap] = useState<Record<string, string>>({});
  const [bedPositions, setBedPositions] = useState<Record<string, { centerX: number; centerY: number }>>({});
  const elementPositionMap = useRef<Record<string, { x: number; y: number; width: number; height: number }>>({});

  useImperativeHandle(ref, () => ({
    getElementPositions: () => elementPositionMap.current
  }));

  useEffect(() => {
    const parseSvg = () => {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgXml, 'image/svg+xml');
        const svgNode = doc.getElementsByTagName('svg')[0];
        if (!svgNode) throw new Error('Invalid SVG format');

        const elements: SvgElement[] = [];
        const newBedPositions: Record<string, { centerX: number; centerY: number }> = {};

       const processNode = (node: any, parentId?: string): SvgElement | null => {
          const tagName = node.tagName?.toLowerCase();
          const id = node.getAttribute('id') || parentId;

          if (!['rect', 'circle', 'path', 'g', 'text', 'line'].includes(tagName)) return null;

          const props: any = {};
          for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i];
            props[attr.name] = attr.value;
          }

          // Handle groups separately to find first rect
          if (tagName === 'g' && id) {
            let firstRect: { x: number; y: number; width: number; height: number } | null = null;

            for (let i = 0; i < node.childNodes.length; i++) {
              const child = node.childNodes[i];
              if (child.nodeType === 1 && child.tagName?.toLowerCase() === 'rect') {
                const rectX = parseFloat(child.getAttribute('x') ?? 0);
                const rectY = parseFloat(child.getAttribute('y') ?? 0);
                const rectW = parseFloat(child.getAttribute('width') ?? 0);
                const rectH = parseFloat(child.getAttribute('height') ?? 0);
                firstRect = { x: rectX, y: rectY, width: rectW, height: rectH };
                elementPositionMap.current[id] = firstRect;
                newBedPositions[id] = {
                  centerX: rectX + rectW / 2 -15,
                  centerY: rectY + rectH / 2
                };
                break; // only first rect
              }
            }
          }

          if (id) {
            props.onPress = () => {
              setSelectedId(id);
              onElementSelected?.(id);
              setColorMap(prev => ({ ...prev, [id]: initialColor }));
            };

            const isSelected = selectedId === id;
            const isHighlighted = highlightedIds.includes(id);
            const shouldHighlight = isSelected || isHighlighted;
            const isEmptyBed = emptybedsIds.includes(id);

            const tagAffectsVisual = ['rect', 'circle', 'path', 'line'];
            if (tagAffectsVisual.includes(tagName)) {
              props.fill = shouldHighlight ? '#ffffff' : colorMap[id] || props.fill;
              props.stroke = shouldHighlight ? '#4CAE51' : props.stroke || '#000';
              props.strokeWidth = shouldHighlight ? 3 : props.strokeWidth || 1;
            }
          }

          const children: any[] = [];
          for (let i = 0; i < node.childNodes.length; i++) {
            const child = node.childNodes[i];
            if (child.nodeType === 1) {
              const childEl = processNode(child, id);
              if (childEl) children.push(childEl);
            }
          }

          switch (tagName) {
            case 'rect': return <Rect key={id} {...props} />;
            case 'circle': return <Circle key={id} {...props} />;
            case 'path': return <Path key={id} {...props} />;
            case 'g': return <G key={id} {...props}>{children}</G>;
            case 'text': return <SvgText key={id} {...props}>{node.textContent}</SvgText>;
            case 'line': return <Line key={id} {...props} />;
            default: return null;
          }
        };

        for (let i = 0; i < svgNode.childNodes.length; i++) {
          const node = svgNode.childNodes[i];
          if (node.nodeType === 1) {
            const element = processNode(node);
            if (element) elements.push(element);
          }
        }

        setBedPositions(newBedPositions);
        setSvgElements(elements);
      } catch (error) {
        console.error('Error parsing SVG:', error);
      } finally {
        setLoading(false);
      }
    };

    parseSvg();
  }, [svgXml, initialColor, selectedId, colorMap, highlightedIds, emptybedsIds]);

  const renderTransformIcons = () => {
    return emptybedsIds.map(id => {
      const position = bedPositions[id];
      if (!position) return null;

      return (
        <G key={`${id}-transform`} transform={`translate(${position.centerX},${position.centerY}) scale(1.5)`}>
          <Path 
            d="M6.41659 6.125C6.05399 6.125 5.69953 6.22764 5.39804 6.41993C5.09655 6.61222 4.86157 6.88553 4.72281 7.2053C4.58405 7.52507 4.54774 7.87694 4.61848 8.21641C4.68922 8.55587 4.86383 8.86769 5.12022 9.11244C5.37662 9.35718 5.70329 9.52385 6.05892 9.59137C6.41455 9.6589 6.78318 9.62424 7.11817 9.49179C7.45317 9.35934 7.7395 9.13503 7.94095 8.84725C8.1424 8.55946 8.24992 8.22112 8.24992 7.875M20.1666 14.875V12.25M20.1666 12.25H16.4999M20.1666 12.25V10.5C20.1666 9.80381 19.8769 9.13613 19.3611 8.64384C18.8454 8.15156 18.1459 7.875 17.4166 7.875H11.9166M1.83325 12.25H12.8333H10.9999V10.5M1.83325 7V14.875M2.74992 2.625L19.2499 18.375"
            stroke="#4CEA51"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </G>
      );
    });
  };

  if (loading) {
    return <View style={styles.container}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <Svg viewBox="0 0 1000 600" width={width} height={height}>
        {svgElements}
        {renderTransformIcons()}
      </Svg>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DynamicSvg;