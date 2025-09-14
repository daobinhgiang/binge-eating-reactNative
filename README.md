# Binge Eating Disorder Patient Tracking App

A React Native app built with Expo and TypeScript for tracking binge eating disorder patients.

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── forms/           # Form components
│   └── charts/          # Data visualization components
├── screens/
│   ├── auth/            # Authentication screens
│   ├── patient/         # Patient-specific screens
│   ├── clinician/       # Clinician screens
│   └── education/       # Educational content screens
├── navigation/          # Navigation configuration
├── services/            # API and external service integrations
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
├── context/             # React Context providers
└── constants/           # App constants and configuration
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on specific platforms:
   ```bash
   npm run android  # Android
   npm run ios      # iOS
   npm run web      # Web
   ```

## Dependencies

- **Expo**: ~54.0.7
- **React Native**: 0.81.4
- **TypeScript**: ~5.9.2
- **React Navigation**: For navigation
- **React Hook Form**: For form handling
- **Firebase**: For backend services
- **React Native Paper**: For UI components
- **React Native Chart Kit**: For data visualization

## Development

This project uses TypeScript for type safety and follows a modular architecture for maintainability.
