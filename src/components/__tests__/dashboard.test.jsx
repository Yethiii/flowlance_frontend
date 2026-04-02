import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../dashboard";
import { getCurrentUser } from "../../services/api";

const mockNavigate = vi.fn();

vi.mock("../../services/api", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../dashboardFreelance", () => ({
  default: () => <div>Dashboard Freelance Mock</div>,
}));

vi.mock("../dashboardCompany", () => ({
  default: () => <div>Dashboard Company Mock</div>,
}));

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("affiche le dashboard freelance pour un utilisateur freelance actif", async () => {
    getCurrentUser.mockResolvedValue({
      role: "FREELANCE",
      is_profile_active: true,
    });

    render(<Dashboard />);

    expect(screen.getByText(/identification en cours/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Dashboard Freelance Mock")).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
