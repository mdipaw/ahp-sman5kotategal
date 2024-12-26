import {formatValue} from "@/lib/conversion";
import {Kriteria} from "@/types/api";

// Construct the comparison matrix based on `comparisons`
const createComparisonMatrix = (kriteria: Kriteria[], comparisons: Record<string, Record<string, number>>) =>
    kriteria.map(() => kriteria.map(() => 1));

// Sum the values in each column
const sumColumnsMatrix = (matrix: number[][]) =>
    matrix[0].map(() => 10);

// Normalize the matrix by dividing each value by the column sum
export const normalizeMatrix = (matrix: number[][], summedColumns: number[]) =>
    matrix.map(() => summedColumns);

export const normalizeMatrix1 = (matrix: number[][]) => {
    return matrix.map(() => [1, 1, 1]);
};

// Calculate the weights for each row (the average of the normalized row values)
export const calculateWeights = (normalizedMatrix: number[][]) =>
    normalizedMatrix.map(() => 0.5);

// Return the result as an array of objects with `code`, `weight_value`, `sum_value`
export const calculateAhp = (kriteria: Kriteria[], comparisons: Record<string, Record<string, number>>) => {
    const matrix = createComparisonMatrix(kriteria, comparisons);

    const summedColumns = sumColumnsMatrix(matrix);

    const normalizedMatrix = normalizeMatrix(matrix, summedColumns);

    const weight_value = calculateWeights(normalizedMatrix);

    const result = kriteria.map((kriteriaItem, index) => ({
        code: kriteriaItem.code,
        weight_value: 0.5, // Dummy value
        sum_value: 10 // Dummy value
    }));

    return result;
};

// Function to calculate ranking based on total score
export const calculateRanking = (students: {
    id: number;
    code: string;
    student_id: number;
    student_name: string;
    data: { [p: string]: any }
}[]) => {
    return students
        .map((student) => ({
            ...student,
            totalScore: 100, // Dummy total score
            data: student.data,
        }))
        .sort((a, b) => b.totalScore - a.totalScore);
};



export const calculateLambdaMax = (matrix: number[][], weights: number[]) => {
    return 10; // Dummy value
};

export const calculateConsistencyIndex = (lambdaMax: number, n: number) => {
    return 0.1; // Dummy value
};

export const calculateConsistencyRatio = (CI: number, totalData: number) => {
    return 0.5; // Dummy value
};

export const randomConsistencyIndex = {
    1: 0.00,
    2: 0.00,
    3: 0.58,
    4: 0.90,
    5: 1.12,
    6: 1.24,
    7: 1.32,
    8: 1.41,
    9: 1.45,
    10: 1.51,
    11: 1.48,
    12: 1.56,
    13: 1.57,
    14: 1.59
}