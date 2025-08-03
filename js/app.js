firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const today = new Date().toISOString().split("T")[0];
document.getElementById("todayDate").innerText = today;

const studentListEl = document.getElementById("studentList");
const historyListEl = document.getElementById("historyList");

function showTab(tab) {
  document.getElementById("attendanceTab").style.display = tab === 'attendance' ? 'block' : 'none';
  document.getElementById("historyTab").style.display = tab === 'history' ? 'block' : 'none';
  if (tab === 'history') loadHistory();
}

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
  alert("✅ Attendance submitted!");
}

function loadHistory() {
  historyListEl.innerHTML = "Loading...";
  db.collection("students").get().then(studentSnap => {
    const students = {};
    studentSnap.forEach(doc => {
      students[doc.id] = { name: doc.data().name, count: 0 };
    });

    db.collection("attendance").get().then(attSnap => {
      const attendanceDates = new Set();
      attSnap.forEach(doc => {
        const data = doc.data();
        attendanceDates.add(data.date);
        if (students[data.studentId]) {
          students[data.studentId].count += 1;
        }
      });

      const totalDays = attendanceDates.size;
      let html = `<p>Total Days: ${totalDays}</p>`;
      html += `<table border="1" style="width:100%; text-align:center;">
        <tr><th>Name</th><th>Present</th><th>Attendance %</th></tr>`;

      for (const id in students) {
        const s = students[id];
        const percent = totalDays > 0 ? ((s.count / totalDays) * 100).toFixed(1) : 0;
        html += `<tr><td>${s.name}</td><td>${s.count}</td><td>${percent}%</td></tr>`;
      }

      html += `</table>`;
      historyListEl.innerHTML = html;
    });
  });
}

window.onload = loadStudents;
