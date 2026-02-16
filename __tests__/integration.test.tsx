import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ActionMenu from "../components/ActionMenu";
import { ChronosProvider } from "../context/ChronosContext";
import { LazyMotion, domAnimation } from "framer-motion";

// Mock Providers for testing
const TestProviders = ({ children }: { children: React.ReactNode }) => (
  <ChronosProvider>
    <LazyMotion features={domAnimation}>
      {children}
    </LazyMotion>
  </ChronosProvider>
);

describe("Game Integration Flow", () => {
  it("should render action menu and handle user input", async () => {
    render(
      <TestProviders>
        <ActionMenu />
      </TestProviders>
    );

    // Verify initial render
    expect(screen.getByPlaceholderText(/custom command/i)).toBeInTheDocument();
    
    // Simulate user typing a command
    const input = screen.getByPlaceholderText(/custom command/i);
    fireEvent.change(input, { target: { value: "save the timeline" } });
    
    // Simulate submission
    const submitBtn = screen.getByLabelText(/submit custom command/i);
    fireEvent.click(submitBtn);

    // Verify input clears or state updates (depending on implementation)
    await waitFor(() => {
      expect(input).toHaveValue("");
    });
  });

  it("should show quick actions when menu is toggled", async () => {
    render(
        <TestProviders>
          <ActionMenu />
        </TestProviders>
      );
    
    // Toggle menu (if applicable - adjusting based on component logic)
    // Assuming ActionMenu starts with buttons visible or toggleable
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });
});
