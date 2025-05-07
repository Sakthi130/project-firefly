// URL of the published Google Sheet as CSV
const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTfILz4H_k-hywt-s1D7n6Vvs3Sp_97ouZY-CdT0zu8dgkCKLdutfAgl1TOnqlKcYSc2nZgFVon6Nwi/pub?output=csv';

// Fetch and parse the sheet data
Papa.parse(sheetUrl, {
  download: true,
  header: true,
  complete: function(results) {
    const data = results.data.filter(row => row['Goals Name']); // filter out any empty rows
    const container = document.getElementById('cards-container');
    data.forEach(row => {
      // Create card element
      const card = document.createElement('div');
      card.className = 'relative bg-white rounded-xl shadow-md p-4 flex flex-col h-40';
      
      // Title (Goals Name)
      const title = document.createElement("h2");
      title.className = "text-md font-semibold text-gray-700";
      title.textContent = row['Goals Name'] || '';
      card.appendChild(title);

      // Current Status (large center)
      const current = document.createElement('div');
      current.className = 'flex-grow flex items-center justify-center';
      const curText = document.createElement('div');
      curText.className = 'text-4xl font-bold text-gray-800';
      curText.textContent = row['Current Status'] || '';
      current.appendChild(curText);
      card.appendChild(current);

      // Yesterday Status (bottom center)
      const yesterday = document.createElement('div');
      yesterday.className = 'mt-auto text-xs text-gray-500 text-center';
      yesterday.textContent = `Yesterday: ${row['Yesterday Status'] || ''}`;
      card.appendChild(yesterday);

      // Determine progression arrow
      let arrow = '';
      const curVal = parseFloat(row['Current Status']);
      const prevVal = parseFloat(row['Yesterday Status']);
      if (!isNaN(curVal) && !isNaN(prevVal)) {
        if (curVal > prevVal) arrow = '↑';
        else if (curVal < prevVal) arrow = '↓';
        else arrow = '→';
      }
      // Arrow element (right middle)
      if (arrow) {
        const arrowEl = document.createElement('div');
        arrowEl.className = 'absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl text-gray-700';
        arrowEl.textContent = arrow;
        card.appendChild(arrowEl);
      }

      container.appendChild(card);
    });
  }
});

// Function to schedule an alarm at a given hour (0-23)
function scheduleAlarm(hour) {
  const now = new Date();
  let alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, 0, 0);
  // If time has already passed today, set for tomorrow
  if (alarmTime <= now) {
    alarmTime.setDate(alarmTime.getDate() + 1);
  }
  const msUntil = alarmTime - now;
  setTimeout(() => {
    // Play alarm sound
    document.getElementById('alarmAudio').play();
    // Reschedule for next day
    scheduleAlarm(hour);
  }, msUntil);
}

// Schedule alarms for 11am, 3pm, 6pm
scheduleAlarm(11);
scheduleAlarm(15);
scheduleAlarm(18);
