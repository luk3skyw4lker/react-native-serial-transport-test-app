# Serial Transport Demo App - Features Overview

## 📱 App Structure

### Connection Tab (Home)
**Purpose**: Device discovery and connection management

**Features**:
- ✅ Scan for available USB serial devices
- ✅ Display device information (vendor ID, product ID, manufacturer)
- ✅ Connect to selected device with 115200 baud rate
- ✅ Disconnect from current device
- ✅ Real-time activity logging
- ✅ Android-only warning for iOS users
- ✅ Quick access to documentation

**UI Elements**:
- Scan Devices button
- Device list with clickable items
- Connection status indicator
- Disconnect button when connected
- Activity log display
- About section with library info
- Documentation link button

### Data Transfer Tab
**Purpose**: Serial communication and device control

**Features**:
- ✅ Send text data with automatic newline
- ✅ Send hex data (space-separated format)
- ✅ Start/stop continuous data reading
- ✅ Receive buffer with timestamps
- ✅ Clear receive buffer
- ✅ Change baud rate dynamically
- ✅ Toggle DTR control line
- ✅ Toggle RTS control line
- ✅ ESP32 reset sequence
- ✅ ESP32 bootloader mode entry

**UI Elements**:
- Multi-line text input for sending
- Send Text / Send Hex buttons
- Start/Stop Reading toggle
- Scrollable receive data display
- Baud rate input and change button
- DTR/RTS toggle buttons (visual state indication)
- ESP32 Reset button
- ESP32 Bootloader button
- Helpful info text for ESP32 controls

### Documentation Modal
**Purpose**: In-app help and reference

**Content**:
- About the app
- Feature list
- Supported USB chips
- Step-by-step usage guide
- Common use cases
- Code examples
- Platform support notice
- Resource links

## 🎨 Design Features

- ✨ Light and dark mode support
- 📱 Responsive layout with ScrollView
- 🎨 Color-coded buttons (primary, secondary, danger, active states)
- 📊 Monospace font for data/logs
- 🔔 Alert dialogs for errors and success messages
- 🎯 Activity indicators during async operations
- 💫 Clean card-based UI design
- 🌈 iOS SF Symbols icons for tabs

## 🔌 Technical Implementation

### State Management
- React Hooks (useState, useEffect, useRef)
- Single SerialTransport instance per screen
- Proper cleanup on unmount
- Background reading with ref-based control

### Error Handling
- Try-catch blocks for all serial operations
- User-friendly error messages via Alert
- Graceful fallbacks for unsupported platforms
- Timeout handling for read operations

### Platform Awareness
- Android-only feature detection
- Platform-specific warning messages
- Conditional rendering based on Platform.OS

### TypeScript
- Full TypeScript support
- Type-safe device interfaces
- Proper typing for async operations

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Prebuild native code (required for config plugin)
npx expo prebuild --clean

# Run on Android
npx expo run:android

# Start development server
npx expo start
```

## 📝 Common Development Tasks

### Adding New Features
1. Check `SerialTransport` API in library docs
2. Add UI controls in appropriate tab
3. Implement async handlers with error handling
4. Add activity logging
5. Test with real USB device

### Testing Checklist
- [ ] Device scanning works
- [ ] Connection establishes successfully
- [ ] Permission prompt appears
- [ ] Data sending works (text and hex)
- [ ] Data receiving displays correctly
- [ ] Baud rate changes work
- [ ] DTR/RTS controls function
- [ ] ESP32 reset sequence works
- [ ] Disconnect cleans up properly
- [ ] Logs show all activities
- [ ] Dark mode looks good
- [ ] No memory leaks

## 🐛 Known Limitations

1. **Android Only** - iOS doesn't support USB serial natively
2. **TypeScript Definitions** - Minor type definition issues in library (non-breaking)
3. **USB OTG Required** - Android device must support USB OTG
4. **Permission Required** - User must grant USB permissions
5. **Single Connection** - One device at a time (by design)

## 🎓 Learning Resources

- [React Native Serial Transport Docs](https://www.npmjs.com/package/react-native-serial-transport)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [USB Serial for Android](https://github.com/mik3y/usb-serial-for-android)
- [ESPTool-js](https://github.com/espressif/esptool-js)

## 💡 Tips

1. Always connect a real USB device for testing - simulator won't work
2. Use USB OTG adapter if your Android device doesn't have USB-A port
3. Check device vendor ID if auto-detection fails
4. Use hex sending for binary protocols
5. Monitor logs to debug communication issues
6. DTR/RTS controls are crucial for ESP32 programming
7. Clean rebuild if native changes don't appear: `npx expo prebuild --clean`
