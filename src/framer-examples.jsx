import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from './graphite/react/index.js';
import { copy } from './details.js';

const EASES = [
  { id: 'sharp', label: 'ease-out חד', value: [0.16, 1, 0.3, 1] },
  { id: 'soft', label: 'ease-out רך', value: [0.23, 1, 0.32, 1] },
  { id: 'linear', label: 'לינארי', value: [0, 0, 1, 1] },
];
const SPLITS = [
  { id: 'words', label: 'מילים' },
  { id: 'chars', label: 'אותיות' },
  { id: 'lines', label: 'שורות' },
];
const DIRECTIONS = [
  { id: 'up', label: 'מלמטה' },
  { id: 'down', label: 'מלמעלה' },
  { id: 'right', label: 'מימין' },
  { id: 'left', label: 'משמאל' },
];

const hiddenFrom = (direction, distance) => {
  const d = `${distance}%`;
  if (direction === 'down') return { y: `-${d}` };
  if (direction === 'right') return { x: d };
  if (direction === 'left') return { x: `-${d}` };
  return { y: d };
};

function piecesOf(text, split) {
  if (split === 'chars') return [...text];
  if (split === 'lines') {
    const lines = text.split(/\n/).map((line) => line.trim()).filter(Boolean);
    return lines.length ? lines : [text];
  }
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length ? words : [text];
}

function Headline({ text, split, stagger, duration, distance, direction, ease, rtl }) {
  const pieces = piecesOf(text, split);
  const from = hiddenFrom(direction, distance);
  return (
    <motion.p
      className="fm-line"
      dir={rtl ? 'rtl' : 'ltr'}
      lang={rtl ? 'he' : 'en'}
      aria-label={text}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger / 1000, delayChildren: 0.04 } } }}
    >
      {pieces.map((piece, i) => (
        <span className={split === 'lines' ? 'fm-mask fm-mask-line' : 'fm-mask'} key={i}>
          <motion.span
            aria-hidden
            variants={{
              hidden: { ...from, opacity: 0 },
              show: { x: 0, y: 0, opacity: 1, transition: { duration: duration / 1000, ease } },
            }}
          >{piece === ' ' ? '\u00a0' : piece}</motion.span>
        </span>
      ))}
    </motion.p>
  );
}

function Field({ label, value, unit, min, max, step, onChange, onDone }) {
  return (
    <label className="fm-field">
      <span>{label}</span>
      <span className="fm-num">{value}{unit}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} onPointerUp={onDone} onKeyUp={onDone} />
    </label>
  );
}

function Choice({ label, options, value, onChange }) {
  return (
    <fieldset className="fm-choice">
      <legend>{label}</legend>
      <div>
        {options.map((opt) => (
          <button type="button" key={opt.id} className={opt.id === value ? 'is-on' : ''} aria-pressed={opt.id === value} onClick={() => onChange(opt.id)}>{opt.label}</button>
        ))}
      </div>
    </fieldset>
  );
}

export function FramerExamples() {
  const reduced = !!useReducedMotion();
  const [text, setText] = useState('הכותרת נכנסת מכאן');
  const [split, setSplit] = useState('words');
  const [stagger, setStagger] = useState(50);
  const [duration, setDuration] = useState(600);
  const [distance, setDistance] = useState(110);
  const [direction, setDirection] = useState('up');
  const [easeId, setEaseId] = useState('sharp');
  const [run, setRun] = useState(0);
  const ease = EASES.find((e) => e.id === easeId) || EASES[0];
  const splitLabel = SPLITS.find((s) => s.id === split).label;
  const dirLabel = DIRECTIONS.find((d) => d.id === direction).label;
  const rtl = /[\u0590-\u05FF]/.test(text);
  const sentence = useMemo(() => (
    `כותרת לפי ${splitLabel}. כל חלק נכנס ${dirLabel}, ${stagger}ms אחרי הקודם, במשך ${duration}ms, מרחק ${distance}%, ${ease.label}.`
  ), [splitLabel, dirLabel, stagger, duration, distance, ease.label]);
  const play = () => setRun((n) => n + 1);

  return (
    <main id="main" className="fm-page">
      <header className="page-head">
        <h1>אנימציית כותרת</h1>
        <p className="lede" dir="rtl">משנים ערך, ואז הפעל שוב. המשפט למטה הוא מה שמועתק.</p>
      </header>
      <div className="fm-stage" key={reduced ? 'still' : run}>
        {reduced
          ? <p className="fm-line" dir={rtl ? 'rtl' : 'ltr'}>{text}</p>
          : <Headline text={text} split={split} stagger={stagger} duration={duration} distance={distance} direction={direction} ease={ease.value} rtl={rtl} />}
      </div>
      <label className="fm-text">
        <span>הכותרת</span>
        <textarea rows={2} value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <div className="fm-controls">
        <Choice label="פיצול" options={SPLITS} value={split} onChange={(id) => { setSplit(id); play(); }} />
        <Choice label="כיוון" options={DIRECTIONS} value={direction} onChange={(id) => { setDirection(id); play(); }} />
        <Choice label="עקומה" options={EASES} value={easeId} onChange={(id) => { setEaseId(id); play(); }} />
        <Field label="השהייה" value={stagger} unit="ms" min={0} max={120} step={5} onChange={setStagger} onDone={play} />
        <Field label="משך" value={duration} unit="ms" min={200} max={1000} step={20} onChange={setDuration} onDone={play} />
        <Field label="מרחק" value={distance} unit="%" min={20} max={140} step={5} onChange={setDistance} onDone={play} />
      </div>
      <div className="fm-acts">
        <p className="fm-copyline" dir="rtl">{sentence}</p>
        <Button variant="soft" size="sm" onClick={(e) => copy(sentence, e.currentTarget)}>Copy this</Button>
        <Button variant="ghost" size="sm" onClick={play} disabled={reduced}>הפעל שוב</Button>
      </div>
      {reduced ? <p className="fm-he">המערכת ביקשה פחות תנועה, אז הכותרת נשארת במקום.</p> : null}
    </main>
  );
}
