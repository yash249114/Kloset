function Reviews() {
  try {
    const reviews = [
      {
        name: 'Priya Sharma',
        role: 'Renter',
        review: 'Amazing experience! Rented a beautiful lehenga for my sister\'s wedding. Quality was perfect and the process was so smooth.',
        rating: 5,
        image: 'https://i.pravatar.cc/150?img=1'
      },
      {
        name: 'Anjali Verma',
        role: 'Seller',
        review: 'Love listing my designer collection here. Great way to earn from outfits sitting in my closet. Customer support is excellent!',
        rating: 5,
        image: 'https://i.pravatar.cc/150?img=5'
      },
      {
        name: 'Neha Kapoor',
        role: 'Renter',
        review: 'Perfect for festival season! Rented multiple outfits and saved so much money. Delivery was on time every single time.',
        rating: 5,
        image: 'https://i.pravatar.cc/150?img=9'
      }
    ];
    
    return (
      <section className="py-20 bg-[var(--secondary-color)]" data-name="reviews" data-file="components/Reviews.js">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl text-center mb-4 text-[var(--text-primary)]">Real Stories</h2>
          <p className="text-center text-[var(--text-secondary)] text-lg mb-16">From our community of renters and sellers</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white p-8">
                <div className="flex mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <div key={i} className="icon-star text-[var(--primary-color)] text-lg"></div>
                  ))}
                </div>
                <p className="text-[var(--text-primary)] text-lg mb-6 leading-relaxed">{review.review}</p>
                <div className="flex items-center">
                  <img src={review.image} alt={review.name} className="w-14 h-14 rounded-full mr-4" />
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)]">{review.name}</h4>
                    <p className="text-sm text-[var(--text-secondary)]">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Reviews component error:', error);
    return null;
  }
}