"use client";

// src/icon.tsx
import { forwardRef } from "react";
import { Mic, Box, Code, Bookmark, VolumeX, Volume2, X, Link, Play, Pause, Check, Minus, ChevronDown, ChevronRight, ChevronLeft, ChevronUp, Plus, Search, Info, TriangleAlert, CircleAlert, CircleCheck, Trash2, Copy, Sparkles, ArrowRight, ArrowLeft, Settings, User, Bell, Calendar, Menu, Ellipsis, ExternalLink, Eye, EyeOff, Upload, Download, Filter, Pencil, Star, Heart, House, LogOut, Square, MicOff, Share2, Clock } from "lucide-react";

// src/lib.ts
import { useId, useState } from "react";
function useStableId(prefix) {
  return (prefix || "gt") + useId().replace(/:/g, "");
}
function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}
function useControl(value, def, onChange) {
  const state = useState(def);
  const controlled = value !== void 0;
  const cur = controlled ? value : state[0];
  function set(next) {
    if (!controlled) state[1](next);
    if (onChange) onChange(next);
  }
  return [cur, set];
}
function isRtl(node) {
  return getComputedStyle(node).direction === "rtl";
}
function reducedMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}
function optionValue(option) {
  if (typeof option === "string") return option;
  const value = option.value ?? option;
  return typeof value === "string" ? value : "";
}
function setRef(ref, node) {
  if (typeof ref === "function") ref(node);
  else if (ref) ref.current = node;
}

// src/types.ts
var LUCIDE_NAMES = [
  "mic",
  "box",
  "code",
  "bookmark",
  "volume-x",
  "volume-2",
  "x",
  "link",
  "play",
  "pause",
  "check",
  "minus",
  "chevron-down",
  "chevron-right",
  "chevron-left",
  "chevron-up",
  "plus",
  "search",
  "info",
  "triangle-alert",
  "circle-alert",
  "circle-check",
  "trash-2",
  "copy",
  "sparkles",
  "arrow-right",
  "arrow-left",
  "settings",
  "user",
  "bell",
  "calendar",
  "menu",
  "ellipsis",
  "external-link",
  "eye",
  "eye-off",
  "upload",
  "download",
  "filter",
  "pencil",
  "star",
  "heart",
  "house",
  "log-out",
  "square",
  "mic-off",
  "share-2",
  "clock"
];
var ICON_ALIASES = {
  cube: "box",
  mute: "volume-x",
  volume: "volume-2",
  close: "x",
  chevronDown: "chevron-down",
  chevronRight: "chevron-right",
  alert: "triangle-alert",
  trash: "trash-2",
  sparkle: "sparkles",
  more: "ellipsis",
  home: "house",
  edit: "pencil"
};

// src/icon.tsx
import { jsx } from "react/jsx-runtime";
var LUCIDE = {
  mic: Mic,
  box: Box,
  code: Code,
  bookmark: Bookmark,
  "volume-x": VolumeX,
  "volume-2": Volume2,
  x: X,
  link: Link,
  play: Play,
  pause: Pause,
  check: Check,
  minus: Minus,
  "chevron-down": ChevronDown,
  "chevron-right": ChevronRight,
  "chevron-left": ChevronLeft,
  "chevron-up": ChevronUp,
  plus: Plus,
  search: Search,
  info: Info,
  "triangle-alert": TriangleAlert,
  "circle-alert": CircleAlert,
  "circle-check": CircleCheck,
  "trash-2": Trash2,
  copy: Copy,
  sparkles: Sparkles,
  "arrow-right": ArrowRight,
  "arrow-left": ArrowLeft,
  settings: Settings,
  user: User,
  bell: Bell,
  calendar: Calendar,
  menu: Menu,
  ellipsis: Ellipsis,
  "external-link": ExternalLink,
  eye: Eye,
  "eye-off": EyeOff,
  upload: Upload,
  download: Download,
  filter: Filter,
  pencil: Pencil,
  star: Star,
  heart: Heart,
  house: House,
  "log-out": LogOut,
  square: Square,
  "mic-off": MicOff,
  "share-2": Share2,
  clock: Clock
};
var FILLED = { play: 1, pause: 1 };
var IconRoot = forwardRef(function Icon({ name, size = 20, strokeWidth, className, label, style, ...rest }, ref) {
  const key = typeof name === "string" ? ICON_ALIASES[name] || name : "";
  const C = name && typeof name !== "string" ? name : LUCIDE[key];
  if (!C) {
    const env = globalThis.process?.env;
    if (env && env.NODE_ENV !== "production") {
      const pascal = key.replace(/(^|-)([a-z0-9])/g, (_m, _d, c) => c.toUpperCase());
      console.warn('[graphite] Icon "' + name + '" is not built in. Import it from lucide-react and pass the component: <Icon name={' + pascal + "} />");
    }
    return null;
  }
  const props = {
    ...rest,
    ref,
    size,
    className: cx("gt-icon", className),
    focusable: "false",
    style: { ...style, strokeWidth: strokeWidth != null ? strokeWidth : "var(--icon-stroke)" }
  };
  if (label) {
    props.role = "img";
    props["aria-label"] = label;
  } else {
    props["aria-hidden"] = true;
  }
  if (FILLED[key]) props.fill = "currentColor";
  const Glyph = C;
  return /* @__PURE__ */ jsx(Glyph, { ...props });
});
var Icon2 = Object.assign(IconRoot, { names: LUCIDE_NAMES });

