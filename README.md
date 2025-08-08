# Barback Pro - Professional Bar Management System

A comprehensive React Native/Expo application for bar and restaurant management with POS, inventory tracking, analytics, and more.

## 🚀 Building Downloadable Apps

This app can be built as standalone downloadable software for multiple platforms:

### Prerequisites

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install EAS CLI globally:**
   ```bash
   npm install -g eas-cli
   ```

3. **Create Expo account and login:**
   ```bash
   eas login
   ```

4. **Configure your project:**
   ```bash
   eas build:configure
   ```

### Build Commands

#### Android APK (Direct Install)
```bash
npm run build:android
# Or for production APK:
eas build --platform android --profile production-apk
```

#### iOS App (TestFlight/App Store)
```bash
npm run build:ios
```

#### Web App (Progressive Web App)
```bash
npm run build:web
```

#### All Platforms
```bash
npm run build
```

### Distribution Options

#### 1. **Android APK Download**
- Build with `production-apk` profile
- Download APK file directly from EAS dashboard
- Users can install directly on Android devices
- Perfect for internal distribution

#### 2. **iOS TestFlight**
- Build with `production` profile for iOS
- Submit to TestFlight for beta testing
- Share TestFlight link with users

#### 3. **Web Application**
- Deploy to any web hosting service
- Progressive Web App (PWA) capabilities
- Can be "installed" on devices like a native app

#### 4. **App Stores**
- Google Play Store (Android)
- Apple App Store (iOS)

### Platform-Specific Features

#### iOS Features:
- ✅ iPhone and iPad support
- ✅ Camera permissions for barcode scanning
- ✅ Microphone access for voice commands
- ✅ Photo library access for menu images

#### Android Features:
- ✅ Adaptive icon support
- ✅ Edge-to-edge display
- ✅ Camera and microphone permissions
- ✅ Storage permissions for data export

#### Web Features:
- ✅ Progressive Web App (PWA)
- ✅ Offline functionality
- ✅ Desktop and mobile responsive
- ✅ Can be installed as desktop app

## 📱 App Features

### Core Functionality
- **Point of Sale (POS)** - Complete order management
- **Inventory Management** - Real-time stock tracking with 946+ pre-loaded items
- **Menu Management** - Dynamic menu with categories and customization
- **Recipe System** - Linked to inventory with automatic deduction
- **Reports & Analytics** - Advanced business intelligence with forecasting

### Premium Features
- **Stripe Subscription System** - $29.99/month with 14-day free trial
- **Employee Scheduling** - Staff management with availability tracking
- **Customer Loyalty Program** - 4-tier rewards system
- **Kitchen Display System** - Real-time order tracking
- **Voice Commands** - Hands-free operation
- **Offline Mode** - Full functionality without internet
- **Data Export** - CSV/Excel reporting

### Technical Specifications
- **Framework:** React Native with Expo
- **UI Library:** React Native Paper with custom burgundy/gold theme
- **Navigation:** React Navigation 7
- **State Management:** React Context API
- **Storage:** Async Storage + Secure Store
- **Offline Support:** Network detection with automatic sync
- **Voice Recognition:** Expo AV integration
- **Camera/Barcode:** Expo Camera + Barcode Scanner

## 🔧 Development

### Local Development
```bash
npm start          # Start development server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
npm run web        # Run in web browser
```

### Project Structure
```
BarBuilder/
├── src/
│   ├── screens/     # All app screens
│   ├── components/  # Reusable components
│   ├── context/     # React Context providers
│   ├── services/    # Business logic and APIs
│   ├── data/        # Static data and mock data
│   ├── types/       # TypeScript type definitions
│   └── utils/       # Utility functions
├── assets/          # Images and icons
└── app.json         # Expo configuration
```

## 📚 Documentation

The app includes comprehensive built-in documentation:
- **App Specs Screen** - Technical specifications and feature overview
- **User Manual Screen** - Step-by-step usage instructions
- Both accessible from the main dashboard

## 🎨 Design System

- **Primary Color:** Burgundy (#8B0000)
- **Secondary Color:** Gold (#DAA520)
- **Professional theme** optimized for business use
- **Responsive design** for tablets and phones
- **Accessibility compliant** with proper contrast ratios

## 📄 License

Private commercial software - All rights reserved.

---

**Built with ❤️ for the hospitality industry**