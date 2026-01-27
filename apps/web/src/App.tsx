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

function App() {
  const [connectionStatus, setConnectionStatus] = useState<
    null | "ok" | "fail"
  >(null);
  const [states, setStates] = useState<USState[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [savedSelections, setSavedSelections] = useState<StateSelection[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // Test connection by querying the Supabase REST API
        const { error } = await supabase
          .from("us_states")
          .select("id")
          .limit(1);
        if (error) {
          setConnectionStatus("fail");
        } else {
          setConnectionStatus("ok");
          await loadStates();
          await loadSelections();
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
              {states.map((state) => (
                <label
                  key={state.code}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: 8,
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    cursor: "pointer",
                    backgroundColor: selectedStates.includes(state.code)
                      ? "#e3f2fd"
                      : "white",
                  }}
                  data-testid={`state-option-${state.code}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedStates.includes(state.code)}
                    onChange={() => handleStateToggle(state.code)}
                    data-testid={`state-checkbox-${state.code}`}
                  />
                  <span>{state.name}</span>
                </label>
              ))}
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
