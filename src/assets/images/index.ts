/**
 * Centralized image management file
 * ---------------------------------
 * This file helps you import all app images from one place.
 * Simply add your image imports here and access them using:
 * 
 *    import { Images } from '../assets/images';
 *    <Image source={Images.logo} />
 */

export const Images = {
  // App Logo
  logo: require('./logo.png'),

  // Splash / Loading Image
//   loading: require('./loading.png'),

  // 🔹 Add more images here as your app grows
  // example:
  // profilePlaceholder: require('./profile_placeholder.png'),
  // bannerBackground: require('./banner_bg.png'),
};

export type ImageKeys = keyof typeof Images;
