import { StyleSheet, Text, View, Image, Font } from "@react-pdf/renderer";
import React from "react";

// Register custom font
Font.register({
    family: 'Times New Roman',
    src: "/tmr.woff"
});

// Styles
const styles = StyleSheet.create({
    header: {
        flexDirection: 'row', // Align items horizontally (logo + text)
        alignItems: 'center', // Vertically center content
        justifyContent: 'flex-start', // Ensure no space between logo and text
        marginBottom: 20,
        fontFamily: 'Times New Roman',
        borderBottomWidth: 2, // Black line under header
        borderBottomColor: 'black',
        paddingBottom: 10, // Optional, gives space before the line
    },
    logo: {
        width: 60, // Logo width
        height: 60, // Logo height
        position: 'absolute',
        left: 50 ,
    },
    textContainer: {
        flex: 1, // Allow text container to take up remaining space
        textAlign: 'center', // Center the text horizontally
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Times New Roman',
    },
    subtitle: {
        fontSize: 10,
        marginVertical: 4,
        fontFamily: 'Times New Roman',
    },
});

export const LaporanHeader = () => (
    <View style={styles.header}>
        {/* Logo on the left */}
        <Image src="/images.jpg" style={styles.logo} />

        {/* Text container, centered horizontally */}
        <View style={styles.textContainer}>
            <Text style={styles.subtitle}>SMA N 5 KOTA TEGAL</Text>
            <Text>Jl. Kali Kemiri II, Margadana</Text>
            <Text>Kec. Margadana, Kota Tegal, Jawa Tengah 52143</Text>
        </View>
    </View>
);
