"use client";

import { startTransition, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const themeOptions = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const;

export function ThemeToggle() {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  const activeTheme = theme ?? "system";
  const resolvedThemeLabel =
    resolvedTheme === "dark" ? "Dark" : resolvedTheme === "light" ? "Light" : "System";

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <div
        aria-label="색상 테마 전환"
        className="theme-toggle-shell"
        role="group"
      >
        {themeOptions.map((option) => {
          const isActive = mounted && activeTheme === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isActive}
              className={`theme-toggle-button ${isActive ? "theme-toggle-button-active" : ""}`}
              onClick={() => {
                startTransition(() => {
                  setTheme(option.value);
                });
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <p className="text-xs font-medium text-slate-500">
        {mounted ? `현재 표시 테마: ${resolvedThemeLabel}` : "테마 불러오는 중"}
      </p>
    </div>
  );
}
