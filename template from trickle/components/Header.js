function Header() {
  try {
    return (
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm z-50 border-b border-[var(--border-color)]" data-name="header" data-file="components/Header.js">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <div className="flex-shrink-0">
              <h1 className="text-3xl tracking-wide text-[var(--primary-color)]" style={{fontFamily: "'Playfair Display', serif"}}>Kloset</h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-10">
              <a href="#occasions" className="text-sm tracking-wide text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors">Shop Occasions</a>
              <a href="#how-it-works" className="text-sm tracking-wide text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors">How It Works</a>
              <a href="#" className="text-sm tracking-wide text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors">List Your Outfit</a>
            </nav>
            
            <div className="flex items-center space-x-6">
              <button className="hidden sm:block text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors">
                <div className="icon-heart text-xl"></div>
              </button>
              <button className="text-sm tracking-wide px-6 py-2.5 bg-[var(--primary-color)] text-white hover:opacity-90 transition-opacity">Account</button>
            </div>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}
