import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
// latin-ext before latin (same order as Google Fonts): Chrome measures the
// `ch` unit on the last-declared face, which must contain the "0" glyph
import "@fontsource/poppins/latin-ext-400.css";
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-ext-500.css";
import "@fontsource/poppins/latin-500.css";
import "@fontsource/poppins/latin-ext-600.css";
import "@fontsource/poppins/latin-600.css";
import "@fontsource/poppins/latin-ext-700.css";
import "@fontsource/poppins/latin-700.css";
import "@fontsource/poppins/latin-ext-800.css";
import "@fontsource/poppins/latin-800.css";
import "@/styles/fonts.css";
import "@/ui/foundation/variables.css";
import App from './App';
import './index.css';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Public pages ship prerendered HTML (scripts/prerender.mjs) — hydrate it.
// The empty shell (spa.html: admin, redirects) renders from scratch.
if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
