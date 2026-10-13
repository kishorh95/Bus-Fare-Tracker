type Observation = {
  platform: string; origin: string; destination: string; travelDate: string;
  service: string; fare: number; observedAt: string;
};

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const form = $('fare-form') as HTMLFormElement;
const status = $('status');
const historyList = $('history');

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] ?? char));
}

async function getObservations(): Promise<Observation[]> {
  const result = await chrome.storage.local.get({ observations: [] });
  return result.observations as Observation[];
}

async function renderHistory(): Promise<void> {
  const observations = await getObservations();
  if (!observations.length) {
    historyList.innerHTML = '<li class="empty">No fares saved yet.</li>';
    return;
  }
  historyList.innerHTML = observations.slice(-5).reverse().map((item) =>
    `<li><strong>₹${item.fare.toLocaleString('en-IN')}</strong> · ${escapeHtml(item.origin)} → ${escapeHtml(item.destination)}<br>${escapeHtml(item.travelDate)} · ${escapeHtml(item.service)}<br><span>${new Date(item.observedAt).toLocaleString()}</span></li>`
  ).join('');
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const platform = ($('platform') as HTMLInputElement).value.trim();
  const origin = ($('origin') as HTMLInputElement).value.trim();
  const destination = ($('destination') as HTMLInputElement).value.trim();
  const travelDate = ($('travel-date') as HTMLInputElement).value;
  const service = ($('service') as HTMLInputElement).value.trim();
  const fare = Number(($('fare') as HTMLInputElement).value);
  if (!platform || !origin || !destination || origin.toLowerCase() === destination.toLowerCase() || !travelDate || !service || !Number.isFinite(fare) || fare <= 0) {
    status.textContent = 'Check all fields; fare must be positive and route cities must differ.';
    return;
  }
  const observations = await getObservations();
  observations.push({ platform, origin, destination, travelDate, service, fare, observedAt: new Date().toISOString() });
  await chrome.storage.local.set({ observations });
  (form.querySelector('#fare') as HTMLInputElement).value = '';
  status.textContent = 'Fare saved locally in this browser.';
  await renderHistory();
});

$('export').addEventListener('click', async () => {
  const observations = await getObservations();
  if (!observations.length) { status.textContent = 'Save at least one fare before exporting.'; return; }
  const columns: (keyof Observation)[] = ['platform', 'origin', 'destination', 'travelDate', 'service', 'fare', 'observedAt'];
  const csv = [columns.join(','), ...observations.map((row) => columns.map((column) => `"${String(row[column]).replace(/"/g, '""')}"`).join(','))].join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = 'busfare-observations.csv'; link.click(); URL.revokeObjectURL(url);
  status.textContent = 'CSV export started.';
});

void renderHistory();
