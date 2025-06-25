interface IGeocodingCoords {
  latitude: number;
  longitude: number;
}

interface IGeocodingAddress {
  city: string;
  countryName: string;
  locality: string;
  postcode: string;
}

export async function getAddress({
  latitude,
  longitude,
}: IGeocodingCoords): Promise<IGeocodingAddress> {
  const res = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`
  );
  if (!res.ok) throw Error("Failed getting address");

  const data = await res.json();
  return {
    city: data.city,
    countryName: data.countryName,
    locality: data.locality,
    postcode: data.postcode,
  };
}