// src/button.tsx
import { forwardRef as forwardRef2 } from "react";
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var Button = forwardRef2(function Button2({ variant = "secondary", size = "md", icon, block, className, children, iconRight, loading, type = "button", ...rest }, ref) {
  const iconSize = size === "sm" ? 16 : 18;
  return /* @__PURE__ */ jsxs(
    "button",
    {
      ref,
      type,
      ...rest,
      "aria-busy": loading || void 0,
      className: cx("gt-btn", "gt-btn--" + variant, "gt-btn--" + size, block && "gt-btn--block", loading && "is-loading", className),
      children: [
        loading ? /* @__PURE__ */ jsx2("span", { className: "gt-spinner", "aria-hidden": true }) : null,
        icon ? /* @__PURE__ */ jsx2(Icon2, { name: icon, size: iconSize }) : null,
        children != null ? /* @__PURE__ */ jsx2("span", { children }) : null,
        iconRight ? /* @__PURE__ */ jsx2(Icon2, { name: iconRight, size: iconSize }) : null
      ]
    }
  );
});

// src/icon-button.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
function IconButton({ variant = "ghost", size = "md", icon, label, className, active, ...rest }) {
  const iconSize = size === "sm" ? 16 : size === "lg" ? 22 : 20;
  return /* @__PURE__ */ jsx3("button", { type: "button", "aria-label": label, title: label, "aria-pressed": active === void 0 ? void 0 : !!active, ...rest, className: cx("gt-iconbtn", "gt-iconbtn--" + variant, "gt-iconbtn--" + size, active && "is-active", className), children: /* @__PURE__ */ jsx3(Icon2, { name: icon, size: iconSize }) });
}

// src/text.tsx
import { createElement, forwardRef as forwardRef3 } from "react";
var Text = forwardRef3(function Text2({ variant = "body", as = "span", tone, className, children, ...rest }, ref) {
  return createElement(
    as,
    { ...rest, ref, className: cx("gt-text-" + variant, tone && "gt-text--" + tone, className) },
    children
  );
});

// src/heading.tsx
import { createElement as createElement2, forwardRef as forwardRef4 } from "react";
var Heading = forwardRef4(function Heading2({ level = 2, variant = "title", as, className, children, ...rest }, ref) {
  const tag = as || "h" + level;
  return createElement2(
    tag,
    { ...rest, ref, className: cx("gt-text-" + variant, className) },
    children
  );
});

// src/segmented-control.tsx
import { jsx as jsx4, jsxs as jsxs2 } from "react/jsx-runtime";
function SegmentedControl({ options = [], value, defaultValue, onChange, label, size = "md", disabled, className }) {
  const [current, set] = useControl(value, defaultValue !== void 0 ? defaultValue : options[0] && options[0].value, onChange);
  function key(event, index) {
    const rtl = isRtl(event.currentTarget);
    const horizontal = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    const step = horizontal ? rtl ? -horizontal : horizontal : 0;
    if (!step) return;
    event.preventDefault();
    const next = (index + step + options.length) % options.length;
    set(options[next].value);
    const button = event.currentTarget.parentNode?.children[next];
    if (button) button.focus();
  }
  return /* @__PURE__ */ jsx4("div", { role: "radiogroup", "aria-label": label, className: cx("gt-seg", "gt-seg--" + size, disabled && "is-disabled", className), "aria-disabled": disabled || void 0, children: options.map((option, index) => {
    const on = option.value === current;
    return /* @__PURE__ */ jsxs2("button", { type: "button", role: "radio", "aria-checked": on, "aria-label": option.icon && !option.label ? option.ariaLabel || option.value : void 0, tabIndex: on ? 0 : -1, className: cx("gt-seg__opt", on && "is-on", option.icon && !option.label && "is-icon", option.className), onClick: () => {
      set(option.value);
    }, onKeyDown: (event) => {
      key(event, index);
    }, children: [
      option.icon ? /* @__PURE__ */ jsx4(Icon2, { name: option.icon, size: 20 }) : null,
      option.label ? /* @__PURE__ */ jsx4("span", { children: option.label }) : null
    ] }, option.value);
  }) });
}

// src/slider-field.tsx
import { useRef, useState as useState2 } from "react";
import { jsx as jsx5, jsxs as jsxs3 } from "react/jsx-runtime";
function SliderField({ label, value, defaultValue, onChange, min = 0, max = 100, step = 1, unit, format, disabled, className }) {
  const [current, set] = useControl(value, defaultValue != null ? defaultValue : min, onChange);
  const ref = useRef(null);
  const [drag, setDrag] = useState2(false);
  function clamp(next) {
    const stepped = Math.round(next / step) * step;
    return Math.min(max, Math.max(min, +stepped.toFixed(4)));
  }
  function fromX(x) {
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const fromStart = isRtl(el) ? rect.right - x : x - rect.left;
    set(clamp(min + fromStart / rect.width * (max - min)));
  }
  const pct = (current - min) / (max - min) * 100;
  return /* @__PURE__ */ jsxs3(
    "div",
    {
      ref,
      role: "slider",
      tabIndex: disabled ? -1 : 0,
      "aria-label": label,
      "aria-valuemin": min,
      "aria-valuemax": max,
      "aria-valuenow": current,
      "aria-valuetext": current + (unit || ""),
      "aria-disabled": disabled || void 0,
      className: cx("gt-slider", drag && "is-dragging", disabled && "is-disabled", className),
      onPointerDown: (event) => {
        if (disabled) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        setDrag(true);
        fromX(event.clientX);
      },
      onPointerMove: (event) => {
        if (drag) fromX(event.clientX);
      },
      onPointerUp: () => {
        setDrag(false);
      },
      onPointerCancel: () => {
        setDrag(false);
      },
      onKeyDown: (event) => {
        const big = (max - min) / 10;
        const stepX = isRtl(event.currentTarget) ? -step : step;
        const delta = { ArrowRight: stepX, ArrowUp: step, ArrowLeft: -stepX, ArrowDown: -step, PageUp: big, PageDown: -big };
        const d = delta[event.key];
        if (event.key === "Home") {
          event.preventDefault();
          set(min);
        } else if (event.key === "End") {
          event.preventDefault();
          set(max);
        } else if (d) {
          event.preventDefault();
          set(clamp(current + d));
        }
      },
      children: [
        /* @__PURE__ */ jsx5("div", { className: "gt-slider__fill", style: { width: pct + "%" } }),
        /* @__PURE__ */ jsx5("span", { className: "gt-slider__label", children: label }),
        /* @__PURE__ */ jsx5("span", { className: "gt-slider__value", children: (format ? format(current) : current) + (unit || "") })
      ]
    }
  );
}

