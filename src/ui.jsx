import { useState } from 'react';
import {
  Avatar, Badge, Button, Card, Checkbox, ChipGroup, Divider, IconButton, Input,
  Kbd, ListRow, Progress, RadioGroup, Select, SettingRow,
  SliderField, Switch, Textarea, Toast,
} from './graphite/react/index.js';

const BUTTONS = [
  { id: 'primary', label: 'Primary', role: 'The one action to take' },
  { id: 'secondary', label: 'Secondary', role: 'The other choice beside it' },
  { id: 'soft', label: 'Soft', role: 'A quiet action, such as copy' },
  { id: 'ghost', label: 'Ghost', role: 'A tool in a row' },
  { id: 'overlay', label: 'Overlay', role: 'An action on a picture' },
];
const SIZES = [
  { id: 'sm', label: 'Small', role: 'Inside a row, a menu, or a toolbar' },
  { id: 'md', label: 'Medium', role: 'The usual size for an action on the page' },
  { id: 'lg', label: 'Large', role: 'The main action, or a target that must be easy to hit' },
];
const TYPE = ['display', 'press', 'title', 'body', 'label', 'caption', 'micro', 'timer', 'code'];
const GRAPHITE = [0, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 500, 600, 700, 750, 775, 800, 825, 850, 900, 925, 950, 975];
const TEXT = ['primary', 'secondary', 'placeholder', 'danger', 'success', 'warning', 'info', 'accent'];
const SURFACES = ['page', 'stage', 'surface', 'well', 'fill', 'inverse'];
const SPACE = [2, 4, 8, 12, 16, 20, 24, 32, 40];
const RADII = [2, 6, 8, 12, 18, 32, 'full'];

function Chapter({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className={open ? 'ui-chapter is-open' : 'ui-chapter'}>
      <h2>
        <button type="button" className="ui-chapter-sum" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {title}
        </button>
      </h2>
      {open ? <div className="ui-chapter-body">{children}</div> : null}
    </section>
  );
}

function Group({ title, note, children, stack }) {
  return (
    <section className="ui-panel">
      <h3>{title}</h3>
      {note ? <p className="ui-role">{note}</p> : null}
      <div className={stack ? 'ui-stack' : 'ui-row'}>{children}</div>
    </section>
  );
}

function Swatch({ name, color }) {
  return (
    <span className="ui-swatch">
      <i style={{ background: color }} />
      <span>{name}</span>
    </span>
  );
}

export function UiPage() {
  const [on, setOn] = useState(true);
  const [amount, setAmount] = useState(40);
  return (
    <main id="main" className="ui-page">
      <header className="page-head">
        <h1>UI</h1>
      </header>

      <Chapter title="Type">
        <Group title="Styles">
          {TYPE.map((name) => (
            <div className="ui-type" key={name}>
              <span className={`gt-text-${name}`}>Design skills</span>
              <span className="ui-meta">{name}</span>
            </div>
          ))}
        </Group>
      </Chapter>

      <Chapter title="Color">
        <Group title="Graphite">
          {GRAPHITE.map((step) => <Swatch key={step} name={step} color={`var(--graphite-${step})`} />)}
        </Group>
        <div className="ui-split">
          <Group title="Text">
            {TEXT.map((name) => <Swatch key={name} name={name} color={`var(--text-${name})`} />)}
          </Group>
          <Group title="Surface">
            {SURFACES.map((name) => <Swatch key={name} name={name} color={`var(--bg-${name})`} />)}
          </Group>
        </div>
      </Chapter>

      <Chapter title="Foundation">
        <div className="ui-split">
          <Group title="Space">
            {SPACE.map((n) => (
              <span className="ui-space-item" key={n}>
                <i style={{ width: n }} />
                <span className="ui-meta">{n}</span>
              </span>
            ))}
          </Group>
          <Group title="Radius">
            {RADII.map((n) => (
              <span className="ui-swatch" key={n}>
                <i className="ui-radius" style={{ borderRadius: `var(--radius-${n})` }} />
                <span>{n}</span>
              </span>
            ))}
          </Group>
        </div>
      </Chapter>

      <Chapter title="Buttons">
        <Group title="Roles" stack>
          {BUTTONS.map((b) => (
            <div className="ui-type" key={b.id}>
              <Button variant={b.id}>{b.label}</Button>
              <span className="ui-role">{b.role}</span>
            </div>
          ))}
          <div className="ui-type">
            <Button variant="primary" disabled>Disabled</Button>
            <span className="ui-role">The action is unavailable</span>
          </div>
        </Group>
        {SIZES.map((s) => (
          <Group key={s.id} title={s.label} note={s.role} stack>
            <div className="ui-row">
              {BUTTONS.map((b) => <Button key={b.id} variant={b.id} size={s.id}>{b.label}</Button>)}
              <Button variant="primary" size={s.id} disabled>Disabled</Button>
            </div>
            <div className="ui-row">
              {BUTTONS.map((b) => <IconButton key={b.id} icon="plus" label={b.label} variant={b.id} size={s.id} />)}
              <IconButton icon="plus" label="Disabled" variant="primary" size={s.id} disabled />
            </div>
          </Group>
        ))}
      </Chapter>

      <Chapter title="Components">
      <div className="ui-components">
      <Group title="Fields" stack>
        <Input label="Name" placeholder="Search" icon="search" suffix={<Kbd>/</Kbd>} />
        <Textarea label="Note" placeholder="A short note" rows={3} />
        <Select label="Type" defaultValue="soft" options={[{ value: 'primary', label: 'Primary' }, { value: 'soft', label: 'Soft' }, { value: 'ghost', label: 'Ghost' }]} />
      </Group>

      <Group title="Choices" stack>
        <Checkbox label="Include motion" defaultChecked />
        <Switch label="Reduced motion" checked={on} onCheckedChange={setOn} />
        <RadioGroup label="Weight" defaultValue="regular" options={[{ value: 'regular', label: 'Regular' }, { value: 'medium', label: 'Medium' }]} />
        <ChipGroup label="Tags" multiple defaultValue={['type']} options={['type', 'color', 'motion']} />
      </Group>

      <Group title="Slider" stack>
        <SliderField label="Amount" value={amount} onChange={setAmount} min={0} max={100} unit="%" />
      </Group>

      <Group title="Status">
        <Badge>Neutral</Badge>
        <Badge tone="solid">Solid</Badge>
        <Badge tone="outline">Outline</Badge>
        <Badge tone="success">Success</Badge>
        <Badge tone="warning">Warning</Badge>
        <Badge tone="live">Live</Badge>
        <Kbd>Esc</Kbd>
      </Group>

      <Group title="Progress" stack>
        <Progress label="Export" value={amount} showValue />
      </Group>

      <Group title="Rows" stack>
        <SettingRow title="Sound" description="Play a tone on complete" icon="volume-2">
          <Switch ariaLabel="Sound" checked={on} onCheckedChange={setOn} />
        </SettingRow>
        <Divider />
        <ListRow title="Components" description="Buttons, fields, and rows" icon="box" chevron />
        <Card title="Card" description="A surface for one group of controls.">
          <Button variant="soft" size="sm">Action</Button>
        </Card>
      </Group>

      <Group title="Toast" stack>
        <Toast>Saved</Toast>
        <Toast tone="success">Copied</Toast>
      </Group>

      <Group title="Avatar">
        <Avatar name="Design" size="sm" />
        <Avatar name="Design" />
        <Avatar name="Design" size="lg" status="online" />
      </Group>
      </div>
      </Chapter>
    </main>
  );
}
