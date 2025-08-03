firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const today = new Date().toISOString().split("T")[0];
const studentListEl = document.getElementById("studentList");

function loadStudents() {
  db.collection("students").get().then(snapshot => {
    snapshot.forEach(doc => {
      const student = doc.data();
      const div = document.createElement("div");
      div.innerHTML = `
        <input type="checkbox" id="${doc.id}" />
        <label for="${doc.id}">${student.name}</label>
      `;
      studentListEl.appendChild(div);
    });
  });
}

function submitAttendance() {
  const checkboxes = document.querySelectorAll("input[type=checkbox]");
  checkboxes.forEach(cb => {
    if (cb.checked) {
      db.collection("attendance").add({
        studentId: cb.id,
        date: today
      });
    }
  });
  alert("Attendance submitted for " + today);
}

window.onload = loadStudents;
