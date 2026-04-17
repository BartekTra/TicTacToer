import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { GameBoard } from "../../pages/GamePage/GameComponents/GameBoard";

describe("GameBoard", () => {
  const onMove = vi.fn();

  it("renders 9 cells for a standard board", () => {
    render(<GameBoard boardString="123456789" onMove={onMove} />);

    const cells = screen.getAllByRole("gridcell");
    expect(cells).toHaveLength(9);
  });

  it("displays X and O marks correctly", () => {
    render(<GameBoard boardString="XO3456789" onMove={onMove} />);

    expect(screen.getByText("X")).toBeInTheDocument();
    expect(screen.getByText("O")).toBeInTheDocument();
  });

  it("renders empty cells without text", () => {
    render(<GameBoard boardString="123456789" onMove={onMove} />);

    expect(screen.queryByText("X")).not.toBeInTheDocument();
    expect(screen.queryByText("O")).not.toBeInTheDocument();
  });

  it("disables cells that already have a mark", () => {
    render(<GameBoard boardString="XO3456789" onMove={onMove} />);

    const cells = screen.getAllByRole("gridcell");
    expect(cells[0]).toBeDisabled();
    expect(cells[1]).toBeDisabled();
    expect(cells[2]).not.toBeDisabled();
  });

  it("has correct aria-labels", () => {
    render(<GameBoard boardString="X23456789" onMove={onMove} />);

    expect(
      screen.getByLabelText("Pole 1 - X"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Pole 2 - puste"),
    ).toBeInTheDocument();
  });
});
