/**
 * Unsplash photos for creators on mobile until creator media comes from the API.
 * The bundled creator-*.jpg avatars are small pre-cropped circles, unusable as tiles.
 */
export const CREATOR_PHOTOS: Record<string, string> = {
  'tamil-trends': '1669555354650-02227bc6c811',
  'chennai-food-guide': '1774437891793-2013f7b5a04a',
  'madras-street-eats': '1763014456070-6f42f3d8fbb0',
  'marina-lifestyle': '1759840278511-f73a3d62fb9f',
  'vignesh-tech': '1694871420680-88c06ab9cc49',
  'kavitha-herbal': '1756376755233-d3abcd9a5edb',
  'anna-nagar-eats': '1507003211169-0a1dd7228f2d',
};

/** Creators referenced by display name (payments, analytics). */
export const NAMED_CREATOR_PHOTOS: Record<string, string> = {
  'Foodie Tamilan': '1763014456070-6f42f3d8fbb0',
  'Chennai Bites': '1774437891793-2013f7b5a04a',
  'Madras Food Trail': '1759840278511-f73a3d62fb9f',
  'TechVoice India': '1694871420680-88c06ab9cc49',
  MumbaiStyle: '1756376755233-d3abcd9a5edb',
};

export const unsplashPhoto = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces,center&w=${w}&h=${h}&q=70`;

/** Strips the "(Real Name)" suffix used in the shared creator data. */
export const creatorDisplayName = (name: string) => name.replace(/\s*\(.*\)\s*$/, '');

export const creatorInitials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('');
