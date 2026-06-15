function TrendingOutfits() {
  try {
    const outfits = [
      {
        name: 'Royal Blue Lehenga',
        price: '₹2,499',
        rating: 4.8,
        location: 'Mumbai',
        available: true,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80'
      },
      {
        name: 'Elegant Red Saree',
        price: '₹1,799',
        rating: 4.9,
        location: 'Delhi',
        available: true,
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80'
      },
      {
        name: 'Golden Wedding Gown',
        price: '₹3,299',
        rating: 4.7,
        location: 'Bangalore',
        available: true,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80'
      },
      {
        name: 'Pink Anarkali Set',
        price: '₹1,999',
        rating: 4.8,
        location: 'Pune',
        available: false,
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80'
      }
    ];
    
    return (
      <section className="py-20 bg-white" data-name="trending" data-file="components/TrendingOutfits.js">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl text-center mb-4 text-[var(--text-primary)]">Trending This Week</h2>
          <p className="text-center text-[var(--text-secondary)] text-lg mb-16">Outfits our community loves</p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {outfits.map((outfit, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden mb-4 bg-[var(--secondary-color)]">
                  <img src={outfit.image} alt={outfit.name} className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-700" />
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
                    <div className="icon-heart text-lg text-[var(--primary-color)]"></div>
                  </button>
                  {!outfit.available && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs tracking-wide">
                      RENTED
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg mb-2 text-[var(--text-primary)]">{outfit.name}</h3>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl font-semibold text-[var(--primary-color)]">{outfit.price}</span>
                  <div className="flex items-center gap-1">
                    <div className="icon-star text-sm text-[var(--primary-color)]"></div>
                    <span className="text-sm">{outfit.rating}</span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-[var(--text-secondary)]">
                  <div className="icon-map-pin text-xs mr-1"></div>
                  {outfit.location}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('TrendingOutfits component error:', error);
    return null;
  }
}
