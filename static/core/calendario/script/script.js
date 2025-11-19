const monthLabel = document.getElementById("monthLabel");
const calendarBody = document.getElementById("calendarBody");
let currentDate = new Date(2025, 9); // outubro 2025 (0 = janeiro)

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthLabel.textContent = currentDate.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric"
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let html = "<tr>";
  let day = 1;

  // espaços vazios
  for (let i = 0; i < firstDay; i++) {
    html += "<td></td>";
  }

  // dias do mês
  for (let i = firstDay; i < 7; i++) {
    html += `<td class="${day === 6 ? "active" : ""}">${day}</td>`;
    day++;
  }
  html += "</tr>";

  while (day <= daysInMonth) {
    html += "<tr>";
    for (let i = 0; i < 7 && day <= daysInMonth; i++) {
      html += `<td>${day}</td>`;
      day++;
    }
    html += "</tr>";
  }

  calendarBody.innerHTML = html;
}

document.getElementById("prevMonth").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};

document.getElementById("nextMonth").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};

renderCalendar();
