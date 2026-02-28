import type { Movie } from '../data/movies';

export interface OphimResponse {
  status: string;
  data: {
    items: OphimItem[];
    APP_DOMAIN_CDN_IMAGE: string;
  };
}

export interface OphimItem {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  type: string;
  thumb_url: string;
  poster_url: string;
  year: number;
  time: string;
  episode_current: string;
  quality: string;
  lang: string;
  category: { name: string; slug: string }[];
  country: { name: string; slug: string }[];
  tmdb?: { vote_average?: number };
}

export function mapOphimToMovie(item: OphimItem, cdnDomain: string): Movie {
  const allowedQualities = ['HD', '4K', 'FHD', 'CAM'] as const;
  type QualityType = typeof allowedQualities[number];
  const parsedQuality = allowedQualities.includes(item.quality as QualityType) 
    ? (item.quality as QualityType) 
    : 'HD';

  let parsedType: 'single' | 'series' = 'single';
  if (item.type === 'series' || item.type === 'hoathinh') {
    parsedType = 'series';
  }

  return {
    id: item._id,
    name: item.name,
    origin_name: item.origin_name,
    slug: item.slug,
    thumb_url: item.thumb_url.startsWith('http') ? item.thumb_url : `${cdnDomain}/uploads/movies/${item.thumb_url}`,
    poster_url: item.poster_url?.startsWith('http') ? item.poster_url : `${cdnDomain}/uploads/movies/${item.poster_url || item.thumb_url}`,
    category: item.category?.map(c => ({ id: c.slug, name: c.name, slug: c.slug })) || [],
    country: item.country?.map(c => ({ id: c.slug, name: c.name, slug: c.slug })) || [],
    year: item.year || new Date().getFullYear(),
    type: parsedType,
    quality: parsedQuality,
    lang: item.lang || 'Vietsub',
    sub: item.lang || 'Vietsub',
    time: item.time || 'N/A',
    episode_current: item.episode_current || 'Full',
    episode_total: '??',
    tmdb: {
      type: 'movie',
      id: '',
      vote_average: item.tmdb?.vote_average || 0,
      vote_count: 0
    },
    imdb: { id: '' },
    description: '',
  };
}

