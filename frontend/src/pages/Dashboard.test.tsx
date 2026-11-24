import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Dashboard from "./Dashboard";
import type { User } from "../types";

const user: User = {
  id: 1,
  firstName: "Ana",
  lastName: "Novak",
  email: "ana@example.com",
  role: "CUSTOMER",
};

afterEach(() => {
  cleanup();
});

describe("Dashboard", () => {
  it("ne prikaže ničesar, če uporabnik ni prijavljen", () => {
    const { container } = render(
      <Dashboard currentUser={null} onLogout={() => {}} />
    );

    expect(container.innerHTML).toBe("");
  });

  it("prikaže ime prijavljenega uporabnika", () => {
    render(<Dashboard currentUser={user} onLogout={() => {}} />);

    expect(screen.getAllByText(/Ana/).length).toBeGreaterThan(0);
  });

  it("ob kliku na Odjava pokliče onLogout", () => {
    const onLogout = vi.fn();
    render(<Dashboard currentUser={user} onLogout={onLogout} />);

    fireEvent.click(screen.getByText("Odjava"));

    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it("prikaže povezave do glavnih strani", () => {
    render(<Dashboard currentUser={user} onLogout={() => {}} />);

    expect(screen.getAllByText("Galerija").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Skupnost").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Naroči termin").length).toBeGreaterThan(0);
  });
});