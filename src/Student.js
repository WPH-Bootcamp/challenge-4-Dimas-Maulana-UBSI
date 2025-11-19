/**
 * Class Student
 * Representasi dari seorang siswa dengan data dan nilai-nilainya
 * 
 * TODO: Implementasikan class Student dengan:
 * - Constructor untuk inisialisasi properti (id, name, class, grades)
 * - Method addGrade(subject, score) untuk menambah nilai mata pelajaran
 * - Method getAverage() untuk menghitung rata-rata nilai
 * - Method getGradeStatus() untuk menentukan status Lulus/Tidak Lulus
 * - Method displayInfo() untuk menampilkan informasi siswa
 * 
 * Kriteria Lulus: rata-rata >= 75
 */

class Student {
  // TODO: Implementasikan constructor
  // Properti yang dibutuhkan:
  // - id: ID unik siswa
  // - name: Nama siswa
  // - class: Kelas siswa
  // - grades: Object untuk menyimpan nilai {subject: score}
  #id;
  #name
  #class
  #grades
  
  constructor(id, name, studentClass) {
    // Implementasi constructor di sini
    this.#id = id;
    this.#name = name;
    this.#class = studentClass
    this.#grades = {}
  }

  get id(){
    return this.#id;
  }

  get name(){
    return this.#name;
  }

  get studentClass(){
    return this.#class;
  }

  /**
   * Menambah atau update nilai mata pelajaran
   * @param {string} subject - Nama mata pelajaran
   * @param {number} score - Nilai (0-100)
   * TODO: Validasi bahwa score harus antara 0-100
   */
  addGrade(subject, score) {
    if (score < 0 || score > 100) throw new Error("Nilai harus 0-100");

    this.#grades[subject] = score;
  }


  /**
   * Menghitung rata-rata nilai dari semua mata pelajaran
   * @returns {number} Rata-rata nilai
   * TODO: Hitung total nilai dibagi jumlah mata pelajaran
   */
  getAverage() {
    //Implementasi method disini
    const subjects = Object.keys(this.#grades);
    if (subjects.length === 0) return 0;

    const total = subjects.reduce((sum, sub) => sum + this.#grades[sub], 0);
    return total / subjects.length;
  }


  /**
   * Menentukan status kelulusan siswa
   * @returns {string} "Lulus" atau "Tidak Lulus"
   * TODO: Return "Lulus" jika rata-rata >= 75, selain itu "Tidak Lulus"
   */
  getGradeStatus() {
    // Implementasi method di sini
    if(this.getAverage() >= 75){
      return "Lulus";
    }
    else{
      return "Tidak Lulus";
    }
  }

  /**
   * Menampilkan informasi lengkap siswa
   * TODO: Tampilkan ID, Nama, Kelas, semua nilai, rata-rata, dan status
   */
  displayInfo() {
    console.log(`ID     : ${this.#id}`);
    console.log(`Nama   : ${this.#name}`);
    console.log(`Kelas  : ${this.#class}`);

    const subjects = Object.keys(this.#grades);

    if (subjects.length === 0) {
      console.log("Belum ada nilai yang ditambahkan.");
    } else {
      console.log("Semua Nilai:");
      subjects.forEach(sub => {
        console.log(`- ${sub}: ${this.#grades[sub]}`);
      });
    }

    console.log(`Rata-rata: ${this.getAverage().toFixed(2)}`);
    console.log(`Status   : ${this.getGradeStatus()}`);
  }

  /**
   * 
   * @param {data}
   * untuk mengset nilainya karena tidak bisa di set dari luar kelas
   * karena itu dibuat method baru di dalam class student
   */
  updateData(data){
    
    if(data.id)this.#id = data.id;
    if(data.name)this.#name = data.name;
    if(data.class)this.#class = data.class;

  }

  toJSON() {
    return {
        id: this.#id,
        name: this.#name,
        class : this.#class,
        grades : this.#grades,
    };
  };

  static fromJSON(data) {
    const student = new Student(
        data.id ?? 0,
        data.name ?? "Unnamed",
        data.class ?? "-"
    );

    student.#grades = data.grades ?? {};
    return student;
  }


}

export default Student;
