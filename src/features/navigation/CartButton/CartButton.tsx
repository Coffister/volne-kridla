import { useNavigate } from "react-router-dom";

import Button from "@/ui/components/Button";
import CartIcon from "@/ui/icons/CartIcon";
import { Box, Text } from "@/ui/primitives";
import { useCart } from "@/lib/CartContext";

import styles from "./CartButton.module.css";

export default function CartButton() {
  const { totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <Box className={styles.triggerWrap}>
      <Button
        variant="primary"
        size="square"
        icon={<CartIcon />}
        onClick={() => navigate("/eshop/checkout")}
        ariaLabel="Košík"
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
  );
}
