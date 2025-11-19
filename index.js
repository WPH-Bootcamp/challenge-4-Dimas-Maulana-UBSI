/**
 * Main Application - CLI Interface
 * File ini adalah entry point aplikasi
 */

import readlineSync from 'readline-sync';
import Student from './src/Student.js';
import StudentManager from './src/StudentManager.js';

// Inisialisasi StudentManager
const manager = new StudentManager();
manager.loadFromFile(); // Load data dari file saat aplikasi dimulai

/**
 * Menampilkan menu utama
 */
function displayMenu() {
  console.log('\n=================================');
  console.log('SISTEM MANAJEMEN NILAI SISWA');
  console.log('=================================');
  console.log('1. Tambah Siswa Baru');
  console.log('2. Lihat Semua Siswa');
  console.log('3. Cari Siswa');
  console.log('4. Update Data Siswa');
  console.log('5. Hapus Siswa');
  console.log('6. Tambah Nilai Siswa');
  console.log('7. Lihat Top 3 Siswa');
  console.log('8. Lihat Siswa per Kelas (BONUS)');
  console.log('9. Statistik Kelas (BONUS)');
  console.log('10. Keluar');
  console.log('=================================');
}

/**
 * Handler untuk menambah siswa baru
 */
function addNewStudent() {
  console.log('\n--- Tambah Siswa Baru ---');
  
  const id = readlineSync.question('Masukkan ID Siswa: ');
  const name = readlineSync.question('Masukkan Nama Siswa: ');
  const grade = readlineSync.question('Masukkan Kelas: ');
  
  try {
    const student = new Student(id, name, grade);
    const result = manager.addStudent(student);
    
    if (result) {
      console.log('✓ Siswa berhasil ditambahkan!');
    } else {
      console.log('✗ Gagal menambahkan siswa. ID mungkin sudah ada.');
    }
  } catch (error) {
    console.log('✗ Error:', error.message);
  }
}

/**
 * Handler untuk melihat semua siswa
 */
function viewAllStudents() {
  console.log('\n--- Daftar Semua Siswa ---');
  
  const students = manager.getAllStudents();
  
  if (students.length === 0) {
    console.log('Tidak ada data siswa.');
  } else {
    manager.displayAllStudents();
  }
}

/**
 * Handler untuk mencari siswa berdasarkan ID
 */
function searchStudent() {
  console.log('\n--- Cari Siswa ---');
  
  const id = readlineSync.question('Masukkan ID Siswa: ');
  const student = manager.findStudent(id);
  
  if (student) {
    console.log('\n✓ Siswa ditemukan:');
    student.displayInfo();
  } else {
    console.log('✗ Siswa dengan ID tersebut tidak ditemukan.');
  }
}

/**
 * Handler untuk update data siswa
 */
function updateStudent() {
  console.log('\n--- Update Data Siswa ---');
  
  // Tampilkan daftar siswa terlebih dahulu
  const students = manager.getAllStudents();
  if (students.length === 0) {
    console.log('Tidak ada data siswa.');
    return;
  }
  
  console.log('\nDaftar Siswa:');
  students.forEach((s, index) => {
    console.log(`${index + 1}. ID: ${s.id} - Nama: ${s.name}`);
  });
  
  const id = readlineSync.question('\nMasukkan ID Siswa yang akan diupdate: ');
  const student = manager.findStudent(id);
  
  if (!student) {
    console.log('✗ Siswa dengan ID tersebut tidak ditemukan.');
    return;
  }
  
  console.log('\nData saat ini:');
  student.displayInfo();
  
  console.log('\nMasukkan data baru (kosongkan jika tidak ingin mengubah):');
  const newName = readlineSync.question('Nama baru: ');
  const newClass = readlineSync.question('Kelas baru: ');
  
  const updateData = {};
  if (newName.trim()) updateData.name = newName;
  if (newClass.trim()) updateData.class = newClass;
  
  if (Object.keys(updateData).length === 0) {
    console.log('Tidak ada data yang diubah.');
    return;
  }
  
  const result = manager.updateStudent(id, updateData);
  
  if (result) {
    console.log('✓ Data siswa berhasil diupdate!');
  } else {
    console.log('✗ Gagal mengupdate data siswa.');
  }
}

/**
 * Handler untuk menghapus siswa
 */
