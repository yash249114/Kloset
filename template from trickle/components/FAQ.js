function FAQ() {
  try {
    const [openIndex, setOpenIndex] = React.useState(null);
    
    const faqs = [
      {
        question: 'How long can I rent an outfit?',
        answer: 'You can rent outfits for 3, 5, or 7 days. We offer flexible rental periods to suit your needs.'
      },
      {
        question: 'What if the outfit doesn\'t fit?',
        answer: 'We provide detailed size charts and measurements. If there are any issues, contact us immediately and we\'ll help with an exchange.'
      },
      {
        question: 'How do I return the outfit?',
        answer: 'Simply pack the outfit in the original packaging and schedule a pickup through our app. Return pickup is free!'
      },
      {
        question: 'Are the outfits cleaned before rental?',
        answer: 'Yes! Every outfit is professionally cleaned and quality-checked before being sent to you.'
      },
      {
        question: 'Can I buy the outfit after renting?',
        answer: 'Many sellers offer a buy option. Contact the seller directly or check the product page for purchase availability.'
      }
    ];
    
    return (
      <section className="py-20 bg-white" data-name="faq" data-file="components/FAQ.js">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl text-center mb-4 text-[var(--text-primary)]">Questions?</h2>
          <p className="text-center text-[var(--text-secondary)] text-lg mb-16">Everything you need to know</p>
          
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-[var(--secondary-color)] overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-[var(--accent-blush)] transition-colors"
                >
                  <span className="font-medium text-[var(--text-primary)]">{faq.question}</span>
                  <div className={`icon-chevron-down text-xl text-[var(--primary-color)] transition-transform ${openIndex === index ? 'rotate-180' : ''}`}></div>
                </button>
                {openIndex === index && (
                  <div className="px-8 pb-6 text-[var(--text-secondary)] leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('FAQ component error:', error);
    return null;
  }
}