// src/press-button.tsx
import { useEffect, useRef as useRef2, useState as useState3 } from "react";
import { jsx as jsx6, jsxs as jsxs4 } from "react/jsx-runtime";
function fmtTime(seconds) {
  const m = Math.floor(seconds / 60);
  const r = Math.floor(seconds % 60);
  return m + ":" + (r < 10 ? "0" : "") + r;
}
function PressButton({ label, icon, fill, stroke, sensitivity, bounce, bars: barsProp, corner, recording, disabled, onStart, onRecord, className }) {
  const bars = Math.max(4, Math.min(64, barsProp || 28));
  const sens = sensitivity != null ? sensitivity : 60;
  const bounceValue = bounce != null ? bounce : 40;
  const [localRec, setLocalRec] = useState3(false);
  const rec = recording !== void 0 ? recording : localRec;
  const [heights, setHeights] = useState3(() => new Array(bars).fill(0.15));
  const t0 = useRef2(0);
  const [elapsed, setElapsed] = useState3(0);
  useEffect(() => {
    setHeights(new Array(bars).fill(0.15));
  }, [bars]);
  useEffect(() => {
    if (!rec) return;
    t0.current = Date.now();
    const still = reducedMotion();
    function tick() {
      setElapsed((Date.now() - t0.current) / 1e3);
      setHeights((prev) => prev.map((_, i) => {
        if (still) return 0.25 + 0.5 * Math.abs(Math.sin(i * 0.7));
        const base = Math.random() * (sens / 100);
        const env = 0.55 + 0.45 * Math.sin(i / bars * Math.PI);
        return Math.max(0.12, Math.min(1, base * env * 1.4 + 0.08));
      }));
    }
    tick();
    const id = setInterval(tick, 110);
    return () => {
      clearInterval(id);
    };
  }, [rec, sens, bars]);
  function start() {
    if (disabled) return;
    if (recording === void 0) setLocalRec(true);
    if (onStart) onStart();
  }
  function stop() {
    if (!rec) return;
    const duration = (Date.now() - t0.current) / 1e3;
    if (recording === void 0) setLocalRec(false);
    if (onRecord) onRecord(duration);
  }
  const ease = "cubic-bezier(.34," + (1 + bounceValue / 40).toFixed(2) + ",.64,1)";
  const tone = fill || "light";
  return /* @__PURE__ */ jsxs4(
    "button",
    {
      type: "button",
      "aria-pressed": rec,
      disabled,
      className: cx("gt-press", "gt-press--" + tone, stroke && "gt-press--stroke", rec && "is-recording", className),
      style: corner != null ? { "--press-radius": corner + "px" } : void 0,
      onPointerDown: (event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        start();
      },
      onPointerUp: stop,
      onPointerCancel: stop,
      onKeyDown: (event) => {
        if ((event.key === " " || event.key === "Enter") && !event.repeat) {
          event.preventDefault();
          start();
        }
      },
      onKeyUp: (event) => {
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          stop();
        }
      },
      onContextMenu: (event) => {
        event.preventDefault();
      },
      children: [
        /* @__PURE__ */ jsxs4("span", { className: "gt-press__idle", "aria-hidden": rec, children: [
          /* @__PURE__ */ jsx6(Icon2, { name: icon || "mic", size: 26 }),
          /* @__PURE__ */ jsx6("span", { children: label || "Hold to record" })
        ] }),
        /* @__PURE__ */ jsxs4("span", { className: "gt-press__live", "aria-hidden": !rec, children: [
          /* @__PURE__ */ jsx6("span", { className: "gt-press__dot" }),
          /* @__PURE__ */ jsx6("span", { className: "gt-press__time", children: fmtTime(elapsed) }),
          /* @__PURE__ */ jsx6("span", { className: "gt-press__bars", children: heights.map((v, i) => /* @__PURE__ */ jsx6("i", { style: { transform: "scaleY(" + v + ")", transitionTimingFunction: ease } }, i)) })
        ] }),
        /* @__PURE__ */ jsx6("span", { className: "gt-sr", "aria-live": "polite", children: rec ? "Recording" : "" })
      ]
    }
  );
}

