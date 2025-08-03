const today = new Date().toISOString().split("T")[0];
document.getElementById("todayDate").innerText = today;

const studentListEl = document.getElementById("studentList");
const historyListEl = document.getElementById("historyList");

// -------------------- Show Tabs ----------------------
function showTab(tab) {
  document.getElementById("attendanceTab").style.display = tab === 'attendance' ? 'block' : 'none';
  document.getElementById("historyTab").style.display = tab === 'history' ? 'block' : 'none';
  if (tab === 'history') loadHistory();
}

// -------------------- Load Students ------------------
function loadStudents() {
  studentListEl.innerHTML = "<p>Loading student list...</p>";
  db.collection("students").get().then(snapshot => {
    studentListEl.innerHTML = "";
    snapshot.forEach(doc => {
      const student = doc.data();
      const div = document.createElement("div");
      div.className = "student-entry";
      div.innerHTML = `
        <label>
          <input type="checkbox" id="${doc.id}" />
          ${student.name}
        </label>
      `;
      studentListEl.appendChild(div);
    });
  }).catch(err => {
    studentListEl.innerHTML = "<p>Error loading students.</p>";
    console.error("Error loading students:", err);
  });
}

// -------------------- Add Student ------------------
function addStudent() {
  const nameInput = document.getElementById("studentNameInput");
  const name = nameInput.value.trim();

  if (!name) {
    alert("Please enter a valid student name.");
    return;
  }

  db.collection("students").add({ name }).then(() => {
    nameInput.value = "";
    loadStudents(); // Reload student list
  }).catch(err => {
    console.error("Error adding student:", err);
    alert("Failed to add student.");
  });
}

// -------------------- Submit Attendance ------------------
function submitAttendance() {
  const checkboxes = document.querySelectorAll("input[type=checkbox]");
  const batch = db.batch();
  let anyChecked = false;

  checkboxes.forEach(cb => {
    if (cb.checked) {
      anyChecked = true;
      const ref = db.collection("attendance").doc();
      batch.set(ref, {
        studentId: cb.id,
        date: today
      });
    }
  });

  if (!anyChecked) {
    alert("⚠️ Please select at least one student.");
    return;
  }

  batch.commit().then(() => {
    alert("✅ Attendance submitted successfully!");
    checkboxes.forEach(cb => cb.checked = false);
  }).catch(err => {
    console.error("Error submitting attendance:", err);
    alert("❌ Failed to submit attendance.");
  });
}

// -------------------- Load Attendance History ------------------
function loadHistory() {
  historyListEl.innerHTML = "<p>Loading history...</p>";

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
      if (totalDays === 0) {
        historyListEl.innerHTML = "<p>No attendance records found.</p>";
        return;
      }

      let html = `<p>Total Days Recorded: <strong>${totalDays}</strong></p>`;
      html += `
        <table border="1" style="width:100%; text-align:center; border-collapse: collapse;">
          <thead>
            <tr>
              <th>Name</th>
              <th>Days Present</th>
              <th>Attendance %</th>
            </tr>
          </thead>
          <tbody>
      `;

      for (const id in students) {
        const s = students[id];
        const percent = ((s.count / totalDays) * 100).toFixed(1);
        html += `
          <tr>
            <td>${s.name}</td>
            <td>${s.count}</td>
            <td>${percent}%</td>
          </tr>
        `;
      }

      html += `</tbody></table>`;
      historyListEl.innerHTML = html;
    }).catch(err => {
      console.error("Error loading attendance:", err);
      historyListEl.innerHTML = "<p>Failed to load attendance history.</p>";
    });

  }).catch(err => {
    console.error("Error loading students:", err);
    historyListEl.innerHTML = "<p>Failed to load student data.</p>";
  });
}

// -------------------- Initialize ------------------
window.onload = loadStudents;
