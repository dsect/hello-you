import { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "./lib/supabase";

interface USState {
  id: number;
  name: string;
  code: string;
}

interface StateSelection {
  id: number;
  state_code: string;
  selected_at: string;
}

interface StateVisit {
  id: number;
  state_code: string;
  visited_at: string;
  notes: string | null;
}

function App() {
  const [connectionStatus, setConnectionStatus] = useState<
    null | "ok" | "fail"
  >(null);
  const [states, setStates] = useState<USState[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [savedSelections, setSavedSelections] = useState<StateSelection[]>([]);
  const [stateVisits, setStateVisits] = useState<StateVisit[]>([]);
  const [loading, setLoading] = useState(false);
  const [visitNotes, setVisitNotes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    (async () => {
      try {
        // Try a simple fetch to the REST API root, which always works if Supabase is up
        const url =
          import.meta.env.VITE_SUPABASE_URL || "http://127.0.0.1:54321";
        const res = await fetch(url + "/rest/v1/", { method: "GET" });
        setConnectionStatus(res.ok ? "ok" : "fail");

        if (res.ok) {
          await loadStates();
          await loadSelections();
          await loadVisits();
        }
      } catch {
        setConnectionStatus("fail");
      }
    })();
  }, []);

  const loadStates = async () => {
    const { data, error } = await supabase
      .from("us_states")
      .select("*")
      .order("name");

    if (!error && data) {
      setStates(data);
    }
  };

  const loadSelections = async () => {
    const { data, error } = await supabase
      .from("us_state_selections")
      .select("*")
      .order("selected_at", { ascending: false });

    if (!error && data) {
      setSavedSelections(data);
    }
  };

  const loadVisits = async () => {
    const { data, error } = await supabase
      .from("state_visits")
      .select("*")
      .order("visited_at", { ascending: false });

    if (!error && data) {
      setStateVisits(data);
    }
  };

  const isStateVisited = (stateCode: string) => {
    return stateVisits.some((visit) => visit.state_code === stateCode);
  };

  const handleToggleVisit = async (code: string) => {
    const existingVisit = stateVisits.find((v) => v.state_code === code);

    if (existingVisit) {
      // Remove visit
      const { error } = await supabase
        .from("state_visits")
        .delete()
        .eq("state_code", code);

      if (!error) {
        await loadVisits();
        setVisitNotes((prev) => {
          const newNotes = { ...prev };
          delete newNotes[code];
          return newNotes;
        });
      }
    } else {
      // Add visit
      const { error } = await supabase.from("state_visits").insert({
        state_code: code,
        visited_at: new Date().toISOString(),
        notes: visitNotes[code] || null,
      });

      if (!error) {
        await loadVisits();
        setVisitNotes((prev) => {
          const newNotes = { ...prev };
          delete newNotes[code];
          return newNotes;
        });
      }
    }
  };

  const formatVisitDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleStateToggle = (code: string) => {
    setSelectedStates((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  const handleSaveSelections = async () => {
    if (selectedStates.length === 0) return;

    setLoading(true);
    try {
      const inserts = selectedStates.map((code) => ({
        state_code: code,
        selected_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from("us_state_selections")
        .insert(inserts);

      if (!error) {
        setSelectedStates([]);
        await loadSelections();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: 16 }}>
      <h1>State Selector</h1>

      <div style={{ marginBottom: 16 }} data-testid="supabase-status">
        <b>Supabase connection status: </b>
        {connectionStatus === null && <span>Checking...</span>}
        {connectionStatus === "ok" && (
          <span style={{ color: "green" }}>Connected</span>
        )}
        {connectionStatus === "fail" && (
          <span style={{ color: "red" }}>Not connected</span>
        )}
      </div>

      {connectionStatus === "ok" && (
        <>
          <section style={{ marginBottom: 24 }}>
            <h2>Select States</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: 8,
                marginBottom: 16,
              }}
              data-testid="states-list"
            >
              {states.map((state) => {
                const visited = isStateVisited(state.code);
                return (
                  <div
                    key={state.code}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                      padding: 8,
                      border: "1px solid #ccc",
                      borderRadius: 4,
                      backgroundColor: visited
                        ? "#e8f5e9"
                        : selectedStates.includes(state.code)
                          ? "#e3f2fd"
                          : "white",
                    }}
                    data-testid={`state-option-${state.code}`}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedStates.includes(state.code)}
                        onChange={() => handleStateToggle(state.code)}
                        data-testid={`state-checkbox-${state.code}`}
                      />
                      <span>{state.name}</span>
                      {visited && (
                        <span
                          data-testid={`visited-indicator-${state.code}`}
                          style={{ color: "green", fontSize: "12px" }}
                        >
                          ✓
                        </span>
                      )}
                    </label>
                    <button
                      onClick={() => handleToggleVisit(state.code)}
                      style={{
                        padding: "4px 8px",
                        fontSize: 12,
                        backgroundColor: visited ? "#ff9800" : "#4caf50",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                      data-testid={`mark-visited-button-${state.code}`}
                    >
                      {visited ? "Unmark" : "Mark as Visited"}
                    </button>
                    {!visited && (
                      <input
                        type="text"
                        placeholder="Add notes (optional)"
                        value={visitNotes[state.code] || ""}
                        onChange={(e) =>
                          setVisitNotes((prev) => ({
                            ...prev,
                            [state.code]: e.target.value,
                          }))
                        }
                        style={{
                          padding: "4px 8px",
                          fontSize: 12,
                          border: "1px solid #ccc",
                          borderRadius: 4,
                        }}
                        data-testid={`visit-notes-input-${state.code}`}
                      />
                    )}
                    {visited && (
                      <span
                        data-testid={`visit-date-${state.code}`}
                        style={{ fontSize: 11, color: "#666" }}
                      >
                        Visited{" "}
                        {formatVisitDate(
                          stateVisits.find((v) => v.state_code === state.code)
                            ?.visited_at || "",
                        )}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleSaveSelections}
              disabled={selectedStates.length === 0 || loading}
              style={{
                padding: "12px 24px",
                fontSize: 16,
                backgroundColor:
                  selectedStates.length === 0 ? "#ccc" : "#1976d2",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: selectedStates.length === 0 ? "not-allowed" : "pointer",
              }}
              data-testid="save-selections-button"
            >
              {loading
                ? "Saving..."
                : `Save ${selectedStates.length} Selection${selectedStates.length !== 1 ? "s" : ""}`}
            </button>
          </section>

          <section style={{ marginBottom: 24 }}>
            <h2>Visited States</h2>
            <div data-testid="visited-list">
              {stateVisits.length === 0 ? (
                <p style={{ color: "#666" }}>No states visited yet.</p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {stateVisits.map((visit) => {
                    const state = states.find(
                      (s) => s.code === visit.state_code,
                    );
                    return (
                      <li
                        key={visit.id}
                        style={{
                          padding: 8,
                          marginBottom: 8,
                          border: "1px solid #e0e0e0",
                          borderRadius: 4,
                          backgroundColor: "#f9f9f9",
                        }}
                        data-testid={`visited-item-${visit.id}`}
                      >
                        <strong>{state?.name || visit.state_code}</strong> -{" "}
                        <span data-testid={`visit-date-${visit.id}`}>
                          {formatVisitDate(visit.visited_at)}
                        </span>
                        {visit.notes && (
                          <div
                            style={{
                              marginTop: 4,
                              fontSize: 14,
                              color: "#555",
                            }}
                          >
                            {visit.notes}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>

          <section>
            <h2>Recent Selections</h2>
            <div data-testid="saved-selections">
              {savedSelections.length === 0 ? (
                <p style={{ color: "#666" }}>No selections saved yet.</p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {savedSelections.map((selection) => {
                    const state = states.find(
                      (s) => s.code === selection.state_code,
                    );
                    return (
                      <li
                        key={selection.id}
                        style={{
                          padding: 8,
                          marginBottom: 8,
                          border: "1px solid #e0e0e0",
                          borderRadius: 4,
                        }}
                        data-testid={`saved-selection-${selection.id}`}
                        data-state-code={selection.state_code}
                      >
                        <strong>{state?.name || selection.state_code}</strong> -{" "}
                        {new Date(selection.selected_at).toLocaleString()}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default App;
