import React, { useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';
import { Item } from '../context/ProfileContext';

type Props = {
  items: Item[];
  spinTrigger: number;
  onFinish?: (winner: string) => void;
};

const { width } = Dimensions.get('window');
const size = width - 40;
const radius = size / 2;

const AnimatedView = Animated.createAnimatedComponent(View);

export default function Wheel({
  items,
  spinTrigger,
  onFinish,
}: Props) {
  const rotation = useSharedValue(0);
  const isSpinning = useRef(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const totalWeight =
    items.length > 0
      ? items.reduce((sum, item) => sum + item.weight, 0)
      : 0;

  const weightedRandom = () => {
    let random = Math.random() * totalWeight;
    for (let i = 0; i < items.length; i++) {
      if (random < items[i].weight) return i;
      random -= items[i].weight;
    }
    return 0;
  };

  const spin = () => {
    if (!items || items.length === 0 || isSpinning.current) return;

    isSpinning.current = true;
    const selectedIndex = weightedRandom();
    
    // Optisch sind alle Segmente gleich groß
    const segmentAngle = 360 / items.length;
    
    // Wir berechnen, wo das Segment landen muss, damit es oben (270 Grad / 12 Uhr) stoppt
    // Die Formel: Aktuelle Drehung + Puffer + (Ziel-Offset)
    const extraSpins = 360 * 5; // 5 volle Umdrehungen
    const stopAngle = 270 - (selectedIndex * segmentAngle + segmentAngle / 2);
    
    // Wir addieren auf den aktuellen Wert drauf, damit er immer vorwärts dreht
    const newRotation = Math.ceil(rotation.value / 360) * 360 + extraSpins + (stopAngle % 360);

    rotation.value = withTiming(newRotation, {
      duration: 4000,
      easing: Easing.out(Easing.quad),
    });

    setTimeout(() => {
      isSpinning.current = false;
      if (onFinish) onFinish(items[selectedIndex].label);
    }, 4000);
  };

  useEffect(() => {
    if (spinTrigger > 0) {
      spin();
    }
  }, [spinTrigger]);

  return (
    <View style={styles.container}>
      {/* Der rote Pfeil oben */}
      <View style={styles.pointer} />

      <AnimatedView style={animatedStyle}>
        <Svg width={size} height={size}>
          {items.length === 0 ? (
            <>
              <Circle
                cx={radius}
                cy={radius}
                r={radius}
                fill="#1c1c24"
                stroke="#444"
                strokeWidth={4}
              />
              <SvgText
                x={radius}
                y={radius}
                fill="#888"
                fontSize="18"
                fontWeight="bold"
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                Keine Einträge
              </SvgText>
            </>
          ) : (
            items.map((item, index) => {
              // Optisch gleich große Segmente
              const visualSegmentAngle = 360 / items.length;
              const startAngle = index * visualSegmentAngle;
              const endAngle = (index + 1) * visualSegmentAngle;

              // SVG Pfad Berechnung
              const x1 = radius + radius * Math.cos((Math.PI * startAngle) / 180);
              const y1 = radius + radius * Math.sin((Math.PI * startAngle) / 180);
              const x2 = radius + radius * Math.cos((Math.PI * endAngle) / 180);
              const y2 = radius + radius * Math.sin((Math.PI * endAngle) / 180);

              const path = `
                M ${radius} ${radius}
                L ${x1} ${y1}
                A ${radius} ${radius} 0 0 1 ${x2} ${y2}
                Z
              `;

              const textAngle = startAngle + visualSegmentAngle / 2;
              const textRadius = radius * 0.7;
              const textX = radius + textRadius * Math.cos((Math.PI * textAngle) / 180);
              const textY = radius + textRadius * Math.sin((Math.PI * textAngle) / 180);

              return (
                <G key={index}>
                  <Path
                    d={path}
                    fill={item.color || '#333'}
                    stroke="#ffffff"
                    strokeWidth={1}
                  />
                  <SvgText
                    x={textX}
                    y={textY}
                    fill="#ffffff"
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                  >
                    {item.label}
                  </SvgText>
                </G>
              );
            })
          )}
        </Svg>
      </AnimatedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#ff0033',
    transform: [{ rotate: '180deg' }], // Zeigt nach unten auf das Rad
    zIndex: 10,
    marginBottom: -5,
  },
});