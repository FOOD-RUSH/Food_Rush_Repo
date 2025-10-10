import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';

const { width } = Dimensions.get('window');

interface CustomSplashScreenProps {
  onAnimationComplete: () => void;
  onTransitionStart?: () => void;
}

const CustomSplashScreen: React.FC<CustomSplashScreenProps> = ({
  onAnimationComplete,
}) => {
  // Animation values for each letter in "Food"
  const letterAnimations = useRef([
    new Animated.Value(0), // F
    new Animated.Value(0), // o
    new Animated.Value(0), // o
    new Animated.Value(0), // d
  ]).current;

  // Animation values for "Rush"
  const rushSlideAnim = useRef(new Animated.Value(width)).current;
  const rushOpacityAnim = useRef(new Animated.Value(0)).current;

  const [animationPhase, setAnimationPhase] = useState<
    'food' | 'rush' | 'complete'
  >('food');

  const startFoodAnimation = () => {
    // Animate each letter of "Food" one by one
    const letterAnimationsList = letterAnimations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 150, // 150ms delay between each letter
        useNativeDriver: true,
      }),
    );

    Animated.sequence([
      Animated.stagger(150, letterAnimationsList),
      Animated.delay(300), // Wait 300ms after "Food" completes
    ]).start(() => {
      startRushAnimation();
    });
  };

  useEffect(() => {
    startFoodAnimation();
  }, []);

  useEffect(() => {
    // When animations are complete, call onAnimationComplete after a delay
    if (animationPhase === 'complete') {
      const timer = setTimeout(() => {
        onAnimationComplete();
      }, 1200); // Wait 1.2 seconds before transitioning (matching first implementation)
      return () => clearTimeout(timer);
    }
  }, [animationPhase, onAnimationComplete]);

  const startFoodAnimation = () => {
    // Animate each letter of "Food" one by one
    const letterAnimationsList = letterAnimations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 150, // 150ms delay between each letter
        useNativeDriver: true,
      }),
    );

    Animated.sequence([
      Animated.stagger(150, letterAnimationsList),
      Animated.delay(300), // Wait 300ms after "Food" completes
    ]).start(() => {
      startRushAnimation();
    });
  };

  const startRushAnimation = () => {
    setAnimationPhase('rush');

    // Rush slides in from the right
    Animated.parallel([
      Animated.timing(rushSlideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(rushOpacityAnim, {
        toValue: 1,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setAnimationPhase('complete');
    });
  };

  const renderLetter = (letter: string, index: number) => {
    const translateY = letterAnimations[index].interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0],
    });

    const opacity = letterAnimations[index];
    const scale = letterAnimations[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    });

    return (
      <Animated.Text
        key={index}
        style={[
          styles.letterText,
          {
            opacity,
            transform: [{ translateY }, { scale }],
          },
        ]}
      >
        {letter}
      </Animated.Text>
    );
  };

  return (
    <View style={styles.container}>
      {/* Food Text */}
      <View style={styles.foodContainer}>
        {['F', 'o', 'o', 'd'].map((letter, index) =>
          renderLetter(letter, index),
        )}
      </View>

      {/* Rush Text */}
      {animationPhase !== 'food' && (
        <Animated.View
          style={[
            styles.rushContainer,
            {
              transform: [{ translateX: rushSlideAnim }],
              opacity: rushOpacityAnim,
            },
          ]}
        >
          <Text style={styles.rushText}>Rush</Text>
          <Text style={styles.dotText}>.</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#06102b', // Updated background color as requested
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodContainer: {
    flexDirection: 'row',
    marginBottom: -10,
  },
  letterText: {
    fontSize: 72,
    fontWeight: '800', // Bolder font weight
    color: 'white',
    fontFamily: 'Urbanist-Bold', // Using the app's custom font
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  rushContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rushText: {
    fontSize: 72,
    fontWeight: '800', // Bolder font weight
    color: '#4FC3F7', // Light blue accent color
    fontFamily: 'Urbanist-Bold', // Using the app's custom font
    textShadowColor: 'rgba(79, 195, 247, 0.4)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  dotText: {
    fontSize: 72,
    fontWeight: '800', // Bolder font weight
    color: '#4FC3F7', // Light blue accent color
    fontFamily: 'Urbanist-Bold', // Using the app's custom font
    marginLeft: 4,
    textShadowColor: 'rgba(79, 195, 247, 0.4)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
});

export default CustomSplashScreen;
