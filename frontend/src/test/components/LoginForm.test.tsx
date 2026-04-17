import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../test/test-utils";
import { LoginForm } from "../../pages/Auth/LoginPage/LoginComponents/LoginForm";
import { server } from "../../test/server";
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

describe("LoginForm", () => {
  it("renders correctly", async () => {
    render(<LoginForm />);
    
    expect(await screen.findByLabelText(/adres e-mail/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /zaloguj się/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/adres e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hasło/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /zaloguj/i })).toBeInTheDocument();
  });

  it("handles successful login and redirects", async () => {
    vi.mocked(mocks.navigate).mockClear();

    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = await screen.findByLabelText(/adres e-mail/i);
    await user.type(emailInput, "test@example.com");
    await user.type(screen.getByLabelText(/hasło/i), "password");
    await user.click(screen.getByRole("button", { name: /zaloguj/i }));

    await waitFor(() => {
      expect(mocks.navigate).toHaveBeenCalledWith("/");
    });
  });

  it("handles login failure with error message", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = await screen.findByLabelText(/adres e-mail/i);
    await user.type(emailInput, "wrong@example.com");
    await user.type(screen.getByLabelText(/hasło/i), "wrongpass");
    await user.click(screen.getByRole("button", { name: /zaloguj/i }));

    await waitFor(() => {
      expect(screen.getByText(/nieprawidłowe dane logowania/i)).toBeInTheDocument();
    });
  });

  it("handles GraphQL network error", async () => {
    server.use(
      graphql.mutation("LoginUser", () => {
        return HttpResponse.json({ errors: [{ message: "Wystąpił błąd po stronie serwera" }] });
      })
    );

    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = await screen.findByLabelText(/adres e-mail/i);
    await user.type(emailInput, "test@example.com");
    await user.type(screen.getByLabelText(/hasło/i), "password");
    await user.click(screen.getByRole("button", { name: /zaloguj/i }));

    await waitFor(() => {
      expect(screen.getByText(/wystąpił błąd po stronie serwera/i)).toBeInTheDocument();
    });
  });
});
