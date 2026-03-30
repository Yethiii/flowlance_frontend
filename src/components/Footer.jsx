import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";

export default function AppFooter() {
  return (
    <Footer container className="rounded-none shadow-none border-t bg-gray-50 dark:bg-gray-900">
      <div className="w-full text-center sm:flex sm:items-center sm:justify-between">
        <Footer.Copyright href="/" by="Flowlance™" year={new Date().getFullYear()} />
        <Footer.LinkGroup className="mt-3 flex-wrap items-center justify-center sm:mt-0">
          {/* On utilise Link de react-router-dom pour éviter le rechargement de la page */}
          <Link to="/legal" className="mr-4 hover:underline md:mr-6 text-sm text-gray-500 dark:text-gray-400">
            Mentions Légales & Confidentialité
          </Link>
          <a href="mailto:contact@flowlance.com" className="hover:underline text-sm text-gray-500 dark:text-gray-400">
            Contact
          </a>
        </Footer.LinkGroup>
      </div>
    </Footer>
  );
}