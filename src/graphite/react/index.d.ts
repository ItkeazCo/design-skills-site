
import * as react from 'react';

declare const LUCIDE_NAMES: readonly ["mic", "box", "code", "bookmark", "volume-x", "volume-2", "x", "link", "play", "pause", "check", "minus", "chevron-down", "chevron-right", "chevron-left", "chevron-up", "plus", "search", "info", "triangle-alert", "circle-alert", "circle-check", "trash-2", "copy", "sparkles", "arrow-right", "arrow-left", "settings", "user", "bell", "calendar", "menu", "ellipsis", "external-link", "eye", "eye-off", "upload", "download", "filter", "pencil", "star", "heart", "house", "log-out", "square", "mic-off", "share-2", "clock"];
declare const ICON_ALIASES: {
    readonly cube: "box";
    readonly mute: "volume-x";
    readonly volume: "volume-2";
    readonly close: "x";
    readonly chevronDown: "chevron-down";
    readonly chevronRight: "chevron-right";
    readonly alert: "triangle-alert";
    readonly trash: "trash-2";
    readonly sparkle: "sparkles";
    readonly more: "ellipsis";
    readonly home: "house";
    readonly edit: "pencil";
};
/** Built-in icons (Lucide artwork, Lucide names). Older Graphite names are accepted as aliases. */
type IconName = (typeof LUCIDE_NAMES)[number] | keyof typeof ICON_ALIASES;
/** Any icon component, e.g. a lucide-react icon. Graphite passes size, strokeWidth and className. */
type IconComponent = react.ComponentType<{
    size?: number | string;
    strokeWidth?: number | string;
    className?: string;
    "aria-hidden"?: boolean | "true" | "false";
}>;
type IconLike = IconName | IconComponent;
interface IconProps extends Omit<react.SVGProps<SVGSVGElement>, "name" | "ref"> {
    name: IconLike;
    size?: number;
    strokeWidth?: number;
    className?: string; /** When set, the icon is exposed to assistive tech instead of aria-hidden. */
    label?: string;
}
/** Type styles from typography.css (.gt-text-*). CSS classes remain the source of truth. */
type TextVariant = "display" | "press" | "title" | "body" | "label" | "caption" | "micro" | "timer" | "code";
/** Maps to .gt-text--{tone}, which sets color from the matching semantic text token. */
type TextTone = "primary" | "secondary" | "danger" | "success" | "warning" | "info" | "inverse" | "accent";
type TextElement = "span" | "p" | "div" | "label" | "strong" | "em" | "small" | "code" | "pre";
interface TextProps extends Omit<react.HTMLAttributes<HTMLElement>, "color"> {
    /** Maps to .gt-text-{variant}. Default body. */
    variant?: TextVariant;
    /** Colour role. Adds .gt-text--{tone} (for example .gt-text--secondary → --text-secondary). */
    tone?: TextTone;
    as?: TextElement;
}
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
interface HeadingProps extends Omit<react.HTMLAttributes<HTMLHeadingElement>, "color"> {
    /** Heading rank; renders h1–h6 unless as is set. Default 2. */
    level?: HeadingLevel;
    /** Maps to .gt-text-{variant}. Default title. */
    variant?: TextVariant;
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div" | "span";
}
interface ButtonProps extends react.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "soft" | "ghost" | "danger" | "overlay";
    size?: "sm" | "md" | "lg";
    icon?: IconLike;
    iconRight?: IconLike;
    block?: boolean; /** Shows a spinner, hides the label, sets aria-busy. */
    loading?: boolean;
}
interface IconButtonProps extends react.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: IconLike;
    label: string;
    variant?: "ghost" | "solid" | "outline";
    size?: "sm" | "md" | "lg";
    active?: boolean;
}
interface PressButtonProps {
    label?: string;
    icon?: IconLike;
    fill?: "light" | "dark";
    stroke?: boolean;
    sensitivity?: number;
    bounce?: number;
    bars?: number;
    corner?: number;
    recording?: boolean;
    disabled?: boolean;
    onStart?: () => void;
    onRecord?: (seconds: number) => void;
    className?: string;
}
interface SegmentOption {
    value: string;
    label?: string;
    icon?: IconLike;
    ariaLabel?: string;
    className?: string;
}
interface SegmentedControlProps {
    options: SegmentOption[];
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    label?: string;
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    className?: string;
}
interface SliderFieldProps {
    label: string;
    value?: number;
    defaultValue?: number;
    onChange?: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    format?: (value: number) => string;
    disabled?: boolean;
    className?: string;
}
interface SwitchProps extends Omit<react.ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "role" | "children"> {
    checked?: boolean;
    defaultChecked?: boolean;
    /** Fires with the next boolean. `onChange` is the same callback, kept for existing call sites. */
    onCheckedChange?: (checked: boolean) => void;
    onChange?: (checked: boolean) => void;
    /** Visible label. Required unless `ariaLabel` or `aria-label` is set. */
    label?: string;
    ariaLabel?: string;
    size?: "sm" | "md";
}
interface CheckboxProps extends Omit<react.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
    label: string;
    description?: string;
    indeterminate?: boolean;
    /** Fires with the next boolean. Native `onChange` still receives the input event. */
    onCheckedChange?: (checked: boolean) => void;
    onChange?: react.ChangeEventHandler<HTMLInputElement>;
}
interface RadioShellProps {
    value?: string | null;
    defaultValue?: string | null;
    onChange?: (value: string) => void; /** Group label, rendered as a <legend>. */
    label?: string;
    hint?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    options?: Array<RadioOption | RadioCardOption>;
    orientation?: "vertical" | "horizontal";
    hideLabel?: boolean;
    showLabel?: boolean;
}
interface RadioOption {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
    className?: string;
}
interface RadioGroupProps extends RadioShellProps {
    options: RadioOption[];
    orientation?: "vertical" | "horizontal";
    hideLabel?: boolean;
}
interface RadioCardOption {
    value: string;
    title: string;
    description?: string;
    badge?: string;
    disabled?: boolean;
    className?: string;
}
interface RadioCardsProps extends RadioShellProps {
    options: RadioCardOption[]; /** Show the legend visually (it is always available to screen readers). */
    showLabel?: boolean;
}
interface ChipOption {
    value: string;
    label: string;
    disabled?: boolean;
    className?: string;
}
interface ChipGroupProps extends Omit<react.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
    options: Array<string | ChipOption>;
    multiple?: boolean;
    value?: string | string[];
    defaultValue?: string | string[];
    /** Fires with the next value: a string, or a string array when `multiple`. `onChange` is the same callback. */
    onValueChange?: (value: string | string[]) => void;
    onChange?: (value: string | string[]) => void;
    /** Names the group for assistive tech. */
    label?: string;
}
interface FieldProps {
    label?: string;
    hint?: string;
    error?: string;
    optional?: boolean;
    className?: string;
    disabled?: boolean;
}
interface InputProps extends FieldProps, Omit<react.InputHTMLAttributes<HTMLInputElement>, "className"> {
    icon?: IconLike;
    suffix?: react.ReactNode;
}
interface TextareaProps extends FieldProps, Omit<react.TextareaHTMLAttributes<HTMLTextAreaElement>, "className" | "onChange"> {
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    maxLength?: number;
}
interface SelectOption {
    value: string;
    label: string;
}
interface SelectProps extends FieldProps, Omit<react.SelectHTMLAttributes<HTMLSelectElement>, "className"> {
    options: Array<string | SelectOption>;
    /** Fires with the selected value. Native `onChange` still receives the change event. */
    onValueChange?: (value: string) => void;
}
interface SettingRowProps {
    title: string;
    description?: string;
    icon?: IconLike;
    disabled?: boolean;
    children?: react.ReactNode;
    className?: string;
}
interface CardProps extends react.HTMLAttributes<HTMLElement> {
    title?: string;
    description?: string;
    footer?: react.ReactNode;
    /** Surface is flat with a hairline. Elevated lifts the card with a shadow. */
    variant?: "surface" | "elevated";
}
interface ListRowProps extends Omit<react.HTMLAttributes<HTMLElement>, "title"> {
    title: string;
    description?: string;
    icon?: IconLike;
    trailing?: react.ReactNode;
    /** Renders a link. A disabled row stays a button so it cannot be opened. */
    href?: string;
    onClick?: react.MouseEventHandler<HTMLElement>;
    disabled?: boolean;
    /** Trailing chevron for a row that opens something. */
    chevron?: boolean;
}
interface DividerProps extends react.HTMLAttributes<HTMLHRElement> {
    orientation?: "horizontal" | "vertical";
    /** Pulls a horizontal rule in from the edges. */
    inset?: boolean;
}
interface BadgeProps {
    tone?: "neutral" | "solid" | "outline" | "live" | "success" | "warning" | "danger" | "info";
    children?: react.ReactNode;
    className?: string;
}
interface AvatarProps {
    name: string;
    src?: string;
    size?: "sm" | "md" | "lg";
    status?: "online" | "recording" | "away";
    className?: string;
}
interface KbdProps {
    children?: react.ReactNode;
    className?: string;
}
interface ProgressProps {
    value?: number;
    label?: string;
    showValue?: boolean;
    indeterminate?: boolean; /** Error message; turns the bar red. */
    error?: string;
    className?: string;
}
interface TooltipProps {
    content: react.ReactNode;
    shortcut?: string;
    side?: "top" | "bottom";
    open?: boolean;
    children: react.ReactNode;
}
interface ToastProps {
    tone?: "neutral" | "success" | "info" | "warning" | "error";
    icon?: IconLike;
    action?: string;
    onAction?: () => void;
    onClose?: () => void;
    children?: react.ReactNode;
    className?: string;
}
interface PanelProps {
    title: string;
    subtitle?: string;
    onClose?: () => void;
    footer?: react.ReactNode;
    width?: number | string;
    children?: react.ReactNode;
    className?: string;
}
interface StageProps {
    toolbarLeft?: react.ReactNode;
    toolbarRight?: react.ReactNode;
    corner?: react.ReactNode;
    height?: number;
    children?: react.ReactNode;
    className?: string;
}
interface DialogProps {
    open: boolean;
    title: string;
    description?: string;
    actions?: react.ReactNode;
    onClose?: () => void;
    inline?: boolean;
    children?: react.ReactNode;
}

