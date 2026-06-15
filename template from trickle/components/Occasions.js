function Occasions() {
  try {
    const occasions = [
      { name: 'Wedding', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80' },
      { name: 'Engagement', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80' },
      { name: 'Reception', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80' },
      { name: 'Festival', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80' },
      { name: 'Party', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80' },
      { name: 'Birthday', image: 'https://images.unsplash.com/photo-1591462472019-d2ee1c1c8ff9?w=600&q=80' }
    ];
    
    return (
      <section id="occasions" className="py-20 bg-[var(--secondary-color)]" data-name="occasions" data-file="components/Occasions.js">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl text-center mb-4 text-[var(--text-primary)]">Shop By Occasion</h2>
          <p className="text-center text-[var(--text-secondary)] text-lg mb-16">Find the perfect outfit for your special moment</p>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {occasions.map((occasion, index) => (
              <div key={index} className="group cursor-pointer overflow-hidden bg-white">
                <div className="relative overflow-hidden aspect-[3/4]">
                  <img 
                    src={occasion.image} 
                    alt={occasion.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <h3 className="absolute bottom-6 left-6 text-3xl text-white" style={{fontFamily: "'Playfair Display', serif"}}>{occasion.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Occasions component error:', error);
    return null;
  }
}