// src/switch.tsx
import { forwardRef as forwardRef5 } from "react";
import { jsx as jsx7, jsxs as jsxs5 } from "react/jsx-runtime";
var Switch = forwardRef5(function Switch2({ checked, defaultChecked, onCheckedChange, onChange, label, ariaLabel, size, disabled, className, id: idProp, onClick, "aria-label": ariaLabelProp, ...rest }, ref) {
  const [on, set] = useControl(checked, !!defaultChecked, (next) => {
    if (onCheckedChange) onCheckedChange(next);
    if (onChange) onChange(next);
  });
  const autoId = useStableId("sw");
  const id = idProp || autoId;
  const name = label || ariaLabel || ariaLabelProp;
  const env = globalThis.process?.env;
  if (env && env.NODE_ENV !== "production" && !name) {
    console.warn("[graphite] Switch requires a label or ariaLabel.");
  }
  function click(event) {
    if (onClick) onClick(event);
    if (!event.defaultPrevented) set(!on);
  }
  const button = /* @__PURE__ */ jsx7(
    "button",
    {
      ...rest,
      ref,
      id,
      type: "button",
      role: "switch",
      "aria-checked": on,
      disabled,
      "aria-label": label ? void 0 : name,
      className: cx("gt-switch", on && "is-on", size === "sm" && "gt-switch--sm", className),
      onClick: click,
      children: /* @__PURE__ */ jsx7("span", { className: "gt-switch__thumb" })
    }
  );
  if (!label) return button;
  return /* @__PURE__ */ jsxs5("div", { className: "gt-inline", children: [
    button,
    /* @__PURE__ */ jsx7("label", { htmlFor: id, className: "gt-inline__label gt-text-body", children: label })
  ] });
});

// src/checkbox.tsx
import { forwardRef as forwardRef6, useEffect as useEffect2, useRef as useRef3 } from "react";
import { jsx as jsx8, jsxs as jsxs6 } from "react/jsx-runtime";
var Checkbox = forwardRef6(function Checkbox2({ checked, defaultChecked, onCheckedChange, onChange, label, description, indeterminate, disabled, className, id: idProp, ...rest }, ref) {
  const [on, set] = useControl(checked, !!defaultChecked, onCheckedChange);
  const autoId = useStableId("cb");
  const id = idProp || autoId;
  const descId = description ? id + "-desc" : void 0;
  const localRef = useRef3(null);
  useEffect2(() => {
    if (localRef.current) localRef.current.indeterminate = !!indeterminate;
  }, [indeterminate]);
  function change(event) {
    set(event.target.checked);
    if (onChange) onChange(event);
  }
  return /* @__PURE__ */ jsxs6("label", { htmlFor: id, className: cx("gt-check", disabled && "is-disabled", className), children: [
    /* @__PURE__ */ jsx8(
      "input",
      {
        ...rest,
        ref: (node) => {
          localRef.current = node;
          setRef(ref, node);
          if (node) node.indeterminate = !!indeterminate;
        },
        id,
        type: "checkbox",
        checked: on,
        disabled,
        "aria-checked": indeterminate ? "mixed" : void 0,
        "aria-describedby": descId,
        onChange: change
      }
    ),
    /* @__PURE__ */ jsx8("span", { className: "gt-check__box", "aria-hidden": true, children: /* @__PURE__ */ jsx8(Icon2, { name: indeterminate ? "minus" : "check", size: 14 }) }),
    /* @__PURE__ */ jsxs6("span", { className: "gt-check__text", children: [
      /* @__PURE__ */ jsx8("span", { className: "gt-check__label gt-text-body", children: label }),
      description ? /* @__PURE__ */ jsx8("span", { id: descId, className: "gt-check__desc gt-text-caption", children: description }) : null
    ] })
  ] });
});

// src/radio-shell.tsx
import { jsx as jsx9, jsxs as jsxs7 } from "react/jsx-runtime";
function radioShell(props, cls, render) {
  const options = props.options || [];
  const name = useStableId("rg");
  const hintId = name + "-hint";
  const [current, set] = useControl(props.value, props.defaultValue !== void 0 ? props.defaultValue : null, props.onChange);
  const msg = props.error || props.hint;
  return /* @__PURE__ */ jsxs7("fieldset", { className: cx("gt-rgroup", cls, props.orientation === "horizontal" && "gt-rgroup--row", props.error && "is-error", props.className), disabled: props.disabled, "aria-describedby": msg ? hintId : void 0, children: [
    props.label ? /* @__PURE__ */ jsxs7("legend", { className: cx("gt-rgroup__legend", props.hideLabel && "is-hidden"), children: [
      props.label,
      props.required ? /* @__PURE__ */ jsx9("span", { className: "gt-rgroup__req", children: "Required" }) : null
    ] }) : null,
    /* @__PURE__ */ jsx9("div", { className: cls === "gt-rgroup--cards" ? "gt-radios" : "gt-rgroup__list", children: options.map((option, index) => {
      const on = option.value === current;
      const descId = name + "-d" + index;
      const input = /* @__PURE__ */ jsx9("input", { className: "gt-rdot", type: "radio", name, value: option.value, checked: on, disabled: option.disabled, required: props.required, "aria-invalid": props.error ? true : void 0, "aria-describedby": option.description ? descId : void 0, onChange: () => {
        set(option.value);
      } });
      return render(option, on, input, descId);
    }) }),
    msg ? /* @__PURE__ */ jsx9("p", { id: hintId, className: "gt-rgroup__hint", style: { margin: 0 }, children: msg }) : null
  ] });
}

// src/radio-group.tsx
import { jsx as jsx10, jsxs as jsxs8 } from "react/jsx-runtime";
function RadioGroup(props) {
  return radioShell(props, "gt-rgroup--plain", (option, _on, input, descId) => {
    const item = option;
    return /* @__PURE__ */ jsxs8("label", { className: cx("gt-radio-item", item.disabled && "is-disabled", item.className), children: [
      input,
      /* @__PURE__ */ jsxs8("span", { className: "gt-radio-item__text", children: [
        /* @__PURE__ */ jsx10("span", { className: "gt-radio-item__label", children: item.label }),
        item.description ? /* @__PURE__ */ jsx10("span", { id: descId, className: "gt-radio-item__desc", children: item.description }) : null
      ] })
    ] }, item.value);
  });
}

