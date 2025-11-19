/**
 * Class StudentManager
 * Mengelola koleksi siswa dan operasi-operasi terkait
 * 
 * TODO: Implementasikan class StudentManager dengan:
 * - Constructor untuk inisialisasi array students
 * - Method addStudent(student) untuk menambah siswa
 * - Method removeStudent(id) untuk menghapus siswa
 * - Method findStudent(id) untuk mencari siswa
 * - Method updateStudent(id, data) untuk update data siswa
 * - Method getAllStudents() untuk mendapatkan semua siswa
 * - Method getTopStudents(n) untuk mendapatkan top n siswa
 * - Method displayAllStudents() untuk menampilkan semua siswa
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Student from './Student.js';

// Untuk mengganti __dirname di ES Module:
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class StudentManager {
  // TODO: Implementasikan constructor
  // Properti yang dibutuhkan:
  // - students: Array untuk menyimpan semua siswa
  #students
  constructor() {
    // Implementasi constructor di sini
    this.#students = [];
  }

  /**
   * Menambah siswa baru ke dalam sistem
   * @param {Student} student - Object Student yang akan ditambahkan
   * @returns {boolean} true jika berhasil, false jika ID sudah ada
   * TODO: Validasi bahwa ID belum digunakan
   */
  addStudent(student) {
    // Implementasi method di sini
    const idStudent = this.#students.find(s => s.id === student.id);
    if(idStudent){
      return false;
    }
    this.#students.push(student);
    this.saveToFile();
    return true;
  }

  /**
   * Menghapus siswa berdasarkan ID
   * @param {string} id - ID siswa yang akan dihapus
   * @returns {boolean} true jika berhasil, false jika tidak ditemukan
   * TODO: Cari dan hapus siswa dari array
   */
  removeStudent(id) {
    // Implementasi method di sini
    const index = this.#students.findIndex(s => s.id === id);
    if (index === -1) {
      console.log(`Siswa dengan ID ${id} tidak ditemukan.`);
      return false;
      
    }
    this.#students.splice(index,1)
    console.log("Siswa Berhasil Dihapus")
    this.saveToFile()
    return true;
  }

  /**
   * Mencari siswa berdasarkan ID
   * @param {string} id - ID siswa yang dicari
   * @returns {Student|null} Object Student jika ditemukan, null jika tidak
   * TODO: Gunakan method array untuk mencari siswa
   */
  findStudent(id) {
    // Implementasi method di sini
    const student = this.#students.find(s => s.id === id);
    if(!student){
      return null;
    }
    return student;
  }

  /**
   * Update data siswa
   * @param {string} id - ID siswa yang akan diupdate
   * @param {object} data - Data baru (name, class, dll)
   * @returns {boolean} true jika berhasil, false jika tidak ditemukan
   * TODO: Cari siswa dan update propertinya
   */
  updateStudent(id, data) {
    // Implementasi method di sini
    const student = this.findStudent(id);
    if (!student) return false;
    
    student.updateData(data);
    this.saveToFile()
    return true;
  }

  /**
   * Mendapatkan semua siswa
   * @returns {Array} Array berisi semua siswa
   */
  getAllStudents() {
    // Implementasi method di sini
    return this.#students;
  }

  /**
   * Mendapatkan top n siswa berdasarkan rata-rata nilai
   * @param {number} n - Jumlah siswa yang ingin didapatkan
   * @returns {Array} Array berisi top n siswa
   * TODO: Sort siswa berdasarkan rata-rata (descending) dan ambil n teratas
   */
  getTopStudents(n) {
    // Implementasi method di sini
    const student = this.#students.map(s => ({name : s.name,average : s.getAverage()})).sort((a, b) => b.average - a.average);
    return student.slice(0,n);
  }

  /**
   * Menampilkan informasi semua siswa
   * TODO: Loop semua siswa dan panggil displayInfo() untuk masing-masing
   */
  displayAllStudents() {
    // Implementasi method di sini
    console.log("======= Semua Data Siswa =========")
    this.#students.forEach(s => {
      s.displayInfo();
      console.log("\n")
    });
  }

  /**
   * BONUS: Mendapatkan siswa berdasarkan kelas
   * @param {string} className - Nama kelas
   * @returns {Array} Array siswa dalam kelas tersebut
   */
  getStudentsByClass(className) {
    return this.#students.filter(s => 
      s.studentClass.toLowerCase() === className.toLowerCase()
    );
  }   

  /**
   * BONUS: Mendapatkan statistik kelas
   * @param {string} className - Nama kelas
   * @returns {object} Object berisi statistik (jumlah siswa, rata-rata kelas, dll)
   */
   getClassStatistics(className) {
    const students = this.getStudentsByClass(className);
    
    if (students.length === 0) {
      return {
        className: className,
        totalStudents: 0,
        classAverage: 0,
        highestAverage: 0,
        lowestAverage: 0,
        passedStudents: 0,
        failedStudents: 0,
        passRate: 0
      };
    }

    // Filter siswa yang memiliki nilai
    const studentsWithGrades = students.filter(s => s.getAverage() > 0);
    
    if (studentsWithGrades.length === 0) {
      return {
        className: className,
        totalStudents: students.length,
        classAverage: 0,
        highestAverage: 0,
        lowestAverage: 0,
        passedStudents: 0,
        failedStudents: 0,
        passRate: 0,
        message: "Belum ada siswa yang memiliki nilai"
      };
    }

    // Hitung rata-rata kelas
    const totalAverage = studentsWithGrades.reduce((sum, s) => sum + s.getAverage(), 0);
    const classAverage = totalAverage / studentsWithGrades.length;

    // Cari nilai tertinggi dan terendah
    const averages = studentsWithGrades.map(s => s.getAverage());
    const highestAverage = Math.max(...averages);
    const lowestAverage = Math.min(...averages);

    // Hitung siswa lulus dan tidak lulus
    const passedStudents = studentsWithGrades.filter(s => s.getGradeStatus() === "Lulus").length;
    const failedStudents = studentsWithGrades.length - passedStudents;
    const passRate = (passedStudents / studentsWithGrades.length) * 100;

    // Cari top student di kelas
    const topStudent = studentsWithGrades.reduce((top, current) => 
      current.getAverage() > top.getAverage() ? current : top
    );

    return {
      className: className,
      totalStudents: students.length,
      studentsWithGrades: studentsWithGrades.length,
      classAverage: parseFloat(classAverage.toFixed(2)),
      highestAverage: parseFloat(highestAverage.toFixed(2)),
      lowestAverage: parseFloat(lowestAverage.toFixed(2)),
      passedStudents: passedStudents,
      failedStudents: failedStudents,
      passRate: parseFloat(passRate.toFixed(2)),
      topStudent: {
        id: topStudent.id,
        name: topStudent.name,
        average: parseFloat(topStudent.getAverage().toFixed(2))
      }
    };
  }

  displayStudentsByClass(className) {
    const students = this.getStudentsByClass(className);
    
    if (students.length === 0) {
      console.log(`Tidak ada siswa di kelas ${className}`);
      return;
    }
    
    console.log(`\n======= Siswa Kelas ${className} =========`);
    students.forEach((s, index) => {
      console.log(`\n${index + 1}.`);
      s.displayInfo();
    });
  }

  displayClassStatistics(className) {
    const stats = this.getClassStatistics(className);
    
    console.log(`\n========================================`);
    console.log(`  STATISTIK KELAS ${stats.className}`);
    console.log(`========================================`);
    
    if (stats.totalStudents === 0) {
      console.log(`Tidak ada siswa di kelas ${className}`);
      return;
    }
    
    console.log(`Total Siswa           : ${stats.totalStudents}`);
    
    if (stats.message) {
      console.log(`\n${stats.message}`);
      return;
    }
    
    console.log(`Siswa dengan Nilai    : ${stats.studentsWithGrades}`);
    console.log(`Rata-rata Kelas       : ${stats.classAverage}`);
    console.log(`Nilai Tertinggi       : ${stats.highestAverage}`);
    console.log(`Nilai Terendah        : ${stats.lowestAverage}`);
    console.log(`\nStatus Kelulusan:`);
    console.log(`  - Lulus             : ${stats.passedStudents} siswa`);
    console.log(`  - Tidak Lulus       : ${stats.failedStudents} siswa`);
    console.log(`  - Tingkat Kelulusan : ${stats.passRate}%`);
    console.log(`\nSiswa Terbaik:`);
    console.log(`  ${stats.topStudent.name} (${stats.topStudent.id})`);
    console.log(`  Rata-rata: ${stats.topStudent.average}`);
    console.log(`========================================`);
  }


   saveToFile(){
        const dataFile = path.join(__dirname, 'students.json')
        const data = {
            student: this.#students.map(s => s.toJSON())
        };
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  }

  loadFromFile() {
      const dataFile = path.join(__dirname, 'students.json');

      if (!fs.existsSync(dataFile)) {
          return;
      }

      try {
          const data = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
          this.#students = (data.student ?? []).map(s => Student.fromJSON(s))
      } catch (err) {
          this.#students = [];
      }
  }


}

export default StudentManager;
