'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { percentageChange } from '@busfare/core';
import { mockBusServices, type MockFareObservation } from '../data/mock-fares';

function formatRupees(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}

export default function Home() {
  const [selectedServiceId, setSelectedServiceId] = useState(mockBusServices[0].id);
  const [histories, setHistories] = useState<Record<string, MockFareObservation[]>>(() =>
    Object.fromEntries(mockBusServices.map((service) => [service.id, service.observations]))
  );
  const [demoRefreshCount, setDemoRefreshCount] = useState<Record<string, number>>({});
  const [target, setTarget] = useState('1300');
  const [targetMessage, setTargetMessage] = useState('');

  const service = mockBusServices.find((item) => item.id === selectedServiceId) ?? mockBusServices[0];
  const history = histories[service.id] ?? service.observations;
  const currentObservation = history[history.length - 1];
  const previousObservation = history[history.length - 2];
  const current = currentObservation.fare;
  const previous = previousObservation.fare;
  const change = percentageChange(previous, current);
  const average = useMemo(() => Math.round(history.reduce((sum, row) => sum + row.fare, 0) / history.length), [history]);
  const lowest = Math.min(...history.map((row) => row.fare));
  const highest = Math.max(...history.map((row) => row.fare));
  const lastThree = history.slice(-3);
  const demoEstimate = Math.round(lastThree.reduce((sum, row) => sum + row.fare, 0) / lastThree.length);
  const estimateDifference = demoEstimate - current;
  const chartData = history.map((row) => ({ date: row.label, fare: row.fare }));

  function addDemoObservation() {
    const index = demoRefreshCount[service.id] ?? 0;
    const nextFare = service.nextDemoFares[index % service.nextDemoFares.length];
    const now = new Date();
    const label = `Demo ${now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    const observation: MockFareObservation = {
      observedAt: now.toISOString(),
      label,
      fare: nextFare,
    };
    setHistories((previousHistories) => ({
      ...previousHistories,
      [service.id]: [...(previousHistories[service.id] ?? service.observations), observation],
    }));
    setDemoRefreshCount((counts) => ({ ...counts, [service.id]: index + 1 }));
    setTargetMessage(`Added fictional demo observation: ${formatRupees(nextFare)}. No live API was called.`);
  }

  function saveTarget(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(target);
    if (!Number.isFinite(amount) || amount <= 0) {
      setTargetMessage('Enter a target fare greater than ₹0.');
      return;
    }
    setTargetMessage(`Demo target set to ${formatRupees(amount)} for ${service.operator}. Notifications are not connected.`);
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand"><span className="brandIcon">₹</span><span>BusFare <b>Tracker</b></span></div>
        <span className="demoTag">FICTIONAL DEMO DATA</span>
      </header>

      <section className="intro">
        <p className="eyebrow">YOUR TRAVEL PRICE COMPANION</p>
        <h1>Know your fare.<br /><span>Track the change.</span></h1>
        <p className="subhead">Explore fare movement for sample bus services on the Bengaluru → Pune route.</p>
      </section>

      <section className="routeCard">
        <div>
          <span className="muted">DEMO ROUTE</span>
          <h2>Bengaluru <span className="arrow">→</span> Pune</h2>
          <p className="muted">All operators and prices on this page are fictional examples.</p>
        </div>
        <div className="travelDate">
          <label className="muted" htmlFor="service">SAMPLE BUS SERVICE</label>
          <select id="service" value={selectedServiceId} onChange={(event) => { setSelectedServiceId(event.target.value); setTargetMessage(''); }}>
            {mockBusServices.map((item) => <option key={item.id} value={item.id}>{item.operator}</option>)}
          </select>
          <b>{service.busType} · {service.departure}–{service.arrival}</b>
          <span className="muted">Journey duration: {service.duration}</span>
        </div>
      </section>

      <section className="metrics">
        <article className="metricCard"><span className="muted">LATEST DEMO FARE</span><div className="bigPrice">{formatRupees(current)}</div><span className="smallNote">Sample observation · {currentObservation.label}</span></article>
        <article className="metricCard"><span className="muted">CHANGE VS PREVIOUS</span><div className={`change ${change <= 0 ? 'down' : 'up'}`}>{change > 0 ? '+' : ''}{change.toFixed(1)}%</div><span className="smallNote">{formatRupees(previous)} → {formatRupees(current)} · {change < 0 ? 'decrease' : change > 0 ? 'increase' : 'no change'}</span></article>
        <article className="metricCard"><span className="muted">OBSERVATION AVERAGE</span><div className="bigPrice">{formatRupees(average)}</div><span className="smallNote">Lowest {formatRupees(lowest)} · Highest {formatRupees(highest)}</span></article>
      </section>

      <section className="panel">
        <div className="panelHeader"><div><p className="eyebrow">TIMESTAMPED FARE HISTORY</p><h3>{service.operator}</h3></div><span className="period">{history.length} sample observations</span></div>
        <div className="chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
          <defs><linearGradient id="fareFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#287d67" stopOpacity={0.2} /><stop offset="100%" stopColor="#287d67" stopOpacity={0.01} /></linearGradient></defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9eeeb" />
          <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#75817c', fontSize: 11 }} minTickGap={16} />
          <YAxis domain={['dataMin - 100', 'dataMax + 100']} tickLine={false} axisLine={false} tick={{ fill: '#75817c', fontSize: 12 }} tickFormatter={(value) => `₹${value}`} width={64} />
          <Tooltip formatter={(value) => [formatRupees(Number(value)), 'Fictional demo fare']} labelFormatter={(label) => `Observed: ${label}`} />
          <Area type="monotone" dataKey="fare" stroke="#287d67" strokeWidth={3} fill="url(#fareFill)" activeDot={{ r: 5 }} />
        </AreaChart></ResponsiveContainer></div>
        <div className="historyTableWrap"><table className="historyTable"><thead><tr><th>Observation timestamp</th><th>Demo fare</th><th>Change from previous</th></tr></thead><tbody>
          {history.slice().reverse().slice(0, 8).map((row, index, rows) => {
            const previousRow = history[history.length - 2 - index];
            const rowChange = previousRow ? percentageChange(previousRow.fare, row.fare) : null;
            return <tr key={`${row.observedAt}-${index}`}><td>{row.label}</td><td>{formatRupees(row.fare)}</td><td>{rowChange === null ? '—' : <span className={rowChange <= 0 ? 'down' : 'up'}>{rowChange > 0 ? '+' : ''}{rowChange.toFixed(1)}%</span>}</td></tr>;
          })}
        </tbody></table></div>
        <p className="disclaimer">All data is locally generated demonstration data. It is not from redBus, Pay2All, or any live supplier. Added observations exist only in this browser session and are not saved to a database.</p>
        <button className="secondaryButton" type="button" onClick={addDemoObservation}>＋ Add demo observation</button>
      </section>

      <section className="panel predictionPanel">
        <div><p className="eyebrow">EXPERIMENTAL DEMONSTRATION</p><h3>Simple next-fare estimate</h3><p className="muted">This is a basic average of the last three demo observations, not an AI prediction or real-world forecast.</p></div>
        <div className="predictionValue"><span className="muted">DEMO ESTIMATE</span><strong>{formatRupees(demoEstimate)}</strong><span className={`smallNote ${estimateDifference <= 0 ? 'down' : 'up'}`}>{estimateDifference > 0 ? '+' : ''}{formatRupees(estimateDifference)} vs latest demo fare</span></div>
      </section>

      <section className="panel alertPanel">
        <div><p className="eyebrow">PRICE WATCH</p><h3>Set a target fare</h3><p className="muted">This only displays a demo confirmation; no notification service is connected.</p></div>
        <form className="targetForm" onSubmit={saveTarget}><label htmlFor="target">Target fare (₹)</label><div className="targetControls"><input id="target" type="number" min="1" step="1" value={target} onChange={(event) => setTarget(event.target.value)} required /><button type="submit">Set target</button></div></form>
        {targetMessage && <p className="targetMessage" role="status">{targetMessage}</p>}
      </section>
      <footer>BusFare Tracker · Prototype v0.2 · Local fictional data only · No API key required</footer>
    </main>
  );
}
