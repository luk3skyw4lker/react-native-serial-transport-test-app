import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ModalScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          📚 Documentation
        </ThemedText>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            About This App
          </ThemedText>
          <ThemedText style={styles.text}>
            This is a demo application showcasing the react-native-serial-transport library, which
            enables USB serial communication with devices like ESP32, ESP8266, Arduino, and other
            USB-to-serial adapters on Android.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Features
          </ThemedText>
          <ThemedText style={styles.text}>
            ✅ Device discovery and connection{'\n'}
            ✅ Send text and hex data{'\n'}
            ✅ Receive data in real-time{'\n'}
            ✅ Configure baud rate{'\n'}
            ✅ Control DTR/RTS lines{'\n'}
            ✅ ESP32 reset and bootloader mode{'\n'}
            ✅ Activity logging
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Supported USB Chips
          </ThemedText>
          <ThemedText style={styles.text}>
            • CP210x (Silicon Labs) - ESP32/ESP8266{'\n'}
            • CH340/CH341 - Many ESP boards{'\n'}
            • FTDI - Arduino and dev boards{'\n'}
            • PL2303 - USB-serial adapters
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            How to Use
          </ThemedText>
          <ThemedText style={styles.text}>
            1. Connect a USB device to your Android device using an OTG adapter{'\n\n'}
            2. Go to the Connection tab and tap "Scan Devices"{'\n\n'}
            3. Select your device from the list to connect{'\n\n'}
            4. Navigate to the Data Transfer tab to send/receive data{'\n\n'}
            5. Use the ESP32 Controls to reset or enter bootloader mode
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Common Use Cases
          </ThemedText>
          <ThemedText style={styles.text}>
            <ThemedText style={styles.bold}>ESP32 Development:{'\n'}</ThemedText>
            Connect to ESP32 boards for serial communication, debugging, and firmware flashing
            preparation.
            {'\n\n'}
            <ThemedText style={styles.bold}>Arduino Communication:{'\n'}</ThemedText>
            Send and receive data from Arduino boards for IoT applications.
            {'\n\n'}
            <ThemedText style={styles.bold}>Serial Debugging:{'\n'}</ThemedText>
            Monitor serial output from embedded devices in real-time.
            {'\n\n'}
            <ThemedText style={styles.bold}>Device Testing:{'\n'}</ThemedText>
            Test USB-to-serial adapters and devices with custom protocols.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Code Example
          </ThemedText>
          <ThemedView
            style={[
              styles.codeBlock,
              { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' },
            ]}>
            <ThemedText style={styles.code}>
              {`import { SerialTransport } from 
  'react-native-serial-transport';

const transport = new SerialTransport();

// List devices
const devices = await transport.listDevices();

// Connect
await transport.connect(115200);

// Send data
const data = new Uint8Array([0x01, 0x02]);
await transport.write(data);

// Read data
const received = await transport.rawRead(1000);

// Disconnect
await transport.disconnect();`}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Platform Support
          </ThemedText>
          <ThemedText style={styles.text}>
            ⚠️ This library only works on Android devices. iOS does not support USB serial
            communication through standard APIs.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Resources
          </ThemedText>
          <ThemedText style={styles.text}>
            📦 NPM: react-native-serial-transport{'\n'}
            📖 GitHub: github.com/yourorg/react-native-serialport{'\n'}
            🔧 Built with usb-serial-for-android{'\n'}
            🔗 Compatible with esptool-js
          </ThemedText>
        </ThemedView>

        <ThemedView style={[styles.section, styles.footer]}>
          <ThemedText style={styles.footerText}>
            Made with ❤️ for the React Native and ESP32 communities
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.9,
  },
  bold: {
    fontWeight: '600',
  },
  codeBlock: {
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
  footer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
    marginTop: 12,
    marginBottom: 40,
  },
  footerText: {
    textAlign: 'center',
    opacity: 0.7,
    fontSize: 14,
  },
});
