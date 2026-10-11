// Tiny app-wide toast bus for the admin (no context plumbing needed).

export type ToastKind = "info" | "success" | "error";

export interface Toast {
  id: number;
  kind: ToastKind;
  text: string;
}

const TOAST_EVENT = "vk:admin-toast";
let nextId = 1;

export function showToast(kind: ToastKind, text: string) {
  window.dispatchEvent(
    new CustomEvent<Toast>(TOAST_EVENT, { detail: { id: nextId++, kind, text } }),
  );
}

export function onToast(handler: (toast: Toast) => void): () => void {
  const listener = (e: Event) => handler((e as CustomEvent<Toast>).detail);
  window.addEventListener(TOAST_EVENT, listener);
  return () => window.removeEventListener(TOAST_EVENT, listener);
}
