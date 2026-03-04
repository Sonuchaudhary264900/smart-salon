import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Top Navigation */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-grow max-w-6xl mx-auto px-6 py-10 w-full">
        {children}
      </main>

      {/* Optional Footer */}
      <footer className="bg-white border-t py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SmartSalon Platform
      </footer>

    </div>
  );
};

export default Layout;