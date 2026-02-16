import "@testing-library/jest-dom/vitest";
import "vitest-axe/extend-expect";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import React from "react";

// Cleanup after each test
afterEach(() => {
    cleanup();
});

// Mock next/image
vi.mock("next/image", () => ({
    __esModule: true,
    default: function MockImage(props: Record<string, unknown>) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { fill, priority, sizes, ...rest } = props;
        return React.createElement("img", rest as React.ImgHTMLAttributes<HTMLImageElement>);
    },
}));

// Mock next/dynamic — returns null for lazy components
vi.mock("next/dynamic", () => ({
    __esModule: true,
    default: () => {
        return function DynamicComponent() {
            return null;
        };
    },
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => {
    const createMotionProxy = (): Record<string, React.FC<Record<string, unknown>>> => {
        return new Proxy({} as Record<string, React.FC<Record<string, unknown>>>, {
            get: (_target, prop: string) => {
                return function MotionComponent(props: Record<string, unknown>) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { animate, initial, exit, transition, whileHover, whileTap, variants, ...rest } = props;
                    return React.createElement(prop, rest);
                };
            },
        });
    };

    return {
        motion: createMotionProxy(),
        m: createMotionProxy(),
        AnimatePresence: function AnimatePresence({ children }: { children: React.ReactNode }) {
            return children;
        },
        LazyMotion: function LazyMotion({ children }: { children: React.ReactNode }) {
            return children;
        },
        domAnimation: {},
    };
});
