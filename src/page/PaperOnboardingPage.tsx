import React, { useMemo } from 'react';
import { Text } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import Animated, { add } from 'react-native-reanimated';
import {
  PaperOnboardingItemType,
  PaperOnboardingSafeAreaInsetsType,
  PaperOnboardingScreenDimensions,
} from '../types';
import { styles } from './styles';

const { interpolate, Extrapolate } = Animated;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface PaperOnboardingPageProps {
  index: number;
  item: PaperOnboardingItemType;
  currentIndex: Animated.Node<number>;
  animatedIndicatorsContainerPosition: Animated.Node<number>;
  indicatorSize: number;
  screenDimensions: PaperOnboardingScreenDimensions;
  safeInsets: PaperOnboardingSafeAreaInsetsType;
}

export const PaperOnboardingPage = (props: PaperOnboardingPageProps) => {
  // props
  const {
    index,
    item,
    currentIndex,
    animatedIndicatorsContainerPosition,
    indicatorSize,
    screenDimensions,
    safeInsets,
  } = props;

  // memo
  const backgroundExtendedSize = useMemo(
    () => screenDimensions.height,
    // () => 40,
    [screenDimensions]
  );
  const backgroundBottomPosition = useMemo(
    () => screenDimensions.height - indicatorSize / 2 - safeInsets.bottom,
    [screenDimensions, indicatorSize, safeInsets]
  );

  // animations
  const animatedContentOpacity = interpolate(currentIndex, {
    inputRange: [index - 0.5, index, index + 0.5],
    outputRange: [0, 1, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  const animatedContentTopPosition = interpolate(currentIndex, {
    inputRange: [index - 1, index, index + 1],
    outputRange: [
      screenDimensions.height / 8,
      0,
      (screenDimensions.height / 6) * -1,
    ],
    extrapolate: Extrapolate.CLAMP,
  });

  const animatedImageTopPosition = interpolate(currentIndex, {
    inputRange: [index - 1, index],
    outputRange: [screenDimensions.height / 8, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  const animatedBackgroundSize = interpolate(currentIndex, {
    inputRange: [index - 1, index],
    outputRange: [0, backgroundExtendedSize],
    extrapolate: Extrapolate.CLAMP,
  });

  const animatedBackgroundLeftPosition = add(
    animatedIndicatorsContainerPosition,
    indicatorSize / 2,
    index * indicatorSize
  );

  // styles
  const contentContainerStyle = useMemo(
    () => [
      styles.contentContainer,
      {
        marginTop: safeInsets.top,
        marginRight: safeInsets.right,
        marginLeft: safeInsets.left,
        marginBottom: safeInsets.bottom + indicatorSize + safeInsets.bottom,
        opacity: animatedContentOpacity,
        transform: [{ translateY: animatedContentTopPosition }],
      },
    ],
    [
      animatedContentOpacity,
      animatedContentTopPosition,
      safeInsets,
      indicatorSize,
    ]
  );

  const titleStyle = useMemo(
    () => [styles.title, item.titleStyle ? item.titleStyle : null],
    [item]
  );

  const descriptionStyle = useMemo(
    () => [
      styles.description,
      item.descriptionStyle ? item.descriptionStyle : null,
    ],
    [item]
  );

  const imageContainerStyle = useMemo(
    () => [
      styles.imageContainer,
      {
        transform: [{ translateY: animatedImageTopPosition }],
      },
    ],
    [animatedImageTopPosition]
  );

  return (
    <Animated.View style={styles.container}>
      <Svg
        style={styles.background}
        width={screenDimensions.width}
        height={screenDimensions.height}
        needsOffscreenAlphaCompositing={true}
        renderToHardwareTextureAndroid={true}
      >
        <AnimatedCircle
          cx={animatedBackgroundLeftPosition}
          cy={backgroundBottomPosition}
          r={animatedBackgroundSize}
          fill={item.color}
        />
      </Svg>
      <Animated.View style={contentContainerStyle}>
        {item.image && (
          <Animated.View style={imageContainerStyle}>
            {item.image()}
          </Animated.View>
        )}
        <Text style={titleStyle}>{item.title}</Text>
        <Text style={descriptionStyle}>{item.description}</Text>
      </Animated.View>
    </Animated.View>
  );
};