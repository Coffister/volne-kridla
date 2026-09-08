import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import Button from "@/ui/components/Button";
import CartIcon from "@/ui/icons/CartIcon";
import { useCart } from "@/lib/CartContext";
import CheckoutModal from "@/sections/eshop/CheckoutModal";

import styles from "./CartButton.module.css";

const VARIANT_LABELS: Record<string, string> = { color: "Farba", size: "Veľkosť" };

export default function CartButton() {
  const { items, totalItems, removeItem } = useCart();
  const [open, setOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <div className={styles.triggerWrap}>
        <Button
          variant="primary"
          size="square"
          icon={<CartIcon />}
          onClick={() => setOpen((v) => !v)}
          ariaLabel="Košík"
          ariaExpanded={open}
        />
        {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
      </div>

      {open && (
        <div className={styles.dropdown}>
          {items.length === 0 ? (
            <p className={styles.empty}>Košík je prázdny</p>
          ) : (
            <>
              <ul className={styles.list}>
                {items.map((item, i) => (
                  <li key={i} className={styles.item}>
                    <div className={styles.itemImage}>
                      {item.product.image && (
                        <img src={item.product.image} alt={item.product.name} />
                      )}
                    </div>
                    <div className={styles.itemInfo}>
                      <span className={styles.itemName}>{item.product.name}</span>
                      {Object.keys(item.variants).length > 0 && (
                        <span className={styles.itemVariants}>
                          {Object.entries(item.variants)
                            .map(([k, v]) => `${VARIANT_LABELS[k] ?? k}: ${v}`)
                            .join(" • ")}
                        </span>
                      )}
                      <span className={styles.itemQty}>{item.quantity}ks</span>
                    </div>
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => removeItem(item.product.id, JSON.stringify(item.variants))}
                      aria-label="Odstrániť"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <Button
                variant="primary"
                fullWidth
                onClick={() => {
                  setOpen(false);
                  setCheckoutOpen(true);
                }}
              >
                Objednať
              </Button>
            </>
          )}
          <Link to="/eshop" className={styles.browseLink} onClick={() => setOpen(false)}>
            Prehliadať produkty
          </Link>
        </div>
      )}

      {checkoutOpen && <CheckoutModal onClose={() => setCheckoutOpen(false)} />}
    </div>
  );
}
