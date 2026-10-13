import { useEffect, useRef, useState, type PointerEvent } from "react";

export interface ImagePosition {
  x: number;
  y: number;
}

interface Props {
  src: string;
  initial: ImagePosition;
  onSave: (pos: ImagePosition) => void | Promise<void>;
  onClose: () => void;
}

// The two frames the public review card actually crops into (see
// sections/testimonials/testimonials.module.css): a tall half-card on desktop
// and a 4:3 strip above the text on mobile. One focal point drives both.
const FRAMES = [
  { key: "desktop", label: "Počítač", ratio: 7 / 10 },
  { key: "mobile", label: "Mobil", ratio: 4 / 3 },
] as const;

const DEFAULT_POS: ImagePosition = { x: 50, y: 0 };

const clamp = (v: number) => Math.min(100, Math.max(0, v));

/**
 * Lets the admin drag a review photo inside the card's frames to choose what
 * stays visible. Stores a CSS object-position (percent), not a destructive
 * crop — the same photo has to work in both a portrait and a landscape frame.
 */
export default function ImagePositionDialog({ src, initial, onSave, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pos, setPos] = useState<ImagePosition>(initial);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const drag = useRef<{
    startX: number;
    startY: number;
    from: ImagePosition;
    overflowX: number;
    overflowY: number;
  } | null>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (!natural) return;
    const frame = e.currentTarget.getBoundingClientRect();
    // object-fit: cover scale → how many px the image sticks out of the frame
    const scale = Math.max(frame.width / natural.w, frame.height / natural.h);
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      from: pos,
      overflowX: natural.w * scale - frame.width,
      overflowY: natural.h * scale - frame.height,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d) return;
    // dragging the photo right reveals more of its left side → lower x%.
    // An axis with no overflow can't move in this frame, so leave it alone.
    setPos({
      x: d.overflowX > 0.5 ? clamp(d.from.x - ((e.clientX - d.startX) / d.overflowX) * 100) : d.from.x,
      y: d.overflowY > 0.5 ? clamp(d.from.y - ((e.clientY - d.startY) / d.overflowY) * 100) : d.from.y,
    });
  }

  function endDrag() {
    drag.current = null;
  }

  async function save() {
    setSaving(true);
    try {
      await onSave({ x: Math.round(pos.x), y: Math.round(pos.y) });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  const objectPosition = `${pos.x}% ${pos.y}%`;

  return (
    <dialog
      ref={dialogRef}
      className="admin-crop-dialog"
      onClose={onClose}
    >
      <h3>Upraviť orez fotky</h3>
      <p className="admin-muted">
        Potiahni fotku prstom alebo myšou. Obe náhľady sa menia spolu — takto ju
        uvidia návštevníci na počítači aj na mobile.
      </p>

      <div className="admin-crop-frames">
        {FRAMES.map((f) => (
          <figure key={f.key}>
            <div
              className="admin-crop-frame"
              style={{ aspectRatio: f.ratio }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >
              <img
                src={src}
                alt=""
                draggable={false}
                style={{ objectPosition }}
                onLoad={(e) =>
                  setNatural({
                    w: e.currentTarget.naturalWidth,
                    h: e.currentTarget.naturalHeight,
                  })
                }
              />
            </div>
            <figcaption>{f.label}</figcaption>
          </figure>
        ))}
      </div>

      <div className="admin-crop-actions">
        <button type="button" className="admin-ghost" onClick={() => setPos(DEFAULT_POS)}>
          Pôvodné
        </button>
        <span />
        <button type="button" className="admin-ghost" onClick={onClose}>
          Zrušiť
        </button>
        <button type="button" className="admin-btn" onClick={save} disabled={saving}>
          {saving ? "Ukladám…" : "Uložiť"}
        </button>
      </div>
    </dialog>
  );
}
