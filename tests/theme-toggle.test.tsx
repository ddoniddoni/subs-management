import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ThemeToggle } from "@/components/shared/theme-toggle";

const setTheme = vi.fn();

vi.mock("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: "dark",
    setTheme,
    theme: "system",
  }),
}));

describe("ThemeToggle", () => {
  it("renders theme options and updates the selected theme", async () => {
    const user = userEvent.setup();

    render(<ThemeToggle />);

    expect(
      await screen.findByText((_, element) => element?.textContent === "현재 표시 테마: Dark"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Light" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dark" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "System" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await user.click(screen.getByRole("button", { name: "Dark" }));

    expect(setTheme).toHaveBeenCalledWith("dark");
  });
});
