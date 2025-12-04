import React, {
	createContext,
	PropsWithChildren,
	useContext,
	useState
} from 'react';
import { SerialTransport } from 'react-native-serial-transport';

export const useTransportContext = () => {
	return useContext(TransportContextProvider);
};

export interface ITransportContext {
	transport: SerialTransport;
}

export const TransportContextProvider = createContext<ITransportContext>({
	transport: new SerialTransport()
});

const TransportContext: React.FC<PropsWithChildren> = ({ children }) => {
	const [transport] = useState(() => new SerialTransport());

	return (
		<TransportContextProvider.Provider value={{ transport }}>
			{children}
		</TransportContextProvider.Provider>
	);
};

export default TransportContext;
