import {DefaultTheme, MD3DarkTheme} from 'react-native-paper';

export const PaperLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#12CCB7',
    background: '#ffffff',
    surface: '#ffffff',
    text: '#000000',
    // Add other color customizations as needed
  },
};

export const PaperDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#12CCB7',
    background: '#121212',
    surface: '#1f1f1f',
    text: '#ffffff',
    // Add other color customizations as needed
  },
};