declare const Icon: react.ForwardRefExoticComponent<IconProps & react.RefAttributes<SVGSVGElement>> & {
    names: IconName[];
};

declare const Button: react.ForwardRefExoticComponent<ButtonProps & react.RefAttributes<HTMLButtonElement>>;

declare function IconButton({ variant, size, icon, label, className, active, ...rest }: IconButtonProps): react.JSX.Element;

declare const Text: react.ForwardRefExoticComponent<TextProps & react.RefAttributes<HTMLElement>>;

declare const Heading: react.ForwardRefExoticComponent<HeadingProps & react.RefAttributes<HTMLHeadingElement>>;

declare function SegmentedControl({ options, value, defaultValue, onChange, label, size, disabled, className }: SegmentedControlProps): react.JSX.Element;

declare function SliderField({ label, value, defaultValue, onChange, min, max, step, unit, format, disabled, className }: SliderFieldProps): react.JSX.Element;

declare function PressButton({ label, icon, fill, stroke, sensitivity, bounce, bars: barsProp, corner, recording, disabled, onStart, onRecord, className }: PressButtonProps): react.JSX.Element;

declare const Switch: react.ForwardRefExoticComponent<SwitchProps & react.RefAttributes<HTMLButtonElement>>;

declare const Checkbox: react.ForwardRefExoticComponent<CheckboxProps & react.RefAttributes<HTMLInputElement>>;

