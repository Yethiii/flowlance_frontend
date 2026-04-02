import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppFooter from "../AppFooter";

describe("AppFooter", () => {
  test("affiche l'annee courante", () => {
    render(
      <MemoryRouter>
        <AppFooter />
      </MemoryRouter>
    );

    expect(screen.getByText(/flowlance/i).closest("footer")).toHaveTextContent(
      new Date().getFullYear().toString()
    );
  });

  test("affiche les liens principaux du footer", () => {
    render(
      <MemoryRouter>
        <AppFooter />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /flowlance/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /mentions/i })).toHaveAttribute("href", "/legal");
    expect(screen.getByRole("link", { name: /contact/i })).toHaveAttribute(
      "href",
      "mailto:contact@flowlance.com"
    );
  });
});
