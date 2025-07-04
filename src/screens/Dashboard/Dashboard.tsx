import React from 'react';
import { View } from 'react-native';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
// import SvgWardSvg4 from './src/svg/WardSvg4';
import WardScreen3 from '../../screens/WardScreen3';
import HomeScreen from './HomeScreen';
export default function Dashboard() {
    return (
       <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {/* <ReactNativeZoomableView
            maxZoom={2.5}
            minZoom={0.5}
            zoomEnabled={true}
            bindToBorders={true}
            style={{ flex: 1 }}
        >
            <HomeScreen/>
        </ReactNativeZoomableView> */}
        <HomeScreen/>
       </View>
    );
}