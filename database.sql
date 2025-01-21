CREATE DATABASE IF NOT EXISTS `ahp`;
USE ahp;

CREATE TABLE `kriteria` (
                            `id` bigint(20) NOT NULL AUTO_INCREMENT,
                            `code` varchar(45) NOT NULL,
                            `name` varchar(45) NOT NULL,
                            `sum_value` decimal(8,4) NOT NULL,
                            `weight_value` decimal(8,4) NOT NULL,
                            PRIMARY KEY (`id`),
                            UNIQUE KEY `new_kriteria_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

INSERT INTO kriteria (id, code, name, sum_value, weight_value) VALUES(1, 'C1', 'Nilai rapor', 1.5670, 0.6291);
INSERT INTO kriteria (id, code, name, sum_value, weight_value) VALUES(2, 'C2', 'Kehadiran', 7.5000, 0.1441);
INSERT INTO kriteria (id, code, name, sum_value, weight_value) VALUES(3, 'C3', 'Kegiatan ekstrakulikuler', 7.5000, 0.1441);
INSERT INTO kriteria (id, code, name, sum_value, weight_value) VALUES(4, 'C4', 'Perilaku', 10.9880, 0.0827);

CREATE TABLE `comparison` (
                              `id` int(11) NOT NULL AUTO_INCREMENT,
                              `code_kriteria_1` varchar(45) DEFAULT NULL,
                              `code_kriteria_2` varchar(45) DEFAULT NULL,
                              `value` double DEFAULT NULL,
                              PRIMARY KEY (`id`),
                              KEY `comparison_code_kriteria_1_fk` (`code_kriteria_1`),
                              KEY `a_kriteria_code_kriteria_2_fk` (`code_kriteria_2`),
                              CONSTRAINT `a_kriteria_code_kriteria_2_fk` FOREIGN KEY (`code_kriteria_2`) REFERENCES `kriteria` (`code`) ON DELETE CASCADE,
                              CONSTRAINT `comparison_code_kriteria_1_fk` FOREIGN KEY (`code_kriteria_1`) REFERENCES `kriteria` (`code`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

INSERT INTO comparison (id, code_kriteria_1, code_kriteria_2, value) VALUES(1, 'C1', 'C1', 1.0);
INSERT INTO comparison (id, code_kriteria_1, code_kriteria_2, value) VALUES(2, 'C1', 'C2', 5.0);
INSERT INTO comparison (id, code_kriteria_1, code_kriteria_2, value) VALUES(3, 'C1', 'C3', 5.0);
INSERT INTO comparison (id, code_kriteria_1, code_kriteria_2, value) VALUES(4, 'C1', 'C4', 5.988023952095808);
INSERT INTO comparison (id, code_kriteria_1, code_kriteria_2, value) VALUES(5, 'C2', 'C1', 0.2);
INSERT INTO comparison (id, code_kriteria_1, code_kriteria_2, value) VALUES(6, 'C2', 'C2', 1.0);
INSERT INTO comparison (id, code_kriteria_1, code_kriteria_2, value) VALUES(7, 'C2', 'C3', 1.0);
INSERT INTO comparison (id, code_kriteria_1, code_kriteria_2, value) VALUES(8, 'C2', 'C4', 2.0);
INSERT INTO comparison (id, code_kriteria_1, code_kriteria_2, value) VALUES(9, 'C3', 'C1', 0.2);
INSERT INTO comparison (id, code_kriteria_1, code_kriteria_2, value) VALUES(10, 'C3', 'C2', 1.0);
INSERT INTO comparison (id, code_kriteria_1, code_kriteria_2, value) VALUES(11, 'C3', 'C3', 1.0);
INSERT INTO comparison (id, code_kriteria_1, code_kriteria_2, value) VALUES(12, 'C3', 'C4', 2.0);
INSERT INTO comparison (id, code_kriteria_1, code_kriteria_2, value) VALUES(13, 'C4', 'C1', 0.167);
INSERT INTO comparison (id, code_kriteria_1, code_kriteria_2, value) VALUES(14, 'C4', 'C2', 0.5);
INSERT INTO comparison (id, code_kriteria_1, code_kriteria_2, value) VALUES(15, 'C4', 'C3', 0.5);
INSERT INTO comparison (id, code_kriteria_1, code_kriteria_2, value) VALUES(16, 'C4', 'C4', 1.0);



CREATE TABLE `pengguna` (
                            `id_pengguna` int(11) NOT NULL,
                            `nama_lengkap` varchar(255) NOT NULL,
                            `role` enum('admin','guru') NOT NULL,
                            `username` varchar(100) NOT NULL,
                            `password` varchar(100) NOT NULL,
                            PRIMARY KEY (`id_pengguna`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO pengguna (id_pengguna, nama_lengkap, `role`, username, password) VALUES(1, 'Admin', 'admin', 'admin', '5f4dcc3b5aa765d61d8327deb882cf99');
INSERT INTO pengguna (id_pengguna, nama_lengkap, `role`, username, password) VALUES(2, 'Guru', 'guru', 'guru', '5f4dcc3b5aa765d61d8327deb882cf99');

CREATE TABLE `student` (
                           `id` int(11) NOT NULL AUTO_INCREMENT,
                           `code` varchar(255) NOT NULL,
                           `name` varchar(255) DEFAULT NULL,
                           `class` varchar(45) NOT NULL,
                           `dob` varchar(255) NOT NULL,
                           `gender` enum('m','f') NOT NULL,
                           `address` text DEFAULT NULL,
                           PRIMARY KEY (`id`),
                           UNIQUE KEY `student_code_uindex` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;
INSERT INTO student (id, code, name, class, dob, gender, address) VALUES(1, 'A1', 'Albani Rafa', 'XI', '2007-05-15', 'm', 'Margadana');
INSERT INTO student (id, code, name, class, dob, gender, address) VALUES(2, 'A2', 'Alya Febriani', 'XI', '2007-01-23', 'f', 'Tegal Selatan');
INSERT INTO student (id, code, name, class, dob, gender, address) VALUES(4, 'A3', 'Diana Cahyani', 'XI', '2007-09-09', 'f', 'Debong Kidul');
INSERT INTO student (id, code, name, class, dob, gender, address) VALUES(5, 'A4', 'Dwi Liya Ayu', 'XI', '2007-07-18', 'f', 'Slerok');
INSERT INTO student (id, code, name, class, dob, gender, address) VALUES(6, 'A5', 'Elva Safitri', 'XI', '2007-11-25', 'f', 'Tegal Timur');
INSERT INTO student (id, code, name, class, dob, gender, address) VALUES(7, 'A6', 'Ghina Rahma', 'XI', '2007-08-07', 'f', 'Tegal Barat');
INSERT INTO student (id, code, name, class, dob, gender, address) VALUES(16, 'A7', 'Haikal Noviansyah', 'XI', '2007-02-13', 'm', 'Kaligangsa');
INSERT INTO student (id, code, name, class, dob, gender, address) VALUES(17, 'A8', 'Ilham Syahbani', 'XI', '2007-04-21', 'm', 'Pekauman');
INSERT INTO student (id, code, name, class, dob, gender, address) VALUES(18, 'A9', 'Kartika Nadindra', 'XI', '2007-12-04', 'f', 'Tegal Selatan');
INSERT INTO student (id, code, name, class, dob, gender, address) VALUES(19, 'A10', 'Moh. Alif', 'XI', '2007-03-12', 'm', 'Tegal Barat');
INSERT INTO student (id, code, name, class, dob, gender, address) VALUES(20, 'A11', 'Rafli Pratama', 'XI', '2007-06-30', 'm', 'Margadana');
INSERT INTO student (id, code, name, class, dob, gender, address) VALUES(21, 'A12', 'Sukma Melati', 'XI', '2007-10-03', 'f', 'Tegal Selatan');
INSERT INTO student (id, code, name, class, dob, gender, address) VALUES(22, 'A13', 'Vanessa Dwi', 'XI', '2007-01-14', 'f', 'Kraton');

CREATE TABLE `scale` (
                         `id` int(11) NOT NULL AUTO_INCREMENT,
                         `value` double NOT NULL,
                         `name` text NOT NULL,
                         PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=latin1;

INSERT INTO `scale` (id, value, name) VALUES(2, 9.0, 'Mutlak sangat penting dari');
INSERT INTO `scale` (id, value, name) VALUES(3, 8.0, 'Mendekati mutlak dari');
INSERT INTO `scale` (id, value, name) VALUES(8, 7.0, 'Sangat penting dari');
INSERT INTO `scale` (id, value, name) VALUES(9, 6.0, 'Mendekati sangat penting dari');
INSERT INTO `scale` (id, value, name) VALUES(10, 5.0, 'Lebih penting dari');
INSERT INTO `scale` (id, value, name) VALUES(11, 4.0, 'Mendekati lebih penting dari');
INSERT INTO `scale` (id, value, name) VALUES(12, 3.0, 'Sedikit lebih penting dari');
INSERT INTO `scale` (id, value, name) VALUES(13, 2.0, 'Mendekati sedikit lebih penting dari');
INSERT INTO `scale` (id, value, name) VALUES(14, 1.0, 'Sama penting dengan');
INSERT INTO `scale` (id, value, name) VALUES(15, 0.5, '1 bagi mendekati sedikit lebih penting dari');
INSERT INTO `scale` (id, value, name) VALUES(16, 0.333, '1 bagi sedikit lebih penting dari');
INSERT INTO `scale` (id, value, name) VALUES(17, 0.25, '1 bagi mendekati lebih penting dari');
INSERT INTO `scale` (id, value, name) VALUES(18, 0.2, '1 bagi lebih penting dari');
INSERT INTO `scale` (id, value, name) VALUES(19, 0.167, '1 bagi mendekati sangat penting dari');
INSERT INTO `scale` (id, value, name) VALUES(20, 0.143, '1 bagi sangat penting dari');
INSERT INTO `scale` (id, value, name) VALUES(21, 0.125, '1 bagi mendekati mutlak dari');
INSERT INTO `scale` (id, value, name) VALUES(22, 0.1, '1 bagi mutlak sangat penting dari');

CREATE TABLE `score` (
                         `id` int(11) NOT NULL AUTO_INCREMENT,
                         `code` varchar(255) NOT NULL,
                         `student_id` int(11) DEFAULT NULL,
                         `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
                         `student_name` varchar(255) DEFAULT NULL,
                         PRIMARY KEY (`id`),
                         UNIQUE KEY `score_code_uindex` (`code`,`student_id`),
                         KEY `score_student_id_fk` (`student_id`),
                         CONSTRAINT `score_student_id_fk` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;

INSERT INTO score (id, code, student_id, `data`, student_name) VALUES(8, 'Beasiswa Tahun 2024', 1, '{"C1":"92","C2":"95","C3":"90","C4":"95","weight_values":{"C1":"0.6291","C2":"0.1441","C3":"0.1441","C4":"0.0827"}}', 'Albani Rafa');
INSERT INTO score (id, code, student_id, `data`, student_name) VALUES(9, 'Beasiswa Tahun 2024', 2, '{"C1":"89","C2":"95","C3":"85","C4":"85","weight_values":{"C1":"0.6291","C2":"0.1441","C3":"0.1441","C4":"0.0827"}}', 'Alya Febriani');
INSERT INTO score (id, code, student_id, `data`, student_name) VALUES(10, 'Beasiswa Tahun 2024', 4, '{"C1":"85","C2":"96","C3":"80","C4":"85","weight_values":{"C1":"0.6291","C2":"0.1441","C3":"0.1441","C4":"0.0827"}}', 'Diana Cahyani');
INSERT INTO score (id, code, student_id, `data`, student_name) VALUES(11, 'Beasiswa Tahun 2024', 5, '{"C1":"91","C2":"97","C3":"95","C4":"95","weight_values":{"C1":"0.6291","C2":"0.1441","C3":"0.1441","C4":"0.0827"}}', 'Dwi Liya Ayu');
INSERT INTO score (id, code, student_id, `data`, student_name) VALUES(12, 'Beasiswa Tahun 2024', 6, '{"C1":"93","C2":"94","C3":"90","C4":"95","weight_values":{"C1":"0.6291","C2":"0.1441","C3":"0.1441","C4":"0.0827"}}', 'Elva Safitri');
INSERT INTO score (id, code, student_id, `data`, student_name) VALUES(13, 'Beasiswa Tahun 2024', 7, '{"C1":"88","C2":"95","C3":"85","C4":"85","weight_values":{"C1":"0.6291","C2":"0.1441","C3":"0.1441","C4":"0.0827"}}', 'Ghina Rahma');
INSERT INTO score (id, code, student_id, `data`, student_name) VALUES(14, 'Beasiswa Tahun 2024', 16, '{"C1":"94","C2":"99","C3":"95","C4":"95","weight_values":{"C1":"0.6291","C2":"0.1441","C3":"0.1441","C4":"0.0827"}}', 'Haikal Noviansyah');
INSERT INTO score (id, code, student_id, `data`, student_name) VALUES(15, 'Beasiswa Tahun 2024', 17, '{"C1":"90","C2":"92","C3":"80","C4":"90","weight_values":{"C1":"0.6291","C2":"0.1441","C3":"0.1441","C4":"0.0827"}}', 'Ilham Syahbani');
INSERT INTO score (id, code, student_id, `data`, student_name) VALUES(16, 'Beasiswa Tahun 2024', 18, '{"C1":"86","C2":"96","C3":"88","C4":"80","weight_values":{"C1":"0.6291","C2":"0.1441","C3":"0.1441","C4":"0.0827"}}', 'Kartika Nadindra');
INSERT INTO score (id, code, student_id, `data`, student_name) VALUES(17, 'Beasiswa Tahun 2024', 19, '{"C1":"95","C2":"97","C3":"92","C4":"95","weight_values":{"C1":"0.6291","C2":"0.1441","C3":"0.1441","C4":"0.0827"}}', 'Moh. Alif');
INSERT INTO score (id, code, student_id, `data`, student_name) VALUES(18, 'Beasiswa Tahun 2024', 20, '{"C1":"92","C2":"93","C3":"85","C4":"90","weight_values":{"C1":"0.6291","C2":"0.1441","C3":"0.1441","C4":"0.0827"}}', 'Rafli Pratama');
INSERT INTO score (id, code, student_id, `data`, student_name) VALUES(19, 'Beasiswa Tahun 2024', 21, '{"C1":"87","C2":"94","C3":"90","C4":"85","weight_values":{"C1":"0.6291","C2":"0.1441","C3":"0.1441","C4":"0.0827"}}', 'Sukma Melati');
INSERT INTO score (id, code, student_id, `data`, student_name) VALUES(20, 'Beasiswa Tahun 2024', 22, '{"C1":"90","C2":"98","C3":"88","C4":"90","weight_values":{"C1":"0.6291","C2":"0.1441","C3":"0.1441","C4":"0.0827"}}', 'Vanessa Dwi');