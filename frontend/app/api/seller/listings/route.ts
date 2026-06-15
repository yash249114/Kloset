import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, description, price_1day, price_3day, price_7day, security_deposit, images, sizes, occasions, colors, fabric, city, state, delivery_available, delivery_fee } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const id = 'out_' + Math.random().toString(36).substr(2, 9);

    // Mock listing creation matching the Outfit type
    const mockListing = {
      id,
      seller_id: 'seller_' + Math.random().toString(36).substr(2, 9),
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      description: description || null,
      ai_description: null,
      category: category || 'other',
      occasions: occasions || [],
      colors: colors || [],
      fabric: fabric || null,
      sizes: sizes || ['M', 'L', 'XL'],
      accessories_included: [],
      city: city || null,
      state: state || null,
      price_1day: price_1day || null,
      price_3day: price_3day || null,
      price_7day: price_7day || null,
      security_deposit: security_deposit || null,
      delivery_available: delivery_available ?? false,
      delivery_fee: delivery_fee || 0,
      status: 'pending_approval',
      rating_avg: 0,
      rating_count: 0,
      view_count: 0,
      wishlist_count: 0,
      images: images || [],
      is_wishlisted: false,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: mockListing,
        message: 'Listing created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create listing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
