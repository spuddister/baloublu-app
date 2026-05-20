exports.handler = async () => {
  const headers = { 'x-api-key': `${process.env.ETSY_API_KEY}:${process.env.ETSY_SECRET}` };

  const shopRes = await fetch(
    'https://openapi.etsy.com/v3/application/shops/62220981/listings/active?limit=100',
    { headers }
  );
  if (!shopRes.ok) {
    return { statusCode: shopRes.status, body: JSON.stringify({ error: 'Etsy API error' }) };
  }

  const { results: listings } = await shopRes.json();
  if (!listings.length) {
    return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' }, body: '[]' };
  }

  const ids = listings.map(l => l.listing_id).join(',');
  const batchRes = await fetch(
    `https://openapi.etsy.com/v3/application/listings/batch?listing_ids=${ids}&includes=Images`,
    { headers }
  );
  if (!batchRes.ok) {
    return { statusCode: batchRes.status, body: JSON.stringify({ error: 'Etsy API error' }) };
  }

  const { results } = await batchRes.json();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    },
    body: JSON.stringify(results),
  };
};