function deleteStudent() {
  console.log('\n--- Hapus Siswa ---');
  
  // Tampilkan daftar siswa terlebih dahulu
  const students = manager.getAllStudents();
  if (students.length === 0) {
    console.log('Tidak ada data siswa.');
    return;
  }
  
  console.log('\nDaftar Siswa:');
  students.forEach((s, index) => {
    console.log(`${index + 1}. ID: ${s.id} - Nama: ${s.name}`);
  });
  
  const id = readlineSync.question('\nMasukkan ID Siswa yang akan dihapus: ');
  const student = manager.findStudent(id);
  
  if (!student) {
    console.log('✗ Siswa dengan ID tersebut tidak ditemukan.');
    return;
  }
  
  console.log('\nData siswa yang akan dihapus:');
  student.displayInfo();
  
  const confirm = readlineSync.question('\nApakah Anda yakin ingin menghapus? (y/n): ');
  
  if (confirm.toLowerCase() === 'y' || confirm.toLowerCase() === 'yes') {
    const result = manager.removeStudent(id);
    
    if (result) {
      console.log('✓ Siswa berhasil dihapus!');
    } else {
      console.log('✗ Gagal menghapus siswa.');
    }
  } else {
    console.log('Penghapusan dibatalkan.');
  }
}

/**
 * Handler untuk menambah nilai siswa
 */
function addGradeToStudent() {
  console.log('\n--- Tambah Nilai Siswa ---');
  
  // Tampilkan daftar siswa terlebih dahulu
  const students = manager.getAllStudents();
  if (students.length === 0) {
    console.log('Tidak ada data siswa.');
    return;
  }
  
  console.log('\nDaftar Siswa:');
  students.forEach((s, index) => {
    console.log(`${index + 1}. ID: ${s.id} - Nama: ${s.name}`);
  });
  
  const id = readlineSync.question('\nMasukkan ID Siswa: ');
  const student = manager.findStudent(id);
  
  if (!student) {
    console.log('✗ Siswa dengan ID tersebut tidak ditemukan.');
    return;
  }
  
  console.log('\nData siswa:');
  student.displayInfo();
  
  const subject = readlineSync.question('\nMasukkan mata pelajaran: ');
  const scoreInput = readlineSync.question('Masukkan nilai (0-100): ');
  const score = parseFloat(scoreInput);
  
  if (isNaN(score)) {
    console.log('✗ Nilai harus berupa angka!');
    return;
  }
  
  if (score < 0 || score > 100) {
    console.log('✗ Nilai harus antara 0-100!');
    return;
  }
  
  student.addGrade(subject, score);
  console.log(`Rata-rata baru: ${student.getAverage().toFixed(2)}`);
}

/**
 * Handler untuk melihat top students
 */
function viewTopStudents() {
  console.log('\n--- Top 3 Siswa ---');
  
  const topStudents = manager.getTopStudents(3);
  
  if (topStudents.length === 0) {
    console.log('Tidak ada data siswa.');
    return;
  }
  
  topStudents.forEach((studentData, index) => {
    console.log(`\n${index + 1}. ${studentData.name}`);
    console.log(`   Rata-rata: ${studentData.average.toFixed(2)}`);
  });
}

/**
 * BONUS: Handler untuk melihat siswa per kelas
 */
function viewStudentsByClass() {
  console.log('\n--- Lihat Siswa per Kelas ---');
  
  const students = manager.getAllStudents();
  if (students.length === 0) {
    console.log('Tidak ada data siswa.');
    return;
  }
  
  const className = readlineSync.question('Masukkan nama kelas (contoh: 10A): ');
  
  if (!className.trim()) {
    console.log('✗ Nama kelas tidak boleh kosong!');
    return;
  }
  
  manager.displayStudentsByClass(className);
}

/**
 * BONUS: Handler untuk melihat statistik kelas
 */
function viewClassStatistics() {
  console.log('\n--- Statistik Kelas ---');
  
  const students = manager.getAllStudents();
  if (students.length === 0) {
    console.log('Tidak ada data siswa.');
    return;
  }
  
  const className = readlineSync.question('Masukkan nama kelas (contoh: 10A): ');
  
  if (!className.trim()) {
    console.log('✗ Nama kelas tidak boleh kosong!');
    return;
  }
  
  manager.displayClassStatistics(className);
}

/**
 * Main program loop
 */
function main() {
  console.log('Selamat datang di Sistem Manajemen Nilai Siswa!');
  
  let running = true;
  
  while (running) {
    displayMenu();
    
    const pilihan = readlineSync.question('\nPilih menu (1-10): ');
    
    switch(pilihan) {
      case '1':
        addNewStudent();
        break;
      case '2':
        viewAllStudents();
        break;
      case '3':
        searchStudent();
        break;
      case '4':
        updateStudent();
        break;
      case '5':
        deleteStudent();
        break;
      case '6':
        addGradeToStudent();
        manager.saveToFile()
        break;
      case '7':
        viewTopStudents();
        break;
      case '8':
        viewStudentsByClass();
        break;
      case '9':
        viewClassStatistics();
        break;
      case '10':
        running = false;
        break;
      default:
        console.log('✗ Pilihan tidak valid. Silakan pilih 1-10.');
    }
    
    // Pause sebelum kembali ke menu
    if (running) {
      readlineSync.question('\nTekan Enter untuk melanjutkan...');
    }
  }
  
  console.log('\nTerima kasih telah menggunakan aplikasi ini!');
}

// Jalankan aplikasi
main();