// src/badge.tsx
import { jsx as jsx11, jsxs as jsxs9 } from "react/jsx-runtime";
function Badge({ tone = "neutral", children, className }) {
  return /* @__PURE__ */ jsxs9("span", { className: cx("gt-badge", "gt-badge--" + tone, className), children: [
    tone === "live" ? /* @__PURE__ */ jsx11("span", { className: "gt-badge__dot" }) : null,
    children
  ] });
}

// src/radio-cards.tsx
import { jsx as jsx12, jsxs as jsxs10 } from "react/jsx-runtime";
function RadioCards(props) {
  return radioShell({ ...props, hideLabel: !props.showLabel }, "gt-rgroup--cards", (option, on, input, descId) => {
    const card = option;
    return /* @__PURE__ */ jsxs10("label", { className: cx("gt-radio", on && "is-on", card.disabled && "is-disabled", card.className), children: [
      input,
      /* @__PURE__ */ jsxs10("span", { className: "gt-radio__text", children: [
        /* @__PURE__ */ jsxs10("span", { className: "gt-radio__title", children: [
          card.title,
          card.badge ? /* @__PURE__ */ jsx12(Badge, { tone: "outline", children: card.badge }) : null
        ] }),
        card.description ? /* @__PURE__ */ jsx12("span", { id: descId, className: "gt-radio__desc", children: card.description }) : null
      ] })
    ] }, card.value);
  });
}

// src/chip-group.tsx
import { forwardRef as forwardRef7 } from "react";
import { jsx as jsx13, jsxs as jsxs11 } from "react/jsx-runtime";
function optionDisabled(option) {
  return typeof option !== "string" && !!option.disabled;
}
var ChipGroup = forwardRef7(function ChipGroup2({ options = [], multiple, value, defaultValue, onValueChange, onChange, label, className, ...rest }, ref) {
  const multi = !!multiple;
  const [current, set] = useControl(
    value,
    defaultValue !== void 0 ? defaultValue : multi ? [] : null,
    (next) => {
      if (next == null) return;
      if (onValueChange) onValueChange(next);
      if (onChange) onChange(next);
    }
  );
  function isOn(v) {
    return multi ? (Array.isArray(current) ? current : []).indexOf(v) >= 0 : current === v;
  }
  function toggle(v) {
    if (!multi) return set(v);
    const next = (Array.isArray(current) ? current : []).slice();
    const index = next.indexOf(v);
    if (index >= 0) next.splice(index, 1);
    else next.push(v);
    set(next);
  }
  function move(event, index) {
    const rtl = isRtl(event.currentTarget);
    const horizontal = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    const vertical = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
    const dir = vertical || (horizontal ? rtl ? -horizontal : horizontal : 0);
    if (!dir) return;
    event.preventDefault();
    const count = options.length;
    for (let step = 1; step <= count; step++) {
      const next = (index + dir * step + count) % count;
      if (optionDisabled(options[next])) continue;
      set(optionValue(options[next]));
      const buttons = event.currentTarget.parentElement?.querySelectorAll("button");
      const button = buttons && buttons[next];
      if (button) button.focus();
      return;
    }
  }
  const named = label || rest["aria-label"];
  const env = globalThis.process?.env;
  if (env && env.NODE_ENV !== "production" && !named) {
    console.warn("[graphite] ChipGroup requires a label.");
  }
  const selectedIndex = multi ? -1 : options.findIndex((option) => optionValue(option) === current);
  return /* @__PURE__ */ jsx13(
    "div",
    {
      ...rest,
      ref,
      role: multi ? "group" : "radiogroup",
      "aria-label": label || rest["aria-label"],
      className: cx("gt-chips", className),
      children: options.map((option, index) => {
        const v = optionValue(option);
        const on = isOn(v);
        const disabled = optionDisabled(option);
        const extra = typeof option === "string" ? void 0 : option.className;
        const text = typeof option === "string" ? option : option.label ?? v;
        const tabIndex = multi ? void 0 : selectedIndex < 0 ? index === options.findIndex((item) => !optionDisabled(item)) ? 0 : -1 : on ? 0 : -1;
        return /* @__PURE__ */ jsxs11(
          "button",
          {
            type: "button",
            role: multi ? void 0 : "radio",
            "aria-pressed": multi ? on : void 0,
            "aria-checked": multi ? void 0 : on,
            tabIndex,
            disabled,
            className: cx("gt-chip", on && "is-on", extra),
            onClick: () => {
              toggle(v);
            },
            onKeyDown: multi ? void 0 : (event) => {
              move(event, index);
            },
            children: [
              on && multi ? /* @__PURE__ */ jsx13(Icon2, { name: "check", size: 14 }) : null,
              text
            ]
          },
          v === "" ? index : v
        );
      })
    }
  );
});

// src/input.tsx
import { forwardRef as forwardRef8 } from "react";

// src/field.tsx
import { jsx as jsx14, jsxs as jsxs12 } from "react/jsx-runtime";
function Field(props, id, control) {
  return /* @__PURE__ */ jsxs12("div", { className: cx("gt-field", props.error && "is-error", props.disabled && "is-disabled", props.className), children: [
    props.label ? /* @__PURE__ */ jsxs12("label", { htmlFor: id, className: "gt-field__label", children: [
      props.label,
      props.optional ? /* @__PURE__ */ jsx14("span", { className: "gt-field__opt", children: "Optional" }) : null
    ] }) : null,
    control,
    props.error || props.hint ? /* @__PURE__ */ jsx14("span", { id: id + "-hint", className: "gt-field__hint", children: props.error || props.hint }) : null
  ] });
}

