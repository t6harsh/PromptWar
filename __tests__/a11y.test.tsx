import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, it, expect, vi } from "vitest";
import GameHUD from "../components/GameHUD";
import ActionMenu from "../components/ActionMenu";
import TimelineSidebar from "../components/TimelineSidebar";
import DialogueBox from "../components/DialogueBox";
import { ChronosProvider } from "../context/ChronosContext";
import { LazyMotion, domAnimation } from "framer-motion";

// expect.extend is handled in setup.ts

const TestProviders = ({ children }: { children: React.ReactNode }) => (
  <ChronosProvider>
    <LazyMotion features={domAnimation}>
      {children}
    </LazyMotion>
  </ChronosProvider>
);

describe("Accessibility Checks", () => {
  it("GameHUD should have no violations", async () => {
    const { container } = render(
      <TestProviders>
        <GameHUD />
      </TestProviders>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("ActionMenu should have no violations", async () => {
    const { container } = render(
      <TestProviders>
        <ActionMenu />
      </TestProviders>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("TimelineSidebar should have no violations", async () => {
    const { container } = render(
      <TestProviders>
        <TimelineSidebar />
      </TestProviders>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("DialogueBox should have no violations", async () => {
    const { container } = render(
      <TestProviders>
        <DialogueBox />
      </TestProviders>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
