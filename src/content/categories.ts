// Known product category slugs, shared between the admin product form and
// the public /eshop filter tabs. A product's `category` is "" when
// uncategorized (shows under "Všetky produkty" only).

export interface ProductCategory {
  value: string;
  label: string;
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  { value: "trening", label: "Veci na tréning" },
  { value: "lietanie", label: "Veci na lietanie" },
];
