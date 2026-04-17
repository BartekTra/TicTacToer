import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useAuth } from "../../context/AuthContext";
import { AllTheProviders as wrapper } from "../test-utils";

describe.skip("AuthContext", () => {
  it("fetches current user and sets authentication state", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.user).not.toBeNull();
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.nickname).toBe("Teścik");
  });

  it("handles logout correctly", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    await result.current.handleLogout();

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
