import type { ReactNode, CSSProperties, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from "react";

export type Tone = "ok" | "warn" | "danger" | "idle";

export interface ShellProps { header: ReactNode; banner?: ReactNode; children?: ReactNode; style?: CSSProperties; className?: string; }
export interface PageHeadProps { title: ReactNode; subtitle?: ReactNode; actions?: ReactNode; }
export interface AppHeaderProps { title?: ReactNode; subtitle?: ReactNode; nav?: ReactNode; statuses?: StatusChipProps[]; actions?: ReactNode; }
export interface NavTabsItem { id: string; label: ReactNode; warn?: boolean | string; count?: ReactNode; key?: string; }
export interface NavTabsProps { items: NavTabsItem[]; value?: string; defaultValue?: string; onChange?: (id: string) => void; }
export interface EStopProps { engaged?: boolean; onClick?: () => void; size?: "md" | "lg"; label?: string; resetLabel?: string; className?: string; }
export interface StatusChipProps { tone?: Tone; label?: ReactNode; detail?: ReactNode; title?: string; className?: string; }
export interface NoticeProps { tone?: "danger" | "warn" | "ok" | "info"; title?: ReactNode; children?: ReactNode; action?: ReactNode; bar?: boolean; className?: string; }
export interface PanelProps { title?: ReactNode; meta?: ReactNode; actions?: ReactNode; footer?: ReactNode; tone?: "danger"; flush?: boolean; children?: ReactNode; className?: string; style?: CSSProperties; }
export type IconName = "minus" | "plus" | "expand" | "chevron" | "play" | "pause" | "download" | "trash" | "link" | "home" | "gripper" | "stop";
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: "primary" | "secondary" | "ghost" | "danger" | "danger-outline"; size?: "sm" | "md" | "lg"; icon?: IconName; iconOnly?: boolean; }
export interface SegmentedOption<T> { value: T; label: ReactNode; disabled?: boolean; }
export interface SegmentedProps<T = string | number> { options: (T | SegmentedOption<T>)[]; value?: T; defaultValue?: T; onChange?: (v: T) => void; label?: string; hideLabel?: boolean; mono?: boolean; disabled?: boolean; }
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> { suffix?: ReactNode; size?: "sm" | "md"; dirty?: boolean; invalid?: boolean; label?: ReactNode; width?: number | string; }
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> { options: (string | { value: string | number; label: ReactNode })[]; size?: "sm" | "md"; dirty?: boolean; label?: ReactNode; width?: number | string; }
export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> { label?: ReactNode; }
export interface SliderProps { label?: ReactNode; ariaLabel?: string; value?: number; defaultValue?: number; onChange?: (v: number) => void; min?: number; max?: number; step?: number; unit?: string; format?: (v: number) => ReactNode; disabled?: boolean; unknown?: boolean; labelWidth?: number; }
export interface RangeBarProps { min: number; max: number; value?: number | null; domain?: [number, number]; ticks?: boolean; className?: string; style?: CSSProperties; }
export interface JointRowProps { joint: string; value?: number | null; min: number; max: number; step?: number; onStep?: (dir: -1 | 1) => void; disabled?: boolean; digits?: number; }
export interface ReadoutProps { label: ReactNode; value?: number | string | null; unit?: string; digits?: number; size?: "sm" | "md"; }
export interface TableColumn { key: string; label: ReactNode; align?: "num" | "center" | "end"; width?: number | string; hint?: string; }
export interface TableProps { columns: TableColumn[]; rows: Record<string, ReactNode>[]; }
export interface Stage { title: ReactNode; joints: ReactNode; state?: "done" | "active"; status?: ReactNode; }
export interface StagesProps { stages: Stage[]; }
export interface SaveBarProps { dirty?: number | boolean; file?: string; note?: string; saveLabel?: string; onCancel?: () => void; onSave?: () => void; }
export interface CameraViewProps { src?: string; cameras?: string[]; camera?: number; defaultCamera?: number; onCameraChange?: (i: number) => void; meta?: string; onFullscreen?: () => void; emptyText?: string; emptyDetail?: string; className?: string; style?: CSSProperties; }
export interface LogLine { t: string; level?: "info" | "ok" | "warn" | "error" | "tx" | "rx"; text: ReactNode; }
export interface LogViewProps { lines: LogLine[]; height?: number | string; emptyText?: string; className?: string; style?: CSSProperties; }
export interface IconProps { name: IconName; className?: string; strokeWidth?: number; }
