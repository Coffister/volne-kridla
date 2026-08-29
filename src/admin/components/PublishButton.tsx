import { useState } from "react";

import { requestPublish } from "../lib/publish";

type State =
  | { kind: "idle" }
  | { kind: "busy" }
  | { kind: "done" }
  | { kind: "error"; message: string };

export default function PublishButton() {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onClick() {
    setState({ kind: "busy" });
    try {
      await requestPublish();
      setState({ kind: "done" });
      setTimeout(() => setState({ kind: "idle" }), 6000);
    } catch (e) {
      setState({
        kind: "error",
        message: e instanceof Error ? e.message : "Publikovanie zlyhalo.",
      });
    }
  }

  return (
    <div className="admin-publish">
      <button
        type="button"
        className="admin-btn"
        onClick={onClick}
        disabled={state.kind === "busy"}
      >
        {state.kind === "busy" ? "Spúšťam…" : "Publikovať zmeny"}
      </button>
      {state.kind === "done" && (
        <span className="admin-publish-note">
          Spustené — web sa prebuduje o ~1–2 min.
        </span>
      )}
      {state.kind === "error" && (
        <span className="admin-publish-note is-error">{state.message}</span>
      )}
      {state.kind === "idle" && (
        <span className="admin-publish-note is-muted">
          Zmeny sa na webe zobrazia až po publikovaní.
        </span>
      )}
    </div>
  );
}
