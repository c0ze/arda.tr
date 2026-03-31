import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "@/App";

describe("App", () => {
  it("renders the core landing page sections and calls to action", () => {
    render(<App />);

    expect(screen.getByRole("heading", { level: 1, name: "Arda Karaduman" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Select theme" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Resume" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Blog" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "AI Chat" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "About" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Projects" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Games" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Tools" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Music Projects" })).toBeInTheDocument();
  });
});