declare function RadioGroup(props: RadioGroupProps): react.JSX.Element;

declare function RadioCards(props: RadioCardsProps): react.JSX.Element;

declare const ChipGroup: react.ForwardRefExoticComponent<ChipGroupProps & react.RefAttributes<HTMLDivElement>>;

declare const Input: react.ForwardRefExoticComponent<InputProps & react.RefAttributes<HTMLInputElement>>;

declare function Textarea({ label, hint, error, className, optional, value, defaultValue, onChange, maxLength, disabled, ...rest }: TextareaProps): react.JSX.Element;

declare const Select: react.ForwardRefExoticComponent<SelectProps & react.RefAttributes<HTMLSelectElement>>;

declare function SettingRow({ title, description, icon, disabled, children, className }: SettingRowProps): react.JSX.Element;

declare const Card: react.ForwardRefExoticComponent<CardProps & react.RefAttributes<HTMLElement>>;

declare const ListRow: react.ForwardRefExoticComponent<ListRowProps & react.RefAttributes<HTMLElement>>;

declare const Divider: react.ForwardRefExoticComponent<DividerProps & react.RefAttributes<HTMLHRElement>>;

declare function Badge({ tone, children, className }: BadgeProps): react.JSX.Element;

declare function Avatar({ name, src, size, status, className }: AvatarProps): react.JSX.Element;

declare function Kbd({ children, className }: KbdProps): react.JSX.Element;

declare function Progress({ value, label, showValue, indeterminate, error, className }: ProgressProps): react.JSX.Element;

declare function Tooltip({ content, shortcut, side, open, children }: TooltipProps): react.JSX.Element;

declare function Toast({ tone, icon, action, onAction, onClose, children, className }: ToastProps): react.JSX.Element;

declare function Panel({ title, subtitle, onClose, footer, width, children, className }: PanelProps): react.JSX.Element;

declare function Stage({ toolbarLeft, toolbarRight, corner, height, children, className }: StageProps): react.JSX.Element;

declare function Dialog({ open, title, description, actions, onClose, inline, children }: DialogProps): react.JSX.Element | null;

export { Avatar, type AvatarProps, Badge, type BadgeProps, Button, type ButtonProps, Card, type CardProps, Checkbox, type CheckboxProps, ChipGroup, type ChipGroupProps, Dialog, type DialogProps, Divider, type DividerProps, Heading, type HeadingLevel, type HeadingProps, Icon, IconButton, type IconButtonProps, type IconComponent, type IconLike, type IconName, type IconProps, Input, type InputProps, Kbd, type KbdProps, ListRow, type ListRowProps, Panel, type PanelProps, PressButton, type PressButtonProps, Progress, type ProgressProps, type RadioCardOption, RadioCards, type RadioCardsProps, RadioGroup, type RadioGroupProps, type RadioOption, type SegmentOption, SegmentedControl, type SegmentedControlProps, Select, type SelectProps, SettingRow, type SettingRowProps, SliderField, type SliderFieldProps, Stage, type StageProps, Switch, type SwitchProps, Text, type TextElement, type TextProps, type TextTone, type TextVariant, Textarea, type TextareaProps, Toast, type ToastProps, Tooltip, type TooltipProps };


