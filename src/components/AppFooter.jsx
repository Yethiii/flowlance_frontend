import { Link } from "react-router-dom";

export default function AppFooter() {
  return (
    <footer className="w-full p-4 bg-gray-50 border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-900 dark:border-gray-700">
      <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
        © {new Date().getFullYear()} <Link to="/" className="hover:underline font-semibold">Flowlance™</Link>.
      </span>
      <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0 gap-4 md:gap-6">
        <li>
          <Link to="/legal" className="hover:underline">
            Mentions Légales & Confidentialité
          </Link>
        </li>
        <li>
          <a href="mailto:contact@flowlance.com" className="hover:underline">
            Contact
          </a>
        </li>
      </ul>
    </footer>
  );
}

