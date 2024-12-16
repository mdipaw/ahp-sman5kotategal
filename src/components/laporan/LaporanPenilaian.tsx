import { StyleSheet, Text, View } from "@react-pdf/renderer";
import React from "react";
import { Kriteria, ScoreData } from "@/types/api";
import { getScoreDescription } from "@/lib/conversion";

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
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f3f4f6',
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
});

export const LaporanPenilaian = ({ score, kriteria }: { kriteria: Kriteria[], score: ScoreData[] }) => {
    return (
        <View style={styles.section}>
            <Text style={[styles.title, {textAlign: 'center'}]}>Laporan Penilaian</Text>
        <Text style={[styles.title, {marginTop: '10px'}]}>{score?score[0].code:null}</Text>
        <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
                <View style={[styles.tableCell, { flex: 1 }]}>
                    <Text style={{ textAlign: 'center' }}>Nama Siswa</Text>
                </View>
                {kriteria.map((kriteriaItem) => (
                    <View style={[styles.tableCell, { flex: 1 }]} key={kriteriaItem.code}>
                        <Text style={{ textAlign: 'center' }}>{kriteriaItem.name}</Text>
                    </View>
                ))}
            </View>

            {/* Table Body */}
            {score?.map((scoreItem) => {
                const data = JSON.parse(scoreItem.data as unknown as string);
                return (
                    <View style={styles.tableRow} key={scoreItem.student_name}>
                        {/* Nama Siswa */}
                        <View style={[styles.tableCell, { flex: 1 }]}>
                            <Text>{scoreItem.student_name}</Text>
                        </View>

                        {/* Kriteria */}
                        {kriteria.map((kriteriaItem) => {
                            const scoreValue = data[kriteriaItem.code];
                            return (
                                <View style={[styles.tableCell, { flex: 1 }]} key={kriteriaItem.code}>
                                    <Text>{scoreValue} = {getScoreDescription(scoreValue)}</Text>
                                </View>
                            );
                        })}
                    </View>
                );
            })}
        </View>
        </View>
    );
};
