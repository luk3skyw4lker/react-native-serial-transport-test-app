import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTransportContext } from '@/contexts/TransportContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useRef, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Platform,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity
} from 'react-native';

export default function DataTransferScreen() {
	const colorScheme = useColorScheme();
	const { transport } = useTransportContext();
	const [inputText, setInputText] = useState('');
	const [receivedData, setReceivedData] = useState<string[]>([]);
	const [isReading, setIsReading] = useState(false);
	const [loading, setLoading] = useState(false);
	const [baudRate, setBaudRate] = useState('115200');
	const [dtrState, setDtrState] = useState(true);
	const [rtsState, setRtsState] = useState(true);
	const readingRef = useRef(false);

	const isDark = colorScheme === 'dark';

	const addReceivedData = (data: string) => {
		const timestamp = new Date().toLocaleTimeString();
		setReceivedData(prev => [`[${timestamp}] ${data}`, ...prev.slice(0, 99)]);
	};

	const sendData = async () => {
		if (!inputText.trim()) {
			Alert.alert('Error', 'Please enter some data to send');
			return;
		}

		setLoading(true);
		try {
			// Convert string to Uint8Array
			const encoder = new TextEncoder();
			const data = encoder.encode(inputText + '\n');

			await transport.write(data);
			addReceivedData(`TX: ${inputText}`);
			setInputText('');
			Alert.alert('Success', 'Data sent successfully');
		} catch (error) {
			addReceivedData(`Error sending: ${error}`);
			Alert.alert('Error', `Failed to send data: ${error}`);
		} finally {
			setLoading(false);
		}
	};

	const sendHexData = async () => {
		Alert.prompt(
			'Send Hex Data',
			'Enter hex bytes (space separated, e.g., "01 02 03 FF")',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Send',
					onPress: async (hexString?: string) => {
						if (!hexString) return;

						try {
							const hexBytes = hexString
								.split(' ')
								.map((h: string) => parseInt(h.trim(), 16));
							const data = new Uint8Array(hexBytes);

							await transport.write(data);
							addReceivedData(`TX (hex): ${hexString}`);
							Alert.alert('Success', 'Hex data sent successfully');
						} catch (error) {
							Alert.alert('Error', `Failed to send hex data: ${error}`);
						}
					}
				}
			],
			'plain-text'
		);
	};

	const startReading = async () => {
		if (readingRef.current) return;

		setIsReading(true);
		readingRef.current = true;
		addReceivedData('Started reading data...');

		try {
			while (readingRef.current) {
				try {
					const data = await transport.rawRead(1000);
					if (data && data.length > 0) {
						// Convert Uint8Array to string
						const decoder = new TextDecoder();
						const text = decoder.decode(data);
						addReceivedData(`RX: ${text}`);
					}
				} catch (error) {
					// Timeout is expected, continue reading
					if (!String(error).includes('timeout')) {
						addReceivedData(`Read error: ${error}`);
					}
				}
			}
		} finally {
			setIsReading(false);
		}
	};

	const stopReading = () => {
		readingRef.current = false;
		addReceivedData('Stopped reading data');
	};

	const changeBaudRate = async () => {
		const newRate = parseInt(baudRate);
		if (isNaN(newRate) || newRate <= 0) {
			Alert.alert('Error', 'Invalid baud rate');
			return;
		}

		setLoading(true);
		try {
			await transport.setBaudRate(newRate);
			addReceivedData(`Baud rate changed to ${newRate}`);
			Alert.alert('Success', `Baud rate set to ${newRate}`);
		} catch (error) {
			Alert.alert('Error', `Failed to change baud rate: ${error}`);
		} finally {
			setLoading(false);
		}
	};

	const toggleDTR = async () => {
		setLoading(true);
		try {
			const newState = !dtrState;
			await transport.setDTR(newState);
			setDtrState(newState);
			addReceivedData(`DTR set to ${newState ? 'HIGH' : 'LOW'}`);
		} catch (error) {
			Alert.alert('Error', `Failed to toggle DTR: ${error}`);
		} finally {
			setLoading(false);
		}
	};

	const toggleRTS = async () => {
		setLoading(true);
		try {
			const newState = !rtsState;
			await transport.setRTS(newState);
			setRtsState(newState);
			addReceivedData(`RTS set to ${newState ? 'HIGH' : 'LOW'}`);
		} catch (error) {
			Alert.alert('Error', `Failed to toggle RTS: ${error}`);
		} finally {
			setLoading(false);
		}
	};

	const resetESP32 = async () => {
		setLoading(true);
		addReceivedData('Resetting ESP32...');
		try {
			// ESP32 reset sequence
			await transport.setDTR(false);
			await transport.setRTS(true);
			await new Promise(resolve => setTimeout(resolve, 100));
			await transport.setDTR(true);
			await transport.setRTS(false);
			addReceivedData('ESP32 reset complete');
			Alert.alert('Success', 'ESP32 has been reset');
		} catch (error) {
			Alert.alert('Error', `Failed to reset ESP32: ${error}`);
		} finally {
			setLoading(false);
		}
	};

	const enterBootloader = async () => {
		setLoading(true);
		addReceivedData('Entering ESP32 bootloader mode...');
		try {
			// ESP32 bootloader sequence
			await transport.setDTR(false);
			await transport.setRTS(true);
			await new Promise(resolve => setTimeout(resolve, 100));
			await transport.setDTR(true);
			await transport.setRTS(true);
			await new Promise(resolve => setTimeout(resolve, 50));
			await transport.setRTS(false);
			addReceivedData('ESP32 should be in bootloader mode');
			Alert.alert('Success', 'ESP32 entered bootloader mode');
		} catch (error) {
			Alert.alert('Error', `Failed to enter bootloader: ${error}`);
		} finally {
			setLoading(false);
		}
	};

	const clearData = () => {
		setReceivedData([]);
	};

	useEffect(() => {
		return () => {
			readingRef.current = false;
		};
	}, []);

	const inputBgColor = isDark ? '#1C1C1E' : '#F2F2F7';
	const borderColor = isDark ? '#38383A' : '#C6C6C8';

	return (
		<ScrollView style={styles.container}>
			<ThemedView style={styles.header}>
				<ThemedText type="title">Data Transfer</ThemedText>
				<ThemedText style={styles.subtitle}>
					Send & receive serial data
				</ThemedText>
			</ThemedView>

			{Platform.OS !== 'android' && (
				<ThemedView style={[styles.card, styles.warningCard]}>
					<ThemedText style={styles.warningText}>
						⚠️ USB Serial is only available on Android devices
					</ThemedText>
				</ThemedView>
			)}

			{/* Send Data Section */}
			<ThemedView style={styles.card}>
				<ThemedText type="subtitle" style={styles.cardTitle}>
					Send Data
				</ThemedText>
				<TextInput
					style={[
						styles.input,
						{
							backgroundColor: inputBgColor,
							borderColor: borderColor,
							color: isDark ? '#fff' : '#000'
						}
					]}
					value={inputText}
					onChangeText={setInputText}
					placeholder="Enter text to send..."
					placeholderTextColor={isDark ? '#8E8E93' : '#999'}
					multiline
				/>
				<ThemedView style={styles.buttonRow}>
					<TouchableOpacity
						style={[styles.button, styles.flexButton]}
						onPress={sendData}
						disabled={loading}
					>
						{loading ? (
							<ActivityIndicator color="#fff" />
						) : (
							<ThemedText style={styles.buttonText}>Send Text</ThemedText>
						)}
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.button, styles.flexButton, styles.secondaryButton]}
						onPress={sendHexData}
						disabled={loading}
					>
						<ThemedText style={styles.buttonText}>Send Hex</ThemedText>
					</TouchableOpacity>
				</ThemedView>
			</ThemedView>

			{/* Read Data Section */}
			<ThemedView style={styles.card}>
				<ThemedView style={styles.rowHeader}>
					<ThemedText type="subtitle" style={styles.cardTitle}>
						Receive Data
					</ThemedText>
					<TouchableOpacity onPress={clearData}>
						<ThemedText style={styles.clearText}>Clear</ThemedText>
					</TouchableOpacity>
				</ThemedView>
				<TouchableOpacity
					style={[styles.button, isReading && styles.dangerButton]}
					onPress={isReading ? stopReading : startReading}
				>
					<ThemedText style={styles.buttonText}>
						{isReading ? 'Stop Reading' : 'Start Reading'}
					</ThemedText>
				</TouchableOpacity>
				<ThemedView style={styles.dataContainer}>
					<ScrollView style={styles.dataScroll}>
						{receivedData.length === 0 ? (
							<ThemedText style={styles.dataText}>
								No data received yet
							</ThemedText>
						) : (
							receivedData.map((data, index) => (
								<ThemedText key={index} style={styles.dataText}>
									{data}
								</ThemedText>
							))
						)}
					</ScrollView>
				</ThemedView>
			</ThemedView>

			{/* Settings Section */}
			<ThemedView style={styles.card}>
				<ThemedText type="subtitle" style={styles.cardTitle}>
					Settings
				</ThemedText>
				<ThemedView style={styles.settingRow}>
					<ThemedText style={styles.settingLabel}>Baud Rate:</ThemedText>
					<TextInput
						style={[
							styles.settingInput,
							{
								backgroundColor: inputBgColor,
								borderColor: borderColor,
								color: isDark ? '#fff' : '#000'
							}
						]}
						value={baudRate}
						onChangeText={setBaudRate}
						keyboardType="number-pad"
						placeholderTextColor={isDark ? '#8E8E93' : '#999'}
					/>
					<TouchableOpacity
						style={[styles.button, styles.smallButton]}
						onPress={changeBaudRate}
						disabled={loading}
					>
						<ThemedText style={styles.buttonText}>Set</ThemedText>
					</TouchableOpacity>
				</ThemedView>
			</ThemedView>

			{/* Control Lines Section */}
			<ThemedView style={styles.card}>
				<ThemedText type="subtitle" style={styles.cardTitle}>
					Control Lines
				</ThemedText>
				<ThemedView style={styles.buttonRow}>
					<TouchableOpacity
						style={[
							styles.button,
							styles.flexButton,
							dtrState && styles.activeButton
						]}
						onPress={toggleDTR}
						disabled={loading}
					>
						<ThemedText style={styles.buttonText}>
							DTR: {dtrState ? 'HIGH' : 'LOW'}
						</ThemedText>
					</TouchableOpacity>
					<TouchableOpacity
						style={[
							styles.button,
							styles.flexButton,
							rtsState && styles.activeButton
						]}
						onPress={toggleRTS}
						disabled={loading}
					>
						<ThemedText style={styles.buttonText}>
							RTS: {rtsState ? 'HIGH' : 'LOW'}
						</ThemedText>
					</TouchableOpacity>
				</ThemedView>
			</ThemedView>

			{/* ESP32 Controls Section */}
			<ThemedView style={styles.card}>
				<ThemedText type="subtitle" style={styles.cardTitle}>
					ESP32 Controls
				</ThemedText>
				<ThemedView style={styles.buttonRow}>
					<TouchableOpacity
						style={[styles.button, styles.flexButton]}
						onPress={resetESP32}
						disabled={loading}
					>
						<ThemedText style={styles.buttonText}>Reset</ThemedText>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.button, styles.flexButton, styles.secondaryButton]}
						onPress={enterBootloader}
						disabled={loading}
					>
						<ThemedText style={styles.buttonText}>Bootloader</ThemedText>
					</TouchableOpacity>
				</ThemedView>
				<ThemedText style={styles.infoText}>
					Use these controls to reset ESP32 or enter bootloader mode for
					flashing firmware
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
	rowHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12
	},
	clearText: {
		color: '#007AFF',
		fontSize: 14
	},
	input: {
		borderWidth: 1,
		borderRadius: 8,
		padding: 12,
		marginBottom: 12,
		minHeight: 80,
		textAlignVertical: 'top'
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
	secondaryButton: {
		backgroundColor: '#5856D6'
	},
	activeButton: {
		backgroundColor: '#34C759'
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600'
	},
	buttonRow: {
		flexDirection: 'row',
		gap: 8,
		marginBottom: 8
	},
	flexButton: {
		flex: 1
	},
	smallButton: {
		paddingHorizontal: 20,
		minHeight: 40
	},
	dataContainer: {
		marginTop: 12,
		maxHeight: 200,
		borderWidth: 1,
		borderColor: '#38383A',
		borderRadius: 8,
		padding: 8
	},
	dataScroll: {
		maxHeight: 180
	},
	dataText: {
		fontSize: 12,
		fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
		marginBottom: 4,
		opacity: 0.8
	},
	settingRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8
	},
	settingLabel: {
		fontSize: 16,
		fontWeight: '600'
	},
	settingInput: {
		flex: 1,
		borderWidth: 1,
		borderRadius: 8,
		padding: 8,
		minHeight: 40
	},
	infoText: {
		fontSize: 12,
		opacity: 0.7,
		marginTop: 8,
		lineHeight: 16
	}
});
