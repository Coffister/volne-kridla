import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { X } from "@phosphor-icons/react";

import Button from "@/ui/components/Button";
import CartIcon from "@/ui/icons/CartIcon";
import { Box, Squircle, Stack, Text } from "@/ui/primitives";
import { useCart } from "@/lib/CartContext";
import CheckoutModal from "@/sections/eshop/CheckoutModal";

import styles from "./CartButton.module.css";

export default function CartButton() {
  const { items, totalItems, removeItem } = useCart();
  const [open, setOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // the toolbar this button sits in clips its own bounds (Squircle uses
  // clip-path, which — unlike overflow — still clips absolutely positioned
  // descendants) so the dropdown is portaled out and positioned manually
  useLayoutEffect(() => {
    if (!open || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom + 12, left: rect.right });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        wrapRef.current &&
        !wrapRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <Stack direction="column" className={styles.wrap} ref={wrapRef}>
      <Box className={styles.triggerWrap}>
        <Button
          variant="primary"
          size="square"
          icon={<CartIcon />}
          onClick={() => setOpen((v) => !v)}
          ariaLabel="Košík"
          ariaExpanded={open}
        />
        {totalItems > 0 && (
          <Text
            as="span"
            weight="bold"
            className={styles.badge}
            style={{ fontSize: "0.7rem", lineHeight: 1 }}
          >
            {totalItems}
          </Text>
        )}
      </Box>

      {open &&
        createPortal(
          <Squircle
            radius="md"
            className={styles.dropdown}
            style={{
              position: "fixed",
              top: dropdownPos.top,
              left: dropdownPos.left,
              transform: "translateX(-100%)",
            }}
          >
            <div ref={dropdownRef}>
              {items.length === 0 ? (
                <Text as="p" variant="caption" className={styles.empty}>
                  Košík je prázdny
                </Text>
              ) : (
                <>
                  <Stack direction="column" gap="sm" className={styles.list}>
                    {items.map((item, i) => (
                      <Stack
                        key={i}
                        direction="row"
                        align="center"
                        gap="sm"
                        className={styles.item}
                      >
                        <Squircle radius="xs" className={styles.itemImage}>
                          {item.product.image && (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                            />
                          )}
                        </Squircle>
                        <Stack
                          direction="column"
                          gap="xs"
                          className={styles.itemInfo}
                        >
                          <Text
                            as="span"
                            variant="caption"
                            weight="semibold"
                            className={styles.itemName}
                          >
                            {item.product.name}
                          </Text>
                          {Object.keys(item.variants).length > 0 && (
                            <Text
                              as="span"
                              variant="caption"
                              className={styles.itemVariants}
                            >
                              {Object.entries(item.variants)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(" • ")}
                            </Text>
                          )}
                          <Text
                            as="span"
                            variant="caption"
                            className={styles.itemQty}
                          >
                            {item.quantity}ks
                          </Text>
                        </Stack>
                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={() =>
                            removeItem(
                              item.product.id,
                              JSON.stringify(item.variants),
                            )
                          }
                          aria-label="Odstrániť"
                        >
                          <X size={16} weight="bold" />
                        </button>
                      </Stack>
                    ))}
                  </Stack>
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
              <Text as="div" variant="caption" className={styles.browseLink}>
                <Link to="/eshop" onClick={() => setOpen(false)}>
                  Prehliadať produkty
                </Link>
              </Text>
            </div>
          </Squircle>,
          document.body,
        )}

      {checkoutOpen && <CheckoutModal onClose={() => setCheckoutOpen(false)} />}
    </Stack>
  );
}
