import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  style?: any;
  color?: string;
  showIcon?: boolean;
  text?: string;
  subtitle?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  style, 
  color = '#8B1538',
  showIcon = true,
  text = 'Barback',
  subtitle = 'PRO'
}) => {
  const logoSizes = {
    small: { 
      fontSize: 18, 
      iconSize: 20,
      spacing: 4 
    },
    medium: { 
      fontSize: 28, 
      iconSize: 32,
      spacing: 8 
    },
    large: { 
      fontSize: 36, 
      iconSize: 40,
      spacing: 12 
    },
  };

  const currentSize = logoSizes[size];

  return (
    <View style={[styles.container, style]}>
      <View style={styles.logoContainer}>
        {showIcon && (
          <MaterialIcons 
            name="local-bar" 
            size={currentSize.iconSize} 
            color={color}
            style={[styles.icon, { marginRight: currentSize.spacing }]}
          />
        )}
        <View style={styles.textContainer}>
          <Text style={[
            styles.logoText,
            { 
              fontSize: currentSize.fontSize,
              color: color
            }
          ]}>
            {text}
          </Text>
          {subtitle && (
            <Text style={[
              styles.proText,
              { 
                fontSize: currentSize.fontSize * 0.7,
                color: color
              }
            ]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    // Icon styling
  },
  textContainer: {
    alignItems: 'flex-start',
  },
  logoText: {
    fontWeight: '800',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    lineHeight: undefined, // Let the text use natural line height
  },
  proText: {
    fontWeight: '700',
    letterSpacing: 3,
    marginTop: -6,
    opacity: 0.95,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
});

export default Logo;