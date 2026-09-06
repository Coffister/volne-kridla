interface JsonLdProps {
  data: object;
}

/** Injects a JSON-LD <script> tag — structured data for search engines and
 * AI answer engines (Google AI Overviews, Perplexity, etc.) to extract. */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output — not user-authored HTML, safe to inject
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