// src/input.tsx
import { jsx as jsx15, jsxs as jsxs13 } from "react/jsx-runtime";
var Input = forwardRef8(function Input2({ label, hint, error, icon, suffix, className, optional, disabled, id: idProp, ...rest }, ref) {
  const autoId = useStableId("in");
  const id = idProp || autoId;
  return Field({ label, hint, error, className, optional, disabled }, id, /* @__PURE__ */ jsxs13("div", { className: "gt-input", children: [
    icon ? /* @__PURE__ */ jsx15(Icon2, { name: icon, size: 18 }) : null,
    /* @__PURE__ */ jsx15(
      "input",
      {
        ref,
        id,
        "aria-invalid": error ? true : void 0,
        "aria-describedby": error || hint ? id + "-hint" : void 0,
        disabled,
        ...rest
      }
    ),
    suffix ? /* @__PURE__ */ jsx15("span", { className: "gt-input__suffix", children: suffix }) : null
  ] }));
});

// src/textarea.tsx
import { jsx as jsx16, jsxs as jsxs14 } from "react/jsx-runtime";
function Textarea({ label, hint, error, className, optional, value, defaultValue, onChange, maxLength, disabled, ...rest }) {
  const id = useStableId("ta");
  const [current, set] = useControl(value, defaultValue || "", onChange ? (next) => {
    onChange(next);
  } : void 0);
  return Field({ label, hint, error, className, optional, disabled }, id, /* @__PURE__ */ jsxs14("div", { className: "gt-textarea", children: [
    /* @__PURE__ */ jsx16("textarea", { id, rows: 4, value: current, onChange: (event) => {
      set(event.target.value);
    }, "aria-describedby": error || hint ? id + "-hint" : void 0, disabled, ...rest }),
    maxLength ? /* @__PURE__ */ jsx16("span", { className: "gt-textarea__count", children: (current || "").length + " / " + maxLength }) : null
  ] }));
}

// src/select.tsx
import { forwardRef as forwardRef9 } from "react";
import { jsx as jsx17, jsxs as jsxs15 } from "react/jsx-runtime";
var Select = forwardRef9(function Select2({ label, hint, error, className, options = [], optional, disabled, id: idProp, onChange, onValueChange, ...rest }, ref) {
  const autoId = useStableId("se");
  const id = idProp || autoId;
  function change(event) {
    if (onChange) onChange(event);
    if (onValueChange) onValueChange(event.target.value);
  }
  return Field({ label, hint, error, className, optional, disabled }, id, /* @__PURE__ */ jsxs15("div", { className: "gt-select", children: [
    /* @__PURE__ */ jsx17(
      "select",
      {
        ...rest,
        ref,
        id,
        disabled,
        "aria-invalid": error ? true : void 0,
        "aria-describedby": error || hint ? id + "-hint" : void 0,
        onChange: change,
        children: options.map((option, index) => {
          const v = optionValue(option);
          const text = typeof option === "string" ? option : option.label ?? v;
          return /* @__PURE__ */ jsx17("option", { value: v, children: text }, index + ":" + v);
        })
      }
    ),
    /* @__PURE__ */ jsx17(Icon2, { name: "chevron-down", size: 16 })
  ] }));
});

// src/setting-row.tsx
import { jsx as jsx18, jsxs as jsxs16 } from "react/jsx-runtime";
function SettingRow({ title, description, icon, disabled, children, className }) {
  return /* @__PURE__ */ jsxs16("div", { className: cx("gt-row", disabled && "is-disabled", className), "aria-disabled": disabled || void 0, children: [
    icon ? /* @__PURE__ */ jsx18("span", { className: "gt-row__icon", children: /* @__PURE__ */ jsx18(Icon2, { name: icon, size: 18 }) }) : null,
    /* @__PURE__ */ jsxs16("div", { className: "gt-row__text", children: [
      /* @__PURE__ */ jsx18("span", { className: "gt-row__title", children: title }),
      description ? /* @__PURE__ */ jsx18("span", { className: "gt-row__desc", children: description }) : null
    ] }),
    /* @__PURE__ */ jsx18("div", { className: "gt-row__control", children })
  ] });
}

// src/card.tsx
import { forwardRef as forwardRef10 } from "react";
import { Fragment, jsx as jsx19, jsxs as jsxs17 } from "react/jsx-runtime";
var Card = forwardRef10(function Card2({ title, description, footer, children, variant = "surface", className, ...rest }, ref) {
  const titleId = useStableId("card");
  const labelled = Boolean(title) && rest["aria-labelledby"] == null && rest["aria-label"] == null;
  const props = {
    ...rest,
    className: cx("gt-card", variant === "elevated" && "gt-card--elevated", className),
    ...labelled ? { "aria-labelledby": titleId } : {}
  };
  const inner = /* @__PURE__ */ jsxs17(Fragment, { children: [
    title || description ? /* @__PURE__ */ jsxs17("div", { className: "gt-card__head", children: [
      title ? /* @__PURE__ */ jsx19(Heading, { id: labelled ? titleId : void 0, level: 2, className: "gt-card__title", children: title }) : null,
      description ? /* @__PURE__ */ jsx19("p", { className: "gt-card__desc gt-text-body gt-text--secondary", children: description }) : null
    ] }) : null,
    children != null ? /* @__PURE__ */ jsx19("div", { className: "gt-card__body", children }) : null,
    footer ? /* @__PURE__ */ jsx19("footer", { className: "gt-card__foot", children: footer }) : null
  ] });
  if (title) return /* @__PURE__ */ jsx19("section", { ...props, ref, children: inner });
  return /* @__PURE__ */ jsx19("div", { ...props, ref, children: inner });
});

