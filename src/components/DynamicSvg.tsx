// src/components/DynamicSvg.tsx
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Text, Circle, Rect, G, Line } from 'react-native-svg';
import { DOMParser } from 'xmldom';

type SvgElement = React.ReactElement<{ 
  id?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  onPress?: () => void;
}>;

interface DynamicSvgProps {
  svgXml: string;
  width?: string | number;
  height?: string | number;
  initialColor?: string;
  onElementSelected?: (id: string) => void;
}

const DynamicSvg: React.FC<DynamicSvgProps> = ({
  svgXml,
  width = Dimensions.get('window').width,
  height = Dimensions.get('window').height,
  initialColor = '#4CAE51',
  onElementSelected,
}) => {
  const [svgElements, setSvgElements] = useState<SvgElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentColor, setCurrentColor] = useState(initialColor);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [colorMap, setColorMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const parseSvg = () => {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgXml, 'image/svg+xml');
        const svgNode = doc.getElementsByTagName('svg')[0];
        
        if (!svgNode) throw new Error('Invalid SVG format');

        const elements: SvgElement[] = [];
        const processNode = (node: any, parentId?: string): any => {
          const tagName = node.tagName?.toLowerCase();
          const id = node.getAttribute('id') || parentId;
          
          // Skip unsupported elements
          if (!['rect', 'circle', 'path', 'g', 'text', 'line'].includes(tagName)) {
            return null;
          }

          const props: any = {};
          for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i];
            props[attr.name] = attr.value;
          }

          // Handle interactivity for beds and nurses
            if (id) {
                props.onPress = () => {
                setSelectedId(id);
                onElementSelected?.(id);
                setColorMap(prev => ({
                    ...prev,
                    [id]: initialColor // Use initialColor instead of currentColor
                }));
                };
                
                props.fill = colorMap[id] || props.fill;
                props.stroke = selectedId === id ? '#4CAE51' : props.stroke || '#000';
                props.strokeWidth = selectedId === id ? 3 : props.strokeWidth || 1;
            }

          const children: any[] = [];
          for (let i = 0; i < node.childNodes.length; i++) {
            const child = node.childNodes[i];
            if (child.nodeType === 1) { // ELEMENT_NODE
              children.push(processNode(child, id));
            }
          }

          switch (tagName) {
            case 'rect': return <Rect key={id} {...props} />;
            case 'circle': return <Circle key={id} {...props} />;
            case 'path': return <Path key={id} {...props} />;
            case 'g': return <G key={id} {...props}>{children}</G>;
            case 'text': return <Text key={id} {...props}>{node.textContent}</Text>;
            case 'line': return <Line key={id} {...props} />;
            default: return null;
          }
        };

        for (let i = 0; i < svgNode.childNodes.length; i++) {
          const node = svgNode.childNodes[i];
          if (node.nodeType === 1) { // ELEMENT_NODE
            const element = processNode(node);
            if (element) elements.push(element);
          }
        }

        setSvgElements(elements);
      } catch (error) {
        console.error('Error parsing SVG:', error);
      } finally {
        setLoading(false);
      }
    };

    parseSvg();
  }, [svgXml, initialColor, selectedId, colorMap]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Svg 
        viewBox="0 0 1000 600" 
        width={width} 
        height={height}
      >
        {svgElements}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DynamicSvg;