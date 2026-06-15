function HowItWorks() {
  try {
    const steps = [
      {
        title: 'Choose Your Outfit',
        description: 'Browse designer pieces for every occasion',
        icon: 'icon-sparkles',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80'
      },
      {
        title: 'Select Rental Dates',
        description: 'Pick your dates and secure payment',
        icon: 'icon-calendar-check',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80'
      },
      {
        title: 'Wear & Return',
        description: 'Delivered, worn, returned hassle-free',
        icon: 'icon-package-check',
        image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80'
      }
    ];
    
    return (
      <section id="how-it-works" className="py-20 bg-[var(--accent-blush)]" data-name="how-it-works" data-file="components/HowItWorks.js">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl text-center mb-4 text-[var(--text-primary)]">How Kloset Works</h2>
          <p className="text-center text-[var(--text-secondary)] text-lg mb-20">Luxury fashion made simple</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 mx-auto rounded-full bg-white flex items-center justify-center mb-6 shadow-lg">
                    <div className={`${step.icon} text-4xl text-[var(--primary-color)]`}></div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-[var(--border-color)]">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--primary-color)]"></div>
                    </div>
                  )}
                </div>
                <h3 className="text-2xl mb-3 text-[var(--text-primary)]" style={{fontFamily: "'Playfair Display', serif"}}>{step.title}</h3>
                <p className="text-[var(--text-secondary)] text-lg">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('HowItWorks component error:', error);
    return null;
  }
}