// src/list-row.tsx
import { forwardRef as forwardRef11 } from "react";
import { Fragment as Fragment2, jsx as jsx20, jsxs as jsxs18 } from "react/jsx-runtime";
var ListRow = forwardRef11(function ListRow2({ title, description, icon, trailing, href, onClick, disabled, chevron, className, ...rest }, ref) {
  const action = Boolean(href || onClick);
  const classNames = cx("gt-row", action && "gt-row--action", disabled && "is-disabled", className);
  const body = /* @__PURE__ */ jsxs18(Fragment2, { children: [
    icon ? /* @__PURE__ */ jsx20("span", { className: "gt-row__icon", children: /* @__PURE__ */ jsx20(Icon2, { name: icon, size: 18 }) }) : null,
    /* @__PURE__ */ jsxs18("div", { className: "gt-row__text", children: [
      /* @__PURE__ */ jsx20("span", { className: "gt-row__title", children: title }),
      description ? /* @__PURE__ */ jsx20("span", { className: "gt-row__desc", children: description }) : null
    ] }),
    trailing || chevron ? /* @__PURE__ */ jsxs18("div", { className: "gt-row__control", children: [
      trailing,
      chevron ? /* @__PURE__ */ jsx20(Icon2, { name: "chevron-right", size: 18, className: "gt-row__chevron" }) : null
    ] }) : null
  ] });
  if (href && !disabled) {
    return /* @__PURE__ */ jsx20("a", { ...rest, ref, href, onClick, className: classNames, children: body });
  }
  if (onClick || href && disabled) {
    return /* @__PURE__ */ jsx20(
      "button",
      {
        ...rest,
        ref,
        type: "button",
        disabled: disabled || void 0,
        onClick: disabled ? void 0 : onClick,
        className: classNames,
        children: body
      }
    );
  }
  return /* @__PURE__ */ jsx20("div", { ...rest, ref, className: classNames, "aria-disabled": disabled || void 0, children: body });
});

// src/divider.tsx
import { forwardRef as forwardRef12 } from "react";
import { jsx as jsx21 } from "react/jsx-runtime";
var Divider = forwardRef12(function Divider2({ orientation = "horizontal", inset, className, ...rest }, ref) {
  return /* @__PURE__ */ jsx21(
    "hr",
    {
      ...rest,
      ref,
      "aria-orientation": orientation === "vertical" ? "vertical" : void 0,
      className: cx(
        "gt-divider",
        orientation === "vertical" && "gt-divider--vertical",
        inset && "gt-divider--inset",
        className
      )
    }
  );
});

// src/avatar.tsx
import { jsx as jsx22, jsxs as jsxs19 } from "react/jsx-runtime";
function Avatar({ name, src, size = "md", status, className }) {
  const init = (name || "?").split(/\s+/).map((word) => word[0]).slice(0, 2).join("").toUpperCase();
  return /* @__PURE__ */ jsxs19("span", { className: cx("gt-avatar", "gt-avatar--" + size, className), title: name, role: "img", "aria-label": name, children: [
    src ? /* @__PURE__ */ jsx22("img", { src, alt: "" }) : init,
    status ? /* @__PURE__ */ jsx22("span", { className: "gt-avatar__status gt-avatar__status--" + status, "aria-hidden": true }) : null
  ] });
}

// src/kbd.tsx
import { jsx as jsx23 } from "react/jsx-runtime";
function Kbd({ children, className }) {
  return /* @__PURE__ */ jsx23("kbd", { className: cx("gt-kbd", className), children });
}

// src/progress.tsx
import { jsx as jsx24, jsxs as jsxs20 } from "react/jsx-runtime";
function Progress({ value, label, showValue, indeterminate, error, className }) {
  const v = Math.max(0, Math.min(100, value || 0));
  return /* @__PURE__ */ jsxs20("div", { className: cx("gt-progress", indeterminate && "is-indeterminate", error && "is-error", className), children: [
    label || showValue ? /* @__PURE__ */ jsxs20("div", { className: "gt-progress__head", children: [
      /* @__PURE__ */ jsx24("span", { children: label }),
      error ? /* @__PURE__ */ jsx24("span", { className: "gt-progress__val", children: error }) : showValue && !indeterminate ? /* @__PURE__ */ jsx24("span", { className: "gt-progress__val", children: Math.round(v) + "%" }) : null
    ] }) : null,
    /* @__PURE__ */ jsx24("div", { className: "gt-progress__track", role: "progressbar", "aria-valuenow": indeterminate ? void 0 : v, "aria-valuemin": 0, "aria-valuemax": 100, "aria-label": label, children: /* @__PURE__ */ jsx24("div", { className: "gt-progress__bar", style: { width: v + "%" } }) })
  ] });
}

