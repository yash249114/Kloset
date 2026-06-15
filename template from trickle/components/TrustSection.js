function TrustSection() {
  try {
    const features = [
      { icon: 'icon-shield-check', title: 'Verified Sellers', description: 'All sellers are verified and trusted' },
      { icon: 'icon-lock', title: 'Secure Payments', description: 'Your payments are protected' },
      { icon: 'icon-truck', title: 'Insured Delivery', description: 'Safe delivery to your doorstep' },
      { icon: 'icon-rotate-ccw', title: 'Easy Returns', description: 'Hassle-free return process' },
      { icon: 'icon-headphones', title: 'Customer Support', description: '24/7 support for your queries' }
    ];
    
    return (
      <section className="py-16 sm:py-20 bg-[var(--secondary-color)]" data-name="trust" data-file="components/TrustSection.js">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Why Choose Kloset</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4">
                  <div className={`${feature.icon} text-2xl text-[var(--primary-color)]`}></div>
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('TrustSection component error:', error);
    return null;
  }
}