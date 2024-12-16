export type User = {
    nama_lengkap: string;
    role: string;
}

export type Student = {
    id: number;
    code: string;
    name: string;
    class: string;
    dob: string;
    gender: string;
    address: string;
}

export type Scale = {
    id: number;
    value: number;
    name: string;
}

export type Kriteria = {
    id: number;
    code: string;
    name: string;
    sum_value: number;
    weight_value: number
}

export type Score<T> = {
    [key: string]: [{
        id: number;
        code: string;
        student_id: number;
        student_name: string;
        data: T
    }]
}
export type ScoreData = {
    code: string;
    student_id: string;
    data: { [key: string]: number };
    student_name: string;
    weight_values: { [key: string]: number };
}


export type Comparison = {
    id: number;
    code_kriteria_1: string;
    code_kriteria_2: string;
    value: number
}
