let students = JSON.parse(localStorage.getItem('students')) || [];
let attendance = JSON.parse(localStorage.getItem('attendance')) || {};

function saveData() {
  localStorage.setItem('students', JSON.stringify(students));
  localStorage.setItem('attendance', JSON.stringify(attendance));
}

function addStudent() {
  const name = document.getElementById('studentName').value.trim();
  if (!name) return alert("Enter a name.");
  if (students.includes(name)) return alert("Student already exists.");

  students.push(name);
  saveData();
  document.getElementById('studentName').value = '';
  renderStudents();
}

function renderStudents() {
  const list = document.getElementById('studentList');
  list.innerHTML = '';

  students.forEach(name => {
    const li = document.createElement('li');
    li.textContent = name;

    const presentBtn = document.createElement('button');
    presentBtn.textContent = 'Present';
    presentBtn.onclick = () => markAttendance(name, 'Present');

    const absentBtn = document.createElement('button');
    absentBtn.textContent = 'Absent';
    absentBtn.onclick = () => markAttendance(name, 'Absent');

    li.appendChild(presentBtn);
    li.appendChild(absentBtn);
    list.appendChild(li);
  });
}

function markAttendance(name, status) {
  const date = document.getElementById('date').value;
  const isHoliday = document.getElementById('holidayCheckbox').checked;

  if (!date) return alert("Select a date first.");
  if (isHoliday) return alert("It's a holiday.");

  if (!attendance[date]) attendance[date] = {};
  attendance[date][name] = status;

  saveData();
  alert(`${name} marked as ${status} on ${date}`);
}

function showHistory() {
  const historyDiv = document.getElementById('history');
  historyDiv.innerHTML = '<h3>Attendance History</h3>';

  for (let date in attendance) {
    const section = document.createElement('div');
    section.innerHTML = `<strong>${date}</strong><br>`;

    for (let name in attendance[date]) {
      section.innerHTML += `${name}: ${attendance[date][name]}<br>`;
    }

    section.innerHTML += '<hr>';
    historyDiv.appendChild(section);
  }
}

// Initial render
renderStudents();
