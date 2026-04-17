import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../test-utils";
import LandingPage from "../../pages/LandingPage/LandingPage";
import { server } from "../server";
import { graphql, HttpResponse } from "msw";

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mocks.navigate,
  };
});

describe("LandingPage", () => {
  it("renders join game options", async () => {
    render(<LandingPage />);
    
    expect(await screen.findByRole("heading", { name: /dołącz do gry/i })).toBeInTheDocument();
    
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent("classic");
    expect(buttons[1]).toHaveTextContent("infinite");
  });

  it("handles successful game join and redirects", async () => {
    vi.mocked(mocks.navigate).mockClear();

    const user = userEvent.setup();
    render(<LandingPage />);

    const classicBtn = await screen.findByRole("button", { name: /classic/i });
    await user.click(classicBtn);

    await waitFor(() => {
      expect(mocks.navigate).toHaveBeenCalledWith("/game/100");
    });
  });

  it("handles join failure with error message", async () => {
    server.use(
      graphql.mutation("JoinGame", () => {
        return HttpResponse.json({ errors: [{ message: "Już jesteś w grze" }] });
      })
    );

    const user = userEvent.setup();
    render(<LandingPage />);

    const classicBtn = await screen.findByRole("button", { name: /classic/i });
    await user.click(classicBtn);

    await waitFor(() => {
      expect(screen.getByText(/już jesteś w grze/i)).toBeInTheDocument();
    });
    
    // Clear error
    await user.click(screen.getByRole("button", { name: "✕" }));
    expect(screen.queryByText(/już jesteś w grze/i)).not.toBeInTheDocument();
  });
});