export async function getHomeMovies(): Promise<Movie[]> {
  try {
    const res = await fetch('https://ophim1.com/v1/api/home', {
      next: { revalidate: 3600 }
    });
    const json: OphimResponse = await res.json();
    if (!json.data?.items) return [];
    
    return json.data.items.map(item => mapOphimToMovie(item, json.data.APP_DOMAIN_CDN_IMAGE));
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
}

export async function getMoviesByList(listType: string): Promise<Movie[]> {
  try {
    const res = await fetch(`https://ophim1.com/v1/api/danh-sach/${listType}`, {
      next: { revalidate: 3600 }
    });
    const json: OphimResponse = await res.json();
    if (!json.data?.items) return [];
    
    return json.data.items.map(item => mapOphimToMovie(item, json.data.APP_DOMAIN_CDN_IMAGE));
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
}

export interface OphimDetailResponse {
  status: boolean;
  msg: string;
  movie: OphimMovieDetail;
  episodes: OphimEpisodeServer[];
}

export interface OphimMovieDetail {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  content: string;
  type: string;
  status: string;
  thumb_url: string;
  poster_url: string;
  time: string;
  episode_current: string;
  episode_total: string;
  quality: string;
  lang: string;
  year: number;
  view?: number;
  actor?: string[];
  director?: string[];
  trailer_url?: string;
  category: { id: string; name: string; slug: string }[];
  country: { id: string; name: string; slug: string }[];
  tmdb?: { vote_average?: number; vote_count?: number };
}

export interface OphimEpisodeServer {
  server_name: string;
  server_data: {
    name: string;
    slug: string;
    filename: string;
    link_embed: string;
    link_m3u8: string;
  }[];
}

export async function getMovieDetail(slug: string): Promise<Movie | null> {
  try {
    const res = await fetch(`https://ophim1.com/v1/api/phim/${slug}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    
    // The response structure from /v1/api/phim usually omits the status/data wrapper, 
    // or sometimes wraps it in `data`. On Ophim v1 API, it returns { status: "success", data: { item: {...} } } normally.
    const json = await res.json();
    
    // Check if it follows data.item format
    if (json.data && json.data.item) {
      const item = json.data.item as OphimMovieDetail;
      const cdnDomain = json.data?.APP_DOMAIN_CDN_IMAGE || 
        (typeof json.data?.seoOnPage?.og_image?.[0] === 'string' 
          ? json.data.seoOnPage.og_image[0].split('/uploads')[0] 
          : 'https://img.ophim.live');
      
      const allowedQualities = ['HD', '4K', 'FHD', 'CAM'] as const;
      type QualityType = typeof allowedQualities[number];
      const parsedQuality = allowedQualities.includes(item.quality as QualityType) 
        ? (item.quality as QualityType) 
        : 'HD';

      const movie: Movie = {
        id: item._id,
        name: item.name,
        origin_name: item.origin_name,
        slug: item.slug,
        thumb_url: item.thumb_url.startsWith('http') ? item.thumb_url : `${cdnDomain}/uploads/movies/${item.thumb_url}`,
        poster_url: item.poster_url?.startsWith('http') ? item.poster_url : `${cdnDomain}/uploads/movies/${item.poster_url || item.thumb_url}`,
        category: item.category?.map((c: { slug: string; name: string; id?: string }) => ({ id: c.slug, ...c })) || [],
        country: item.country?.map((c: { slug: string; name: string; id?: string }) => ({ id: c.slug, ...c })) || [],
        year: item.year,
        type: item.type as 'single' | 'series',
        quality: parsedQuality,
        lang: item.lang || 'Vietsub',
        sub: item.lang || 'Vietsub',
        time: item.time || 'N/A',
        episode_current: item.episode_current || 'Full',
        episode_total: item.episode_total || '1',
        view: item.view || 0,
        actor: item.actor || [],
        director: item.director || [],
        trailer_url: item.trailer_url || '',
        tmdb: {
          type: 'movie',
          id: '',
          vote_average: item.tmdb?.vote_average || 0,
          vote_count: 0
        },
        imdb: { id: '' },
        description: item.content || '',
        episodes: json.data.item.episodes || [],
        breadCrumb: json.data.breadCrumb || []
      };
      return movie;
    }
    
    // Alternative structure: root object has movie and episodes 
    // (Common in older Ophim APIs like phimapi.com)
    if (json.movie) {
      const m = json.movie as OphimMovieDetail;
      
      const allowedQualities = ['HD', '4K', 'FHD', 'CAM'] as const;
      type QualityType = typeof allowedQualities[number];
      const parsedQuality = allowedQualities.includes(m.quality as QualityType) 
        ? (m.quality as QualityType) 
        : 'HD';

      const mappedMovie: Movie = {
        id: m._id,
        name: m.name,
        origin_name: m.origin_name,
        slug: m.slug,
        thumb_url: m.thumb_url,
        poster_url: m.poster_url,
        category: m.category?.map((c: { slug: string; name: string; id?: string }) => ({ id: c.slug, ...c })) || [],
        country: m.country?.map((c: { slug: string; name: string; id?: string }) => ({ id: c.slug, ...c })) || [],
        year: m.year,
        type: m.type as 'single' | 'series',
        quality: parsedQuality,
        lang: m.lang || 'Vietsub',
        sub: m.lang || 'Vietsub',
        time: m.time || 'N/A',
        episode_current: m.episode_current || 'Full',
        episode_total: m.episode_total || '1',
        view: m.view || 0,
        actor: m.actor || [],
        director: m.director || [],
        trailer_url: m.trailer_url || '',
        tmdb: {
          type: 'movie',
          id: '',
          vote_average: m.tmdb?.vote_average || 0,
          vote_count: 0
        },
        imdb: { id: '' },
        description: m.content || '',
        episodes: json.episodes || []
      };
      return mappedMovie;
    }
    
    return null;
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

