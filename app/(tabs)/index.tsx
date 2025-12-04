import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTransportContext } from '@/contexts/TransportContext';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Platform,
	ScrollView,
	StyleSheet,
	TouchableOpacity
} from 'react-native';

interface USBDevice {
	deviceName: string;
	vendorId: number;
	productId: number;
	productName: string;
	manufacturerName: string;
	serialNumber: string;
	deviceClass: number;
	deviceSubclass: number;
	portCount: number;
}

export default function HomeScreen() {
	const [devices, setDevices] = useState<USBDevice[]>([]);
	const [loading, setLoading] = useState(false);
	const [connected, setConnected] = useState(false);
	const [connectedDevice, setConnectedDevice] = useState<string>('');
	const { transport } = useTransportContext();
	const [logs, setLogs] = useState<string[]>([]);

	const addLog = (message: string) => {
		const timestamp = new Date().toLocaleTimeString();
		setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)]);
	};

	const scanDevices = async () => {
		if (Platform.OS !== 'android') {
			Alert.alert('Not Supported', 'USB Serial is only supported on Android');
			return;
		}

		setLoading(true);
		addLog('Scanning for USB devices...');
		try {
			const deviceList = await transport.listDevices();

			setDevices(deviceList);
			addLog(`Found ${deviceList.length} device(s)`);
		} catch (error) {
			addLog(`Error scanning: ${error}`);
			Alert.alert('Error', `Failed to scan devices: ${error}`);
		} finally {
			setLoading(false);
		}
	};

	const connectToDevice = async (device: USBDevice) => {
		setLoading(true);
		addLog(`Connecting to ${device.productName || 'device'}...`);
		try {
			await transport.connect(device.deviceName, 115200);
			setConnected(true);
			setConnectedDevice(device.productName || device.deviceName);
			addLog(`Connected successfully at 115200 baud`);
			Alert.alert('Success', `Connected to ${device.productName || 'device'}`);
		} catch (error) {
			addLog(`Connection error: ${error}`);
			Alert.alert('Error', `Failed to connect: ${error}`);
		} finally {
			setLoading(false);
		}
	};

	const disconnect = async () => {
		setLoading(true);
		addLog('Disconnecting...');
		try {
			await transport.disconnect();
			setConnected(false);
			setConnectedDevice('');
			addLog('Disconnected successfully');
		} catch (error) {
			addLog(`Disconnect error: ${error}`);
			Alert.alert('Error', `Failed to disconnect: ${error}`);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		addLog('Serial Transport Demo initialized');
		addLog('Tap "Scan Devices" to find USB serial devices');
		return () => {
			transport.disconnect().catch(() => {});
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<ScrollView style={styles.container}>
			<ThemedView style={styles.header}>
				<ThemedText type="title">Serial Transport</ThemedText>
				<ThemedText style={styles.subtitle}>
					USB Serial Communication Demo
				</ThemedText>
				<Link href="/modal" asChild>
					<TouchableOpacity style={styles.docButton}>
						<ThemedText style={styles.docButtonText}>
							📚 View Documentation
						</ThemedText>
					</TouchableOpacity>
				</Link>
			</ThemedView>

			{Platform.OS !== 'android' && (
				<ThemedView style={[styles.card, styles.warningCard]}>
					<ThemedText style={styles.warningText}>
						⚠️ USB Serial is only available on Android devices
					</ThemedText>
				</ThemedView>
			)}

			<ThemedView style={styles.card}>
				<ThemedText type="subtitle" style={styles.cardTitle}>
					Connection
				</ThemedText>
				{connected ? (
					<ThemedView style={styles.connectedStatus}>
						<ThemedText style={styles.connectedText}>
							✓ Connected to: {connectedDevice}
						</ThemedText>
						<TouchableOpacity
							style={[styles.button, styles.dangerButton]}
							onPress={disconnect}
							disabled={loading}
						>
							{loading ? (
								<ActivityIndicator color="#fff" />
							) : (
								<ThemedText style={styles.buttonText}>Disconnect</ThemedText>
							)}
						</TouchableOpacity>
					</ThemedView>
				) : (
					<TouchableOpacity
						style={styles.button}
						onPress={scanDevices}
						disabled={loading}
					>
						{loading ? (
							<ActivityIndicator color="#fff" />
						) : (
							<ThemedText style={styles.buttonText}>Scan Devices</ThemedText>
						)}
					</TouchableOpacity>
				)}
			</ThemedView>

			{devices.length > 0 && !connected && (
				<ThemedView style={styles.card}>
					<ThemedText type="subtitle" style={styles.cardTitle}>
						Available Devices ({devices.length})
					</ThemedText>
					{devices.map((device, index) => (
						<TouchableOpacity
							key={index}
							style={styles.deviceItem}
							onPress={() => connectToDevice(device)}
							disabled={loading}
						>
							<ThemedView style={styles.deviceInfo}>
								<ThemedText style={styles.deviceName}>
									{device.productName || 'Unknown Device'}
								</ThemedText>
								<ThemedText style={styles.deviceDetails}>
									Vendor: 0x{device.vendorId.toString(16).toUpperCase()} |
									Product: 0x
									{device.productId.toString(16).toUpperCase()}
								</ThemedText>
								{device.manufacturerName && (
									<ThemedText style={styles.deviceDetails}>
										{device.manufacturerName}
									</ThemedText>
								)}
							</ThemedView>
						</TouchableOpacity>
					))}
				</ThemedView>
			)}

			<ThemedView style={styles.card}>
				<ThemedText type="subtitle" style={styles.cardTitle}>
					Activity Log
				</ThemedText>
				<ThemedView style={styles.logContainer}>
					{logs.length === 0 ? (
						<ThemedText style={styles.logText}>No activity yet</ThemedText>
					) : (
						logs.map((log, index) => (
							<ThemedText key={index} style={styles.logText}>
								{log}
							</ThemedText>
						))
					)}
				</ThemedView>
			</ThemedView>

			<ThemedView style={styles.infoCard}>
				<ThemedText type="subtitle" style={styles.cardTitle}>
					About
				</ThemedText>
				<ThemedText style={styles.infoText}>
					This demo showcases the react-native-serial-transport library for USB
					serial communication with devices like ESP32, ESP8266, Arduino, and
					other USB-to-serial adapters.
				</ThemedText>
				<ThemedText style={styles.infoText}>
					Navigate to the &ldquo;Data Transfer&rdquo; tab to send and receive
					data once connected.
				</ThemedText>
			</ThemedView>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16
	},
	header: {
		marginBottom: 24,
		paddingTop: 60
	},
	subtitle: {
		fontSize: 16,
		opacity: 0.7,
		marginTop: 4
	},
	docButton: {
		marginTop: 12,
		paddingVertical: 8,
		paddingHorizontal: 16,
		backgroundColor: 'rgba(0, 122, 255, 0.1)',
		borderRadius: 8,
		alignSelf: 'flex-start'
	},
	docButtonText: {
		color: '#007AFF',
		fontSize: 14,
		fontWeight: '600'
	},
	card: {
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3
	},
	warningCard: {
		backgroundColor: '#FFF3CD'
	},
	warningText: {
		color: '#856404',
		textAlign: 'center'
	},
	cardTitle: {
		marginBottom: 12
	},
	button: {
		backgroundColor: '#007AFF',
		padding: 16,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: 50
	},
	dangerButton: {
		backgroundColor: '#FF3B30'
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600'
	},
	connectedStatus: {
		gap: 12
	},
	connectedText: {
		color: '#34C759',
		fontSize: 16,
		fontWeight: '600'
	},
	deviceItem: {
		padding: 12,
		borderRadius: 8,
		marginBottom: 8,
		backgroundColor: 'rgba(0, 122, 255, 0.1)'
	},
	deviceInfo: {
		gap: 4
	},
	deviceName: {
		fontSize: 16,
		fontWeight: '600'
	},
	deviceDetails: {
		fontSize: 12,
		opacity: 0.7
	},
	logContainer: {
		maxHeight: 200
	},
	logText: {
		fontSize: 12,
		fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
		marginBottom: 4,
		opacity: 0.8
	},
	infoCard: {
		borderRadius: 12,
		padding: 16,
		marginBottom: 32
	},
	infoText: {
		fontSize: 14,
		lineHeight: 20,
		opacity: 0.8,
		marginBottom: 8
	}
});
