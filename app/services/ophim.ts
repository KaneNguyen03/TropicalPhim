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

export async function getCategories(): Promise<{ id: string; name: string; slug: string }[]> {
  try {
    const res = await fetch('https://ophim1.com/v1/api/the-loai', { next: { revalidate: 3600 } });
    const json = await res.json();
    return json?.data?.items?.map((cat: { _id: string; name: string; slug: string }) => ({
      id: cat._id, name: cat.name, slug: cat.slug
    })) || [];
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
}

export async function getCountries(): Promise<{ id: string; name: string; slug: string }[]> {
  try {
    const res = await fetch('https://ophim1.com/v1/api/quoc-gia', { next: { revalidate: 3600 } });
    const json = await res.json();
    return json?.data?.items?.map((cat: { _id: string; name: string; slug: string }) => ({
      id: cat._id, name: cat.name, slug: cat.slug
    })) || [];
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
}

export interface SearchPagination {
  currentPage: number;
  totalItems: number;
  totalItemsPerPage: number;
  totalPages: number;
}

export interface SearchResult {
  movies: Movie[];
  pagination: SearchPagination;
  titlePage: string;
}

export async function searchMovies(params: {
  keyword?: string;
  type?: string;
  category?: string;
  country?: string;
  year?: string;
  quality?: string;
  page?: string;
}): Promise<SearchResult> {
  const emptyResult: SearchResult = {
    movies: [],
    pagination: { currentPage: 1, totalItems: 0, totalItemsPerPage: 24, totalPages: 0 },
    titlePage: '',
  };
  
  // List types that use /danh-sach/:slug endpoint
  const listTypes = ['phim-le', 'phim-bo', 'hoat-hinh', 'tv-shows', 'phim-moi-cap-nhat'];

  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    queryParams.append('limit', '24');

    let url: string;

    if (params.keyword && params.keyword.length >= 2) {
      // Full-text search endpoint
      url = 'https://ophim1.com/v1/api/tim-kiem';
      queryParams.append('keyword', params.keyword);
    } else if (params.type && listTypes.includes(params.type)) {
      // List-type browsing: phim-le, phim-bo, hoat-hinh, tv-shows
      url = `https://ophim1.com/v1/api/danh-sach/${params.type}`;
      if (params.country) queryParams.append('country', params.country);
      if (params.year) queryParams.append('year', params.year);
    } else if (params.category) {
      // Genre/category browsing – slug is part of the path
      url = `https://ophim1.com/v1/api/the-loai/${params.category}`;
      if (params.country) queryParams.append('country', params.country);
      if (params.year) queryParams.append('year', params.year);
    } else if (params.country) {
      // Country browsing
      url = `https://ophim1.com/v1/api/quoc-gia/${params.country}`;
      if (params.year) queryParams.append('year', params.year);
    } else if (params.year) {
      // Year browsing
      url = 'https://ophim1.com/v1/api/nam-phat-hanh';
      queryParams.append('year', params.year);
    } else {
      // Default: latest updated movies
      url = 'https://ophim1.com/v1/api/danh-sach/phim-moi-cap-nhat';
    }

    const res = await fetch(`${url}?${queryParams.toString()}`, {
      next: { revalidate: params.keyword ? 30 : 60 },
    });
    if (!res.ok) return emptyResult;
    const json = await res.json();

    if (!json?.data?.items) return emptyResult;

    const cdnDomain: string =
      (json?.data?.APP_DOMAIN_CDN_IMAGE as string | undefined) ?? 'https://img.ophim.live';

    const movies = (json.data.items as OphimItem[]).map((item) =>
      mapOphimToMovie(item, cdnDomain)
    );

    const rawPagination = json?.data?.params?.pagination;
    const pagination: SearchPagination = rawPagination
      ? {
          currentPage: rawPagination.currentPage ?? 1,
          totalItems: rawPagination.totalItems ?? movies.length,
          totalItemsPerPage: rawPagination.totalItemsPerPage ?? 24,
          totalPages: rawPagination.totalPages
            ?? Math.ceil(
                 (rawPagination.totalItems ?? movies.length) /
                 (rawPagination.totalItemsPerPage ?? 24)
               ),
        }
      : {
          currentPage: 1,
          totalItems: movies.length,
          totalItemsPerPage: 24,
          totalPages: 1,
        };

    return {
      movies,
      pagination,
      titlePage: (json?.data?.titlePage as string | undefined) ?? '',
    };
  } catch (error) {
    console.error('API Error:', error);
    return emptyResult;
  }
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

