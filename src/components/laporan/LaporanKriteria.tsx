import {StyleSheet, Text, View} from "@react-pdf/renderer";
import React from "react";
import {Comparison, Kriteria} from "@/types/api";
import {IndonesiaDate, IndonesiaDay} from "@/lib/date";
import {
    calculateConsistencyIndex, calculateConsistencyRatio,
    calculateLambdaMax,
    calculateWeights,
    normalizeMatrix,
    normalizeMatrix1, randomConsistencyIndex
} from "@/lib/ahp";

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
    tableCellNo: {
        fontFamily: "Times New Roman",
        width: '20px',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#000',
        textAlign: 'center',
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

const calculateMatrix = (comparisons: Comparison[], criteria: string[]) => {
    const n = criteria.length;
    const matrix = Array(n).fill(null).map(() => Array(n).fill(1));

    comparisons.forEach(({code_kriteria_1, code_kriteria_2, value}) => {
        const i = criteria.indexOf(code_kriteria_1);
        const j = criteria.indexOf(code_kriteria_2);
        if (i !== -1 && j !== -1) {
            matrix[i][j] = value;
            matrix[j][i] = 1 / value;
        }
    });

    return matrix;
};

export const LaporanKriteria = (data: Kriteria[], comparison: Comparison[]) => {
    const criteria = Array.from(new Set(comparison.flatMap(({ code_kriteria_1, code_kriteria_2 }) => [code_kriteria_1, code_kriteria_2])));
    const matrix = calculateMatrix(comparison, criteria);
    const normalizedMatrix = normalizeMatrix1(matrix);
    const weights = calculateWeights(normalizedMatrix);
    const lambdaMax = calculateLambdaMax(matrix, weights);
    const CI = calculateConsistencyIndex(lambdaMax, criteria.length);
    const CR = calculateConsistencyRatio(CI, data.length);
    return (<View style={styles.section}>
            <Text style={[styles.title, {textAlign: 'center'}]}>Laporan Kriteria</Text>
            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCellNo}>No.</Text>
                    <Text style={styles.tableCell}>Id kriteria</Text>
                    <Text style={styles.tableCell}>Nama kriteria</Text>
                    <Text style={styles.tableCell}>Jumlah</Text>
                    <Text style={styles.tableCell}>Bobot kriteria</Text>
                </View>

                {data.map((item, index) => (
                    <View key={index} style={styles.tableRow}>
                        <Text style={styles.tableCellNo}>{index + 1}</Text>
                        <Text style={styles.tableCell}>{item.code}</Text>
                        <Text style={styles.tableCell}>{item.name}</Text>
                        <Text style={styles.tableCell}>{item.sum_value}</Text>
                        <Text style={styles.tableCell}>{item.weight_value}</Text>
                    </View>
                ))}
            </View>
            <Text style={{textAlign: "left"}}>RI = {randomConsistencyIndex[data.length as 1]} </Text>
            <Text style={{textAlign: "left"}}>λmaks = {lambdaMax.toFixed(4)}</Text>
            <Text style={{textAlign: "left"}}>Consistency Index = {CI?.toFixed(4)} </Text>
            <Text style={{textAlign: "left"}}>Consistency Ratio = {CR?.toFixed(4)}</Text>
        </View>
    )
}
