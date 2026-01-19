import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { DatabaseTest } from "./DatabaseTest";

// Mock Supabase
vi.mock("../lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() =>
          Promise.resolve({
            data: [
              {
                id: 1,
                name: "Alice Johnson",
                email: "alice@example.com",
                created_at: "2024-01-01",
              },
              {
                id: 2,
                name: "Bob Smith",
                email: "bob@example.com",
                created_at: "2024-01-01",
              },
            ],
            error: null,
          }),
        ),
      })),
    })),
  },
}));

describe("DatabaseTest", () => {
  it("renders loading state initially", () => {
    render(<DatabaseTest />);
    expect(screen.getByText("Loading database data...")).toBeInTheDocument();
  });

  it("renders database data after loading", async () => {
    render(<DatabaseTest />);

    await waitFor(() => {
      expect(screen.getByText("Database Connection Test")).toBeInTheDocument();
    });

    expect(
      screen.getByText("✅ Connected to Supabase successfully!"),
    ).toBeInTheDocument();
    expect(screen.getByText("Test Users (2)")).toBeInTheDocument();
    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByText("Bob Smith")).toBeInTheDocument();
  });

  it("shows refresh button", async () => {
    render(<DatabaseTest />);

    await waitFor(() => {
      expect(screen.getByText("Refresh Data")).toBeInTheDocument();
    });
  });
});
