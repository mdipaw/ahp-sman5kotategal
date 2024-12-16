import {StyleSheet, Text, View} from "@react-pdf/renderer";
import React from "react";
import {Student} from "@/types/api";

const styles = StyleSheet.create({
    section: {
        marginBottom: 10,
    },
    title: {
        fontFamily: "Times New Roman",
        fontSize: 18,
        fontWeight: "bold",
    },
    table: {
        width: '100%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000',
        marginVertical: 10,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableCell: {
        fontFamily: "Times New Roman",
        flex: 1,
        padding: 5,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000',
        textAlign: 'center',
    },
    noBorderRight: {
        borderRightWidth: 0,
    },
});

export const LaporanSiswa = (data: Student[]) => (
    <View style={styles.section}>
        <Text style={[styles.title, {textAlign: 'center'}]}>Laporan Data Siswa</Text>
    <View style={styles.table}>
        <View style={styles.tableRow}>
            <Text style={styles.tableCell}>No.</Text>
            <Text style={styles.tableCell}>Id siswa</Text>
            <Text style={styles.tableCell}>Nama</Text>
            <Text style={styles.tableCell}>Kelas</Text>
            <Text style={styles.tableCell}>Jenis kelamin</Text>
            <Text style={styles.tableCell}>Tanggal lahir</Text>
            <Text style={styles.tableCell}>Alamat</Text>
        </View>

        {data.map((item, index) => (
            <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{index + 1}</Text>
                <Text style={styles.tableCell}>{item.code}</Text>
                <Text style={styles.tableCell}>{item.name}</Text>
                <Text style={styles.tableCell}>{item.class}</Text>
                <Text style={styles.tableCell}>{item.gender === 'f'? 'Perempuan':'Laki-laki'}</Text>
                <Text style={styles.tableCell}>{item.dob}</Text>
                <Text style={styles.tableCell}>{item.address}</Text>
            </View>
        ))}
    </View>
    </View>
);
