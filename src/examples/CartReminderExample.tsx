// Example component showing how to handle cart reminders using effects
// This replaces the old store-based reminder logic and uses React Native primitives

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCartReminders } from '../hooks/customer/useCartReminders';
import {
	useCartItems,
	useCartReminderEnabled,
} from '../stores/customerStores/cartStore';

export const CartReminderExample: React.FC = () => {
	const cartItems = useCartItems();
	const reminderEnabled = useCartReminderEnabled();
	const {
		scheduleCartReminders,
		cancelCartReminders,
		toggleReminders,
	} = useCartReminders();

	// Handle cart changes with effects (replaces store logic)
	useEffect(() => {
		if (reminderEnabled) {
			if (cartItems.length > 0) {
				// Schedule reminders when cart has items
				scheduleCartReminders();
			} else {
				// Cancel reminders when cart is empty
				cancelCartReminders();
			}
		} else {
			// Cancel reminders when disabled
			cancelCartReminders();
		}
	}, [cartItems.length, reminderEnabled, scheduleCartReminders, cancelCartReminders]);

	// Cleanup reminders on unmount
	useEffect(() => {
		return () => {
			cancelCartReminders();
		};
	}, [cancelCartReminders]);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Cart Reminder Management</Text>
			<Text style={styles.text}>Cart Items: {cartItems.length}</Text>
			<Text style={styles.text}>
				Reminders Enabled: {reminderEnabled ? 'Yes' : 'No'}
			</Text>

			<TouchableOpacity style={styles.button} onPress={toggleReminders}>
				<Text style={styles.buttonText}>
					{reminderEnabled ? 'Disable' : 'Enable'} Reminders
				</Text>
			</TouchableOpacity>

			<TouchableOpacity style={styles.button} onPress={scheduleCartReminders}>
				<Text style={styles.buttonText}>Schedule Reminders</Text>
			</TouchableOpacity>

			<TouchableOpacity style={styles.button} onPress={cancelCartReminders}>
				<Text style={styles.buttonText}>Cancel Reminders</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16,
		gap: 12,
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 8,
	},
	text: {
		fontSize: 16,
	},
	button: {
		backgroundColor: '#0ea5e9',
		paddingVertical: 10,
		paddingHorizontal: 12,
		borderRadius: 8,
		alignSelf: 'flex-start',
	},
	buttonText: {
		color: 'white',
		fontWeight: '600',
	},
});

export default CartReminderExample;
