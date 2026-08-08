export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-200 py-4 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <div className="mb-4 md:mb-0">
          <span className="text-xl font-bold text-gray-700">PropertyPulse</span>
        </div>
        <div className="flex flex-wrap justify-center md:justify-start mb-4 md:mb-0">
          <ul className="flex space-x-4">
            <li>
              <a
                href="/properties"
                className="text-gray-600 hover:text-gray-900"
              >
                Properties
              </a>
            </li>
            <li>
              <a href="/terms" className="text-gray-600 hover:text-gray-900">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm text-gray-500 mt-2 md:mt-0">
            &copy; {currentYear} PropertyPulse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
