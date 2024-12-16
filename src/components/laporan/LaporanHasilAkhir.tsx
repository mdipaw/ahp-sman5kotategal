import React from "react";
import {Text, View, StyleSheet} from "@react-pdf/renderer";
import {calculateRanking} from "@/lib/ahp";
import {formatValue} from "@/lib/conversion";
import {Kriteria, ScoreData} from "@/types/api";

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginBottom: 20,
    },
    title: {
        fontFamily: "Times New Roman",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 5,
    },
    sectionTitle: {
        fontFamily: "Times New Roman",
        fontSize: 16,
        fontWeight: "semibold",
        marginTop: 20,
        marginBottom: 10,
        textAlign: "center",
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
    tableCellNo: {
        fontFamily: "Times New Roman",
        width: '10%',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000',
        textAlign: 'center',
    },
    tableCellNoBorder: {
        fontFamily: "Times New Roman",
        width: '10%',
        borderBottomWidth: 1,
        textAlign: 'center',
    },
    noBorderRight: {
        borderRightWidth: 0,
    },
});

export const LaporanHasilAkhir = ({
                                      score,
                                      kriteria,
                                  }: {
    score: ScoreData[];
    kriteria: Kriteria[];
}) => {
    const rankedScores = calculateRanking(score as any);  // Assuming calculateRanking returns sorted array of students

    return (
        <View style={styles.container}>
            <Text style={[styles.title, {textAlign: 'center'}]}>Laporan Hasil Akhir</Text>
            <Text style={[styles.title, {textAlign: 'left'}]}>{score[0].code}</Text>
            <View style={styles.table}>
                {/* Table Header */}
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellNo}>No.</Text>
                    <Text style={styles.tableCell}>Nama Siswa</Text>
                    {kriteria.map((k, index) => (
                        <Text key={index} style={styles.tableCell}>
                            {k.name}
                        </Text>
                    ))}
                    <Text style={styles.tableCell}>Ranking</Text>
                </View>

                {/* Table Body */}
                {rankedScores.map((student, idx) => (
                    <View key={student.student_id} style={styles.tableRow}>
                        <Text style={styles.tableCellNo}>{idx + 1}</Text>
                        <Text style={styles.tableCell}>{student.student_name}</Text>
                        {kriteria.map((k) => (
                            <Text key={k.code} style={styles.tableCell}>
                                {formatValue(
                                    student.data[k.code] * student.data.weight_values[k.code]
                                )}
                            </Text>
                        ))}
                        <Text style={styles.tableCell}>{idx + 1}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};
