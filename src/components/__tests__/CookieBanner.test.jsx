import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CookieBanner from "../CookieBanner";

describe("CookieBanner", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("reste cache si deja ignore", () => {
    localStorage.setItem("flowlance_banner_dismissed", "true");

    render(
      <MemoryRouter>
        <CookieBanner />
      </MemoryRouter>
    );

    expect(screen.queryByRole("button", { name: /j'ai compris/i })).not.toBeInTheDocument();
  });

  test("s'affiche puis se ferme et persiste localStorage", () => {
    localStorage.removeItem("flowlance_banner_dismissed");

    render(
      <MemoryRouter>
        <CookieBanner />
      </MemoryRouter>
    );

    const dismissButton = screen.getByRole("button", { name: /j'ai compris/i });
    expect(dismissButton).toBeInTheDocument();

    fireEvent.click(dismissButton);

    expect(localStorage.getItem("flowlance_banner_dismissed")).toBe("true");
    expect(screen.queryByRole("button", { name: /j'ai compris/i })).not.toBeInTheDocument();
  });
});
