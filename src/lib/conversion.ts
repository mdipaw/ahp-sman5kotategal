export const formatValue = (v: number): number => v % 1 !== 0 ? Number(v.toFixed(4)) : v
export const getScoreDescription = (score: number): string => {
    return score >= 91 && score <= 100
        ? "Sangat Baik"
        : score >= 85 && score <= 90
            ? "Baik"
            : score >= 75 && score <= 84
                ? "Cukup"
                : score >= 60 && score <= 74
                    ? "Kurang"
                    : score >= 0 && score <= 59
                        ? "Tidak Memadai"
                        : "Skor Tidak Valid";
};
