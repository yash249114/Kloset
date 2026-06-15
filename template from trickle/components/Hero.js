function Hero() {
  try {
    const [searchQuery, setSearchQuery] = React.useState('');
    
    return (
      <section className="relative min-h-[85vh] flex items-center" data-name="hero" data-file="components/Hero.js">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--secondary-color)] via-white to-[var(--accent-blush)]"></div>
        
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&q=80" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl mb-6 text-[var(--text-primary)] leading-tight">
              Rent Designer Fashion<br />For A Fraction Of The Cost
            </h1>
            
            <p className="text-xl sm:text-2xl text-[var(--text-secondary)] mb-12 font-light">
              Your dream outfit. Your special day. Zero commitment.
            </p>
            
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search lehengas, sarees, gowns..."
                  className="w-full px-8 py-5 text-lg bg-white border-2 border-[var(--border-color)] focus:border-[var(--primary-color)] focus:outline-none transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 px-8 py-3 bg-[var(--primary-color)] text-white hover:opacity-90 transition-opacity">
                  Search
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3 text-sm text-[var(--text-secondary)] mb-16">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--primary-color)] bg-opacity-10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-[var(--primary-color)]">1</span>
                </div>
                <span>Browse</span>
              </div>
              <div className="icon-arrow-right text-[var(--primary-color)]"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--primary-color)] bg-opacity-10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-[var(--primary-color)]">2</span>
                </div>
                <span>Select Dates</span>
              </div>
              <div className="icon-arrow-right text-[var(--primary-color)]"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--primary-color)] bg-opacity-10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-[var(--primary-color)]">3</span>
                </div>
                <span>Wear & Return</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Hero component error:', error);
    return null;
  }
}
