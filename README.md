# React Native Serial Transport Demo App

A comprehensive example application demonstrating the capabilities of the [react-native-serial-transport](https://www.npmjs.com/package/react-native-serial-transport) library for USB serial communication on Android.

## 🎯 Features

This demo app showcases:

- ✅ **Device Discovery** - Scan and list available USB serial devices
- ✅ **Connection Management** - Connect to devices with configurable baud rates
- ✅ **Data Transfer** - Send text and hex data over serial
- ✅ **Real-time Reading** - Receive and display incoming serial data
- ✅ **Control Lines** - Manage DTR/RTS control signals
- ✅ **ESP32 Support** - Reset and bootloader mode controls for ESP32/ESP8266
- ✅ **Activity Logging** - Monitor all serial communication events

## 📱 Screenshots

The app features two main tabs:

1. **Connection Tab** - Device scanning and connection management
2. **Data Transfer Tab** - Send/receive data and control device signals

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Android device with USB OTG support
- USB-to-serial device (ESP32, ESP8266, Arduino, etc.)
- USB OTG adapter (if needed)

### Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd react-native-serial-transport-test-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Prebuild the native code:
```bash
npx expo prebuild --clean
```

4. Run on Android:
```bash
npx expo run:android
```

## 🔧 Usage

### Connecting to a Device

1. Connect your USB serial device to your Android device using an OTG adapter
2. Open the app and navigate to the **Connection** tab
3. Tap **"Scan Devices"** to discover connected devices
4. Select your device from the list to establish a connection
5. Grant USB permissions when prompted

### Sending Data

1. Navigate to the **Data Transfer** tab
2. Enter text in the input field
3. Tap **"Send Text"** to transmit the data
4. Or tap **"Send Hex"** to send raw hex bytes

### Receiving Data

1. In the **Data Transfer** tab, tap **"Start Reading"**
2. Incoming data will appear in the receive buffer
3. Tap **"Stop Reading"** to pause data reception
4. Use **"Clear"** to empty the receive buffer

### Control Lines (DTR/RTS)

Toggle DTR and RTS signals using the dedicated buttons in the Control Lines section. These are useful for:
- Resetting devices
- Flow control
- Custom signaling protocols

### ESP32 Controls

Special controls for ESP32/ESP8266 development:

- **Reset** - Perform a hardware reset
- **Bootloader** - Enter bootloader mode for firmware flashing

## 📚 Supported USB-to-Serial Chips

| Chip | Vendor ID | Common Use Cases | Manufacturer |
|------|-----------|------------------|--------------|
| CP210x | 0x10C4 (4292) | ESP32, ESP8266, NodeMCU | Silicon Labs |
| CH340/CH341 | 0x1A86 (6790) | Many ESP boards, Arduino clones | QinHeng Electronics |
| FTDI | 0x0403 (1027) | Arduino, various dev boards | Future Technology Devices |
| PL2303 | 0x067B (1659) | Older USB-serial adapters | Prolific |

## 🔌 API Reference

### Basic Connection

```typescript
import { SerialTransport } from 'react-native-serial-transport';

const transport = new SerialTransport();

// List available devices
const devices = await transport.listDevices();

// Connect at 115200 baud
await transport.connect(115200);

// Or connect to specific device
await transport.connect(115200, '/dev/bus/usb/001/002');
```

### Sending Data

```typescript
// Send text data
const encoder = new TextEncoder();
const data = encoder.encode('Hello ESP32!\n');
await transport.write(data);

// Send hex bytes
const hexData = new Uint8Array([0x01, 0x02, 0x03, 0xFF]);
await transport.write(hexData);
```

### Receiving Data

```typescript
// Read with timeout (promise-based)
const data = await transport.rawRead(1000);
const decoder = new TextDecoder();
const text = decoder.decode(data);

// Read continuously (async generator)
for await (const chunk of transport.read(3000)) {
  console.log('Received:', chunk);
}
```

### Control Lines

```typescript
// Set DTR/RTS individually
await transport.setDTR(false);
await transport.setRTS(true);

// Or set both at once
await transport.setRtsDtr(false, true);

// Change baud rate
await transport.setBaudrate(921600);
```

### ESP32 Reset Sequence

```typescript
// Reset ESP32
await transport.setDTR(false);
await transport.setRTS(true);
await new Promise(resolve => setTimeout(resolve, 100));
await transport.setDTR(true);
await transport.setRTS(false);

// Enter bootloader mode
await transport.setDTR(false);
await transport.setRTS(true);
await new Promise(resolve => setTimeout(resolve, 100));
await transport.setDTR(true);
await transport.setRTS(true);
await new Promise(resolve => setTimeout(resolve, 50));
await transport.setRTS(false);
```

## 🛠️ Configuration

The app uses the Expo config plugin for automatic setup. The configuration in `app.json` includes:

```json
{
  "expo": {
    "plugins": [
      "react-native-serial-transport"
    ]
  }
}
```

### Custom Vendor IDs

To support additional USB vendor IDs:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-serial-transport",
        {
          "vendorIds": [4292, 6790, 1027, 1659, 5840]
        }
      ]
    ]
  }
}
```

## 🐛 Troubleshooting

### No devices found

- Verify your USB cable supports data transfer (not charge-only)
- Check the device is properly connected via USB OTG
- Ensure the device's vendor ID is in the device filter
- Try unplugging and reconnecting the device

### Permission denied

- Grant USB permissions when prompted by Android
- Check that USB permissions are in AndroidManifest.xml (handled by the plugin)
- Try running `adb shell ls /dev/bus/usb/` to see if the device appears

### Connection errors

- Verify the baud rate matches your device's configuration
- Ensure no other app is using the serial port
- Try a device reset or reconnection
- Check that the device is not in a boot loop

### Build issues

```bash
# Clean and rebuild
cd android && ./gradlew clean
cd .. && npx expo prebuild --clean
npx expo run:android
```

## ⚠️ Platform Support

**Android Only** - iOS does not support USB serial communication through standard APIs.

For iOS:
- Consider using Bluetooth Low Energy (BLE) alternatives
- Use WiFi-based communication
- Flash devices on Android/desktop first, then use OTA updates

## 📖 Learn More

- [react-native-serial-transport Documentation](https://www.npmjs.com/package/react-native-serial-transport)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [ESPTool-js Integration](https://github.com/espressif/esptool-js)
- [USB Serial for Android](https://github.com/mik3y/usb-serial-for-android)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [react-native-serial-transport](https://www.npmjs.com/package/react-native-serial-transport)
- Powered by [usb-serial-for-android](https://github.com/mik3y/usb-serial-for-android)
- Compatible with [esptool-js](https://github.com/espressif/esptool-js)

Made with ❤️ for the React Native and ESP32 communities