// src/tooltip.tsx
import { useEffect as useEffect3, useState as useState4 } from "react";
import { jsx as jsx25, jsxs as jsxs21 } from "react/jsx-runtime";
function Tooltip({ content, shortcut, side = "top", open, children }) {
  const [shown, setShown] = useState4(!!open);
  const id = useStableId("tt");
  useEffect3(() => {
    if (open !== void 0) setShown(open);
  }, [open]);
  const show = () => {
    setShown(true);
  };
  const hide = () => {
    if (!open) setShown(false);
  };
  return /* @__PURE__ */ jsxs21("span", { className: "gt-tip", onMouseEnter: show, onMouseLeave: hide, onFocus: show, onBlur: hide, "aria-describedby": id, children: [
    children,
    /* @__PURE__ */ jsxs21("span", { id, role: "tooltip", className: cx("gt-tip__bubble", shown && "is-open", "gt-tip--" + side), children: [
      content,
      shortcut ? /* @__PURE__ */ jsx25(Kbd, { children: shortcut }) : null
    ] })
  ] });
}

// src/toast.tsx
import { jsx as jsx26, jsxs as jsxs22 } from "react/jsx-runtime";
function Toast({ tone = "neutral", icon, action, onAction, onClose, children, className }) {
  const ic = tone === "success" ? "check" : tone === "info" ? "info" : tone === "error" ? "x" : tone === "warning" ? "triangle-alert" : icon;
  return /* @__PURE__ */ jsxs22("div", { role: "status", className: cx("gt-toast", "gt-toast--" + tone, className), children: [
    ic ? /* @__PURE__ */ jsx26("span", { className: "gt-toast__icon", children: /* @__PURE__ */ jsx26(Icon2, { name: ic, size: 16 }) }) : null,
    /* @__PURE__ */ jsx26("span", { className: "gt-toast__msg", children }),
    action ? /* @__PURE__ */ jsx26("button", { type: "button", className: "gt-toast__action", onClick: onAction, children: action }) : null,
    onClose ? /* @__PURE__ */ jsx26(IconButton, { icon: "x", label: "Dismiss", size: "sm", onClick: onClose }) : null
  ] });
}

// src/panel.tsx
import { jsx as jsx27, jsxs as jsxs23 } from "react/jsx-runtime";
function Panel({ title, subtitle, onClose, footer, width, children, className }) {
  return /* @__PURE__ */ jsxs23("section", { className: cx("gt-panel", className), style: width ? { width } : void 0, "aria-label": title, children: [
    /* @__PURE__ */ jsxs23("header", { className: "gt-panel__head", children: [
      /* @__PURE__ */ jsxs23("div", { children: [
        /* @__PURE__ */ jsx27("h2", { className: "gt-panel__title", children: title }),
        subtitle ? /* @__PURE__ */ jsx27("p", { className: "gt-panel__sub", children: subtitle }) : null
      ] }),
      onClose ? /* @__PURE__ */ jsx27(IconButton, { icon: "x", label: "Close panel", onClick: onClose }) : null
    ] }),
    /* @__PURE__ */ jsx27("div", { className: "gt-panel__body", children }),
    footer ? /* @__PURE__ */ jsx27("footer", { className: "gt-panel__foot", children: footer }) : null
  ] });
}

// src/stage.tsx
import { jsx as jsx28, jsxs as jsxs24 } from "react/jsx-runtime";
function Stage({ toolbarLeft, toolbarRight, corner, height, children, className }) {
  return /* @__PURE__ */ jsxs24("div", { className: cx("gt-stage", className), style: height ? { minHeight: height } : void 0, children: [
    toolbarLeft || toolbarRight ? /* @__PURE__ */ jsxs24("div", { className: "gt-stage__bar", children: [
      /* @__PURE__ */ jsx28("div", { className: "gt-stage__tools", children: toolbarLeft }),
      /* @__PURE__ */ jsx28("div", { className: "gt-stage__tools", children: toolbarRight })
    ] }) : null,
    /* @__PURE__ */ jsx28("div", { className: "gt-stage__center", children }),
    corner ? /* @__PURE__ */ jsx28("div", { className: "gt-stage__corner", children: corner }) : null
  ] });
}

// src/dialog.tsx
import { useEffect as useEffect4 } from "react";
import { jsx as jsx29, jsxs as jsxs25 } from "react/jsx-runtime";
function Dialog({ open, title, description, actions, onClose, inline, children }) {
  useEffect4(() => {
    if (!open || inline) return;
    function onKey(event) {
      if (event.key === "Escape" && onClose) onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [open, inline]);
  if (!open) return null;
  return /* @__PURE__ */ jsx29("div", { className: cx("gt-scrim", inline && "gt-scrim--inline"), onClick: (event) => {
    if (event.target === event.currentTarget && onClose) onClose();
  }, children: /* @__PURE__ */ jsxs25("div", { role: "dialog", "aria-modal": inline ? void 0 : true, "aria-label": title, className: "gt-dialog", children: [
    /* @__PURE__ */ jsxs25("div", { className: "gt-dialog__head", children: [
      /* @__PURE__ */ jsx29("h2", { className: "gt-dialog__title", children: title }),
      onClose ? /* @__PURE__ */ jsx29(IconButton, { icon: "x", label: "Close", size: "sm", onClick: onClose }) : null
    ] }),
    description ? /* @__PURE__ */ jsx29("p", { className: "gt-dialog__desc", children: description }) : null,
    children ? /* @__PURE__ */ jsx29("div", { className: "gt-dialog__body", children }) : null,
    actions ? /* @__PURE__ */ jsx29("div", { className: "gt-dialog__actions", children: actions }) : null
  ] }) });
}
export {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  ChipGroup,
  Dialog,
  Divider,
  Heading,
  Icon2 as Icon,
  IconButton,
  Input,
  Kbd,
  ListRow,
  Panel,
  PressButton,
  Progress,
  RadioCards,
  RadioGroup,
  SegmentedControl,
  Select,
  SettingRow,
  SliderField,
  Stage,
  Switch,
  Text,
  Textarea,
  Toast,
  Tooltip
};
