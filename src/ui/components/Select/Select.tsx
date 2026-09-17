import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Text } from "@/ui/primitives";
import ChevronDownIcon from "@/ui/icons/ChevronDownIcon";

import styles from "./Select.module.css";

interface SelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Custom dropdown for picking a single option — a native <select>'s open
// option list can't be styled (renders as the OS's own default UI), so this
// swaps in our own trigger + list, portaled out to document.body since it
// commonly lives inside a Squircle card whose clip-path would otherwise
// clip the open menu.
export default function Select({
  options,
  value,
  onChange,
  placeholder = "zvoľte možnosť",
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    width: number;
  }>({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    // Menu's own max-height (Select.module.css) — flip it above the trigger
    // when there isn't enough room below, so it doesn't render off-screen.
    const menuMaxHeight = 240;
    const opensUpward = spaceBelow < menuMaxHeight + 4 && rect.top > spaceBelow;
    setMenuPos({
      top: opensUpward ? undefined : rect.bottom + 4,
      bottom: opensUpward ? window.innerHeight - rect.top + 4 : undefined,
      left: rect.left,
      width: rect.width,
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.trigger} ${className ?? ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Text
          as="span"
          variant="caption"
          className={value ? styles.value : styles.placeholder}
        >
          {value || placeholder}
        </Text>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}>
          <ChevronDownIcon />
        </span>
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            className={styles.menu}
            data-lenis-prevent
            style={{
              position: "fixed",
              top: menuPos.top,
              bottom: menuPos.bottom,
              left: menuPos.left,
              width: menuPos.width,
            }}
          >
            {options.map((option) => (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={option === value}
                className={`${styles.option} ${option === value ? styles.optionSelected : ""}`}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
              >
                <Text as="span" variant="caption">
                  {option}
                </Text>
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
