import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

interface JsonLdProduct {
  '@type'?: string;
  name?: string;
  image?: string;
  offers?: {
    price?: string | number;
  } | Array<{
    price?: string | number;
  }>;
  aggregateRating?: {
    ratingValue?: number;
  };
}

interface ShopeeNextData {
  name?: string;
  image?: string;
  images?: string[];
  price?: number;
  price_max?: number;
  price_min?: number;
  item_rating?: {
    rating_star?: number;
  };
  sold?: number;
  historical_sold?: number;
  stock?: number;
}

interface ShopeeInitialState {
  item?: {
    item?: ShopeeNextData;
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productUrl = searchParams.get('url');

  console.log('🔍 API Called with URL:', productUrl);

  if (!productUrl) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  if (!productUrl.includes('shopee')) {
    return NextResponse.json({ error: 'Invalid Shopee URL' }, { status: 400 });
  }

  try {
    console.log('📡 Fetching from Shopee (following redirects)...');
    
    const response = await fetch(productUrl, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    });

    const finalUrl = response.url; 
    console.log('🔗 Final URL after redirect:', finalUrl);
    console.log('📊 Response Status:', response.status);

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.statusText}`);
    }

    const html = await response.text();
    console.log('📄 HTML Length:', html.length);
    
    // Check if we got actual content
    if (html.length < 1000) {
      console.log('⚠️ HTML too short, might be blocked');
      throw new Error('Received incomplete HTML from Shopee');
    }

    const $ = cheerio.load(html);

    const getMeta = (propName: string): string | null => {
      return $(`meta[property="${propName}"], meta[name="${propName}"]`).attr('content') || null;
    };

    const getJsonLd = (): JsonLdProduct | null => {
      let data: JsonLdProduct | null = null;
      $('script[type="application/ld+json"]').each((_, el) => {
        try {
          const json = JSON.parse($(el).html() || '{}');
          if (json['@type'] === 'Product' || json['@type'] === 'http://schema.org/Product') {
            data = json;
            console.log('✅ Found JSON-LD data');
            return false;
          }
        } catch {
          // Continue
        }
      });
      return data;
    };

    const getNextData = (): ShopeeNextData | null => {
      try {
        const scriptContent = $('script#__NEXT_DATA__').html();
        if (scriptContent) {
          const data = JSON.parse(scriptContent);
          const item = data?.props?.pageProps?.initialState?.item?.item;
          if (item) {
            console.log('✅ Found __NEXT_DATA__');
            return item;
          }
        }
      } catch (error) {
        console.error('Failed to parse __NEXT_DATA__:', error);
      }
      return null;
    };

    const getInitialState = (): ShopeeNextData | null => {
      try {
        const scripts = $('script:not([src])').toArray();
        for (const script of scripts) {
          const content = $(script).html() || '';
          if (content.includes('window.__INITIAL_STATE__')) {
            // Use non-greedy match and remove 's' flag (dotAll)
            const match = content.match(/window\.__INITIAL_STATE__\s*=\s*(\{[\s\S]+?\});/);
            if (match) {
              const state: ShopeeInitialState = JSON.parse(match[1]);
              console.log('✅ Found __INITIAL_STATE__');
              return state?.item?.item || null;
            }
          }
        }
      } catch (error) {
        console.error('Failed to parse __INITIAL_STATE__:', error);
      }
      return null;
    };

    const nextData = getNextData();
    const initialState = getInitialState();
    const jsonLd = getJsonLd();
    const ogTitle = getMeta('og:title');
    const ogImage = getMeta('og:image');
    const ogPrice = getMeta('product:price:amount') || getMeta('og:price:amount');

    console.log('🔎 Extraction Results:');
    console.log('  - __NEXT_DATA__:', nextData ? '✓' : '✗');
    console.log('  - __INITIAL_STATE__:', initialState ? '✓' : '✗');
    console.log('  - JSON-LD:', jsonLd ? '✓' : '✗');
    console.log('  - OG Title:', ogTitle || '✗');
    console.log('  - OG Image:', ogImage || '✗');
    console.log('  - OG Price:', ogPrice || '✗');

    let title = 'Unknown Product';
    let image = '';
    let price = 'Check Price';
    let rating = 0;
    let sold = 0;
    let stock = 0;

    const productData = nextData || initialState;

    if (productData) {
      console.log('📦 Using extracted product data');
      title = productData.name || title;
      image = productData.image || productData.images?.[0] || image;
      
      // Handle price
      if (productData.price) {
        const priceValue = productData.price / 100000;
        price = `₱${priceValue.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
      } else if (productData.price_min && productData.price_max) {
        const minPrice = productData.price_min / 100000;
        const maxPrice = productData.price_max / 100000;
        if (minPrice === maxPrice) {
          price = `₱${minPrice.toLocaleString('en-PH')}`;
        } else {
          price = `₱${minPrice.toLocaleString('en-PH')} - ₱${maxPrice.toLocaleString('en-PH')}`;
        }
      }
      
      rating = productData.item_rating?.rating_star || 0;
      sold = productData.sold || productData.historical_sold || 0;
      stock = productData.stock || 0;
    }
    else if (jsonLd) {
      console.log('📦 Using JSON-LD data');
      title = jsonLd.name || title;
      image = jsonLd.image || image;
      
      if (jsonLd.offers) {
        const offer = Array.isArray(jsonLd.offers) ? jsonLd.offers[0] : jsonLd.offers;
        if (offer?.price) {
          price = `₱${parseFloat(String(offer.price)).toLocaleString('en-PH')}`;
        }
      }
      
      if (jsonLd.aggregateRating) {
        rating = jsonLd.aggregateRating.ratingValue || 0;
      }
    }
    else if (ogTitle) {
      console.log('📦 Using Open Graph meta tags');
      title = ogTitle;
      image = ogImage || image;
      if (ogPrice) {
        price = `₱${parseFloat(ogPrice).toLocaleString('en-PH')}`;
      }
    }

    // Clean up title
    title = title
      .replace(/ \| Shopee Philippines/gi, '')
      .replace(/ \| Shopee PH/gi, '')
      .replace(/ - Shopee Philippines/gi, '')
      .trim()
      .substring(0, 100);

    // Handle image URL
    if (image && !image.startsWith('http')) {
      // Shopee image hash format
      image = `https://cf.shopee.ph/file/${image}`;
    }

    if (!image) {
      image = 'https://placehold.co/300x300?text=No+Image';
    }

    // Extract product ID from URL
    const urlParts = finalUrl.split('.');
    const productId = urlParts[urlParts.length - 1]?.split('?')[0] || 'unknown';

    const result = {
      id: Date.now(),
      name: title,
      price: price,
      image: image,
      url: finalUrl,
      tag: 'Affiliate',
      rating: Math.round(rating * 10) / 10,
      sold: sold,
      stock: stock,
      productId: productId,
      fetchedAt: new Date().toISOString()
    };

    console.log('✅ Final Result:', JSON.stringify(result, null, 2));

    // Warning if data is still default
    if (title === 'Unknown Product') {
      console.log('⚠️ WARNING: Could not extract product data from HTML');
      console.log('💡 Shopee might be blocking scraping or page structure changed');
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Scraping error:', error);
    return NextResponse.json({ 
      error: 'Failed to extract product details', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}