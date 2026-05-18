exports.handler = async () => {
  const res = await fetch(
    'https://openapi.etsy.com/v3/application/shops/Baloublu/listings/active?includes=Images&limit=100',
    { headers: { 'x-api-key': process.env.ETSY_API_KEY } }
  );

  if (!res.ok) {
    return { statusCode: res.status, body: JSON.stringify({ error: 'Etsy API error' }) };
  }

  const { results } = await res.json();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    },
    body: JSON.stringify(results),
  };
};
