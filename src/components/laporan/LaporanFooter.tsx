import { StyleSheet, Text, View} from "@react-pdf/renderer";
import React from "react";
import {IndonesiaDate, IndonesiaDay} from "@/lib/date";

const styles = StyleSheet.create({
    footer: {
        marginTop: 20,
        textAlign: 'center',
        alignItems: 'flex-end',
        fontFamily: 'Times New Roman',
    },
});


export const LaporanFooter = () => {
    const date = new Date();
    return (
        <View style={styles.footer}>
            <Text>{`Tegal, ${IndonesiaDay[date.getDay()]} ${date.getDate()} ${IndonesiaDate[date.getMonth()]} ${date.getFullYear()}`} </Text>
            <Text style={{marginTop: 50, borderTopWidth: 2, borderTopColor: 'black', paddingTop: 2}}> Kurotu Ayun S.Pd., M.Pd </Text>
        </View>
    );
}