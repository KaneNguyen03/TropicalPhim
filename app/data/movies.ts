export interface Movie {
  id: string;
  name: string;
  origin_name: string;
  slug: string;
  thumb_url: string;
  poster_url: string;
  category: {
    id: string;
    name: string;
    slug: string;
  }[];
  country: {
    id: string;
    name: string;
    slug: string;
  }[];
  year: number;
  type: 'single' | 'series';
  quality: 'HD' | '4K' | 'FHD' | 'CAM';
  lang: string;
  sub: string;
  time: string;
  episode_current: string;
  episode_total: string;
  tmdb: {
    type: string;
    id: string;
    vote_average: number;
    vote_count: number;
  };
  imdb: {
    id: string;
  };
  description: string;
  episodes?: {
    server_name: string;
    server_data: {
      name: string;
      slug: string;
      filename: string;
      link_embed: string;
      link_m3u8?: string;
    }[];
  }[];
  trailer_url?: string;
  view?: number;
  actor?: string[];
  director?: string[];
  breadCrumb?: {
    name: string;
    slug: string;
    position: number;
    isCurrent?: boolean;
  }[];
}

export const featuredMovies: Movie[] = [
  {
    id: '1',
    name: 'Rừng Nhiệt Đới Mê Hoặc',
    origin_name: 'Tropical Enchantment',
    slug: 'rung-nhiet-doi-me-hoac',
    thumb_url: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1200&h=675&fit=crop',
    poster_url: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=500&h=750&fit=crop',
    category: [
      { id: '1', name: 'Hành Động', slug: 'hanh-dong' },
      { id: '2', name: 'Phiêu Lưu', slug: 'phieu-luu' }
    ],
    country: [{ id: '1', name: 'Việt Nam', slug: 'viet-nam' }],
    year: 2025,
    type: 'single',
    quality: '4K',
    lang: 'Vietsub',
    sub: 'Thuyết minh',
    time: '138 phút',
    episode_current: 'Full',
    episode_total: '1',
    tmdb: {
      type: 'movie',
      id: '12345',
      vote_average: 8.5,
      vote_count: 2345
    },
    imdb: {
      id: 'tt1234567'
    },
    description: 'Một hành trình đầy mê hoặc qua rừng nhiệt đới bí ẩn, nơi thiên nhiên hoang dã gặp gỡ công nghệ tiên tiến. Câu chuyện kể về một đội thám hiểm khám phá những bí mật được chôn giấu sâu trong lòng rừng Amazon.'
  },
  {
    id: '2',
    name: 'Hoàng Hôn Nhiệt Đới',
    origin_name: 'Tropical Sunset',
    slug: 'hoang-hon-nhiet-doi',
    thumb_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=675&fit=crop',
    poster_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=750&fit=crop',
    category: [
      { id: '3', name: 'Lãng Mạn', slug: 'lang-man' },
      { id: '4', name: 'Chính Kịch', slug: 'chinh-kich' }
    ],
    country: [{ id: '2', name: 'Mỹ', slug: 'my' }],
    year: 2026,
    type: 'single',
    quality: '4K',
    lang: 'Vietsub',
    sub: 'Phụ đề',
    time: '122 phút',
    episode_current: 'Full',
    episode_total: '1',
    tmdb: {
      type: 'movie',
      id: '12346',
      vote_average: 9.1,
      vote_count: 5678
    },
    imdb: {
      id: 'tt1234568'
    },
    description: 'Một câu chuyện tình yêu đầy cảm động diễn ra trên bãi biển nhiệt đới tuyệt đẹp, nơi hai tâm hồn cô đơn tìm thấy nhau trong ánh hoàng hôn rực rỡ.'
  },
  {
    id: '3',
    name: 'Bão Nhiệt Đới',
    origin_name: 'Tropical Storm',
    slug: 'bao-nhiet-doi',
    thumb_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=675&fit=crop',
    poster_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&h=750&fit=crop',
    category: [
      { id: '5', name: 'Thảm Họa', slug: 'tham-hoa' },
      { id: '1', name: 'Hành Động', slug: 'hanh-dong' }
    ],
    country: [{ id: '3', name: 'Nhật Bản', slug: 'nhat-ban' }],
    year: 2025,
    type: 'single',
    quality: 'HD',
    lang: 'Vietsub',
    sub: 'Thuyết minh',
    time: '145 phút',
    episode_current: 'Full',
    episode_total: '1',
    tmdb: {
      type: 'movie',
      id: '12347',
      vote_average: 7.8,
      vote_count: 3421
    },
    imdb: {
      id: 'tt1234569'
    },
    description: 'Khi một cơn bão nhiệt đới mạnh nhất trong lịch sử đổ bộ vào đảo quốc, người dân phải đối mặt với thử thách sinh tồn gay gắt nhất.'
  }
];

export const newReleases: Movie[] = [
  {
    id: '4',
    name: 'Hòn Đảo Bí Ẩn',
    origin_name: 'Mystery Island',
    slug: 'hon-dao-bi-an',
    thumb_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=450&fit=crop',
    poster_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=750&fit=crop',
    category: [
      { id: '6', name: 'Bí Ẩn', slug: 'bi-an' },
      { id: '7', name: 'Kinh Dị', slug: 'kinh-di' }
    ],
    country: [{ id: '4', name: 'Hàn Quốc', slug: 'han-quoc' }],
    year: 2026,
    type: 'series',
    quality: '4K',
    lang: 'Vietsub',
    sub: 'Phụ đề',
    time: '45 phút/tập',
    episode_current: '8',
    episode_total: '16',
    tmdb: {
      type: 'tv',
      id: '12348',
      vote_average: 8.9,
      vote_count: 7890
    },
    imdb: {
      id: 'tt1234570'
    },
    description: 'Một nhóm khách du lịch bị mắc kẹt trên một hòn đảo hoang, nơi những sự kiện kỳ lạ liên tục xảy ra.',
    episodes: [
      {
        server_name: 'Vietsub #1',
        server_data: [
          { name: 'Tập 1', slug: 'tap-1', filename: 'episode-1', link_embed: 'https://example.com/embed/1' },
          { name: 'Tập 2', slug: 'tap-2', filename: 'episode-2', link_embed: 'https://example.com/embed/2' },
          { name: 'Tập 3', slug: 'tap-3', filename: 'episode-3', link_embed: 'https://example.com/embed/3' },
          { name: 'Tập 4', slug: 'tap-4', filename: 'episode-4', link_embed: 'https://example.com/embed/4' },
          { name: 'Tập 5', slug: 'tap-5', filename: 'episode-5', link_embed: 'https://example.com/embed/5' },
          { name: 'Tập 6', slug: 'tap-6', filename: 'episode-6', link_embed: 'https://example.com/embed/6' },
          { name: 'Tập 7', slug: 'tap-7', filename: 'episode-7', link_embed: 'https://example.com/embed/7' },
          { name: 'Tập 8', slug: 'tap-8', filename: 'episode-8', link_embed: 'https://example.com/embed/8' }
        ]
      }
    ]
  },
  {
    id: '5',
    name: 'Cuộc Chiến Xanh',
    origin_name: 'Green War',
    slug: 'cuoc-chien-xanh',
    thumb_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=450&fit=crop',
    poster_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=750&fit=crop',
    category: [
      { id: '1', name: 'Hành Động', slug: 'hanh-dong' },
      { id: '8', name: 'Khoa Học Viễn Tưởng', slug: 'khoa-hoc-vien-tuong' }
    ],
    country: [{ id: '2', name: 'Mỹ', slug: 'my' }],
    year: 2026,
    type: 'single',
    quality: '4K',
    lang: 'Vietsub',
    sub: 'Thuyết minh',
    time: '155 phút',
    episode_current: 'Full',
    episode_total: '1',
    tmdb: {
      type: 'movie',
      id: '12349',
      vote_average: 8.3,
      vote_count: 4567
    },
    imdb: {
      id: 'tt1234571'
    },
    description: 'Trong tương lai gần, thiên nhiên nổi dậy chống lại sự tàn phá của con người, tạo nên một cuộc chiến sinh tồn chưa từng có.'
  },
  {
    id: '6',
    name: 'Ánh Sáng Rừng Sâu',
    origin_name: 'Forest Light',
    slug: 'anh-sang-rung-sau',
    thumb_url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&h=450&fit=crop',
    poster_url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=500&h=750&fit=crop',
    category: [
      { id: '9', name: 'Gia Đình', slug: 'gia-dinh' },
      { id: '2', name: 'Phiêu Lưu', slug: 'phieu-luu' }
    ],
    country: [{ id: '5', name: 'Pháp', slug: 'phap' }],
    year: 2025,
    type: 'single',
    quality: 'FHD',
    lang: 'Vietsub',
    sub: 'Phụ đề',
    time: '98 phút',
    episode_current: 'Full',
    episode_total: '1',
    tmdb: {
      type: 'movie',
      id: '12350',
      vote_average: 7.6,
      vote_count: 2134
    },
    imdb: {
      id: 'tt1234572'
    },
    description: 'Một cô bé lạc vào rừng sâu và khám phá ra một thế giới kỳ diệu đầy ánh sáng và sinh vật huyền bí.'
  },
  {
    id: '7',
    name: 'Sóng Biển Dữ',
    origin_name: 'Wild Waves',
    slug: 'song-bien-du',
    thumb_url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=450&fit=crop',
    poster_url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=500&h=750&fit=crop',
    category: [
      { id: '5', name: 'Thảm Họa', slug: 'tham-hoa' },
      { id: '4', name: 'Chính Kịch', slug: 'chinh-kich' }
    ],
    country: [{ id: '6', name: 'Úc', slug: 'uc' }],
    year: 2026,
    type: 'single',
    quality: '4K',
    lang: 'Vietsub',
    sub: 'Thuyết minh',
    time: '132 phút',
    episode_current: 'Full',
    episode_total: '1',
    tmdb: {
      type: 'movie',
      id: '12351',
      vote_average: 8.0,
      vote_count: 3890
    },
    imdb: {
      id: 'tt1234573'
    },
    description: 'Một gia đình phải vượt qua sóng thần khổng lồ để tìm đường về nhà trong cuộc chiến sinh tồn đầy cảm động.'
  },
  {
    id: '8',
    name: 'Vua Bầu Trời',
    origin_name: 'Sky King',
    slug: 'vua-bau-troi',
    thumb_url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=450&fit=crop',
    poster_url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=750&fit=crop',
    category: [
      { id: '1', name: 'Hành Động', slug: 'hanh-dong' },
      { id: '2', name: 'Phiêu Lưu', slug: 'phieu-luu' }
    ],
    country: [{ id: '7', name: 'Thái Lan', slug: 'thai-lan' }],
    year: 2025,
    type: 'series',
    quality: 'HD',
    lang: 'Vietsub',
    sub: 'Phụ đề',
    time: '50 phút/tập',
    episode_current: '6',
    episode_total: '12',
    tmdb: {
      type: 'tv',
      id: '12352',
      vote_average: 7.9,
      vote_count: 2456
    },
    imdb: {
      id: 'tt1234574'
    },
    description: 'Cuộc phiêu lưu của một phi công trẻ tuổi chinh phục bầu trời và trở thành huyền thoại.',
    episodes: [
      {
        server_name: 'Vietsub #1',
        server_data: [
          { name: 'Tập 1', slug: 'tap-1', filename: 'episode-1', link_embed: 'https://example.com/embed/1' },
          { name: 'Tập 2', slug: 'tap-2', filename: 'episode-2', link_embed: 'https://example.com/embed/2' },
          { name: 'Tập 3', slug: 'tap-3', filename: 'episode-3', link_embed: 'https://example.com/embed/3' },
          { name: 'Tập 4', slug: 'tap-4', filename: 'episode-4', link_embed: 'https://example.com/embed/4' },
          { name: 'Tập 5', slug: 'tap-5', filename: 'episode-5', link_embed: 'https://example.com/embed/5' },
          { name: 'Tập 6', slug: 'tap-6', filename: 'episode-6', link_embed: 'https://example.com/embed/6' }
        ]
      }
    ]
  },
  {
    id: '9',
    name: 'Thành Phố Xanh',
    origin_name: 'Green City',
    slug: 'thanh-pho-xanh',
    thumb_url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=450&fit=crop',
    poster_url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500&h=750&fit=crop',
    category: [
      { id: '8', name: 'Khoa Học Viễn Tưởng', slug: 'khoa-hoc-vien-tuong' },
      { id: '4', name: 'Chính Kịch', slug: 'chinh-kich' }
    ],
    country: [{ id: '8', name: 'Singapore', slug: 'singapore' }],
    year: 2026,
    type: 'single',
    quality: '4K',
    lang: 'Vietsub',
    sub: 'Thuyết minh',
    time: '118 phút',
    episode_current: 'Full',
    episode_total: '1',
    tmdb: {
      type: 'movie',
      id: '12353',
      vote_average: 8.7,
      vote_count: 5234
    },
    imdb: {
      id: 'tt1234575'
    },
    description: 'Một thành phố tương lai nơi con người và thiên nhiên hòa quyện hoàn hảo, nhưng bí mật đen tối ẩn giấu đằng sau.'
  },
  {
    id: '10',
    name: 'Bóng Đêm Nhiệt Đới',
    origin_name: 'Tropical Night',
    slug: 'bong-dem-nhiet-doi',
    thumb_url: 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?w=800&h=450&fit=crop',
    poster_url: 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?w=500&h=750&fit=crop',
    category: [
      { id: '7', name: 'Kinh Dị', slug: 'kinh-di' },
      { id: '10', name: 'Tâm Lý', slug: 'tam-ly' }
    ],
    country: [{ id: '9', name: 'Indonesia', slug: 'indonesia' }],
    year: 2025,
    type: 'single',
    quality: 'HD',
    lang: 'Vietsub',
    sub: 'Phụ đề',
    time: '105 phút',
    episode_current: 'Full',
    episode_total: '1',
    tmdb: {
      type: 'movie',
      id: '12354',
      vote_average: 7.4,
      vote_count: 1890
    },
    imdb: {
      id: 'tt1234576'
    },
    description: 'Những bí ẩn kinh hoàng hiện ra trong đêm tối ở một ngôi làng nhiệt đới hẻo lánh.'
  }
];

export const popularSeries: Movie[] = [
  {
    id: '11',
    name: 'Đế Chế Xanh',
    origin_name: 'Green Empire',
    slug: 'de-che-xanh',
    thumb_url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&h=450&fit=crop',
    poster_url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=500&h=750&fit=crop',
    category: [
      { id: '4', name: 'Chính Kịch', slug: 'chinh-kich' },
      { id: '11', name: 'Tội Phạm', slug: 'toi-pham' }
    ],
    country: [{ id: '10', name: 'Brazil', slug: 'brazil' }],
    year: 2025,
    type: 'series',
    quality: '4K',
    lang: 'Vietsub',
    sub: 'Thuyết minh',
    time: '60 phút/tập',
    episode_current: '10',
    episode_total: '20',
    tmdb: {
      type: 'tv',
      id: '12355',
      vote_average: 9.3,
      vote_count: 12345
    },
    imdb: {
      id: 'tt1234577'
    },
    description: 'Câu chuyện về một gia tộc quyền lực xây dựng đế chế kinh doanh từ rừng Amazon.',
    episodes: [
      {
        server_name: 'Vietsub #1',
        server_data: [...Array(10)].map((_, i) => ({
          name: `Tập ${i + 1}`,
          slug: `tap-${i + 1}`,
          filename: `episode-${i + 1}`,
          link_embed: `https://example.com/embed/${i + 1}`
        }))
      }
    ]
  },
  {
    id: '12',
    name: 'Nhiệm Vụ Xích Đạo',
    origin_name: 'Equator Mission',
    slug: 'nhiem-vu-xich-dao',
    thumb_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop',
    poster_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=750&fit=crop',
    category: [
      { id: '1', name: 'Hành Động', slug: 'hanh-dong' },
      { id: '12', name: 'Gián Điệp', slug: 'gian-diep' }
    ],
    country: [{ id: '2', name: 'Mỹ', slug: 'my' }],
    year: 2026,
    type: 'series',
    quality: '4K',
    lang: 'Vietsub',
    sub: 'Phụ đề',
    time: '45 phút/tập',
    episode_current: '12',
    episode_total: '12',
    tmdb: {
      type: 'tv',
      id: '12356',
      vote_average: 8.8,
      vote_count: 9876
    },
    imdb: {
      id: 'tt1234578'
    },
    description: 'Một nhóm điệp viên thực hiện nhiệm vụ tối mật tại các quốc gia xích đạo.',
    episodes: [
      {
        server_name: 'Vietsub #1',
        server_data: [...Array(12)].map((_, i) => ({
          name: `Tập ${i + 1}`,
          slug: `tap-${i + 1}`,
          filename: `episode-${i + 1}`,
          link_embed: `https://example.com/embed/${i + 1}`
        }))
      }
    ]
  }
];

export const animated: Movie[] = [
  {
    id: '13',
    name: 'Rồng Nhiệt Đới',
    origin_name: 'Tropical Dragon',
    slug: 'rong-nhiet-doi',
    thumb_url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&h=450&fit=crop',
    poster_url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=500&h=750&fit=crop',
    category: [
      { id: '13', name: 'Hoạt Hình', slug: 'hoat-hinh' },
      { id: '2', name: 'Phiêu Lưu', slug: 'phieu-luu' }
    ],
    country: [{ id: '3', name: 'Nhật Bản', slug: 'nhat-ban' }],
    year: 2025,
    type: 'single',
    quality: '4K',
    lang: 'Vietsub',
    sub: 'Lồng tiếng',
    time: '112 phút',
    episode_current: 'Full',
    episode_total: '1',
    tmdb: {
      type: 'movie',
      id: '12357',
      vote_average: 9.0,
      vote_count: 8765
    },
    imdb: {
      id: 'tt1234579'
    },
    description: 'Cuộc phiêu lưu của một cậu bé và chú rồng nhỏ trong rừng nhiệt đới kỳ diệu.'
  },
  {
    id: '14',
    name: 'Thế Giới Màu Xanh',
    origin_name: 'Green World',
    slug: 'the-gioi-mau-xanh',
    thumb_url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=450&fit=crop',
    poster_url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&h=750&fit=crop',
    category: [
      { id: '13', name: 'Hoạt Hình', slug: 'hoat-hinh' },
      { id: '9', name: 'Gia Đình', slug: 'gia-dinh' }
    ],
    country: [{ id: '2', name: 'Mỹ', slug: 'my' }],
    year: 2026,
    type: 'single',
    quality: '4K',
    lang: 'Vietsub',
    sub: 'Lồng tiếng',
    time: '95 phút',
    episode_current: 'Full',
    episode_total: '1',
    tmdb: {
      type: 'movie',
      id: '12358',
      vote_average: 8.6,
      vote_count: 6543
    },
    imdb: {
      id: 'tt1234580'
    },
    description: 'Một thế giới hoạt hình đầy màu sắc nơi thiên nhiên sống động và kỳ diệu.'
  }
];

export const allMovies = [...featuredMovies, ...newReleases, ...popularSeries, ...animated];

export const categories = [
  { id: '1', name: 'Hành Động', slug: 'hanh-dong' },
  { id: '2', name: 'Phiêu Lưu', slug: 'phieu-luu' },
  { id: '3', name: 'Lãng Mạn', slug: 'lang-man' },
  { id: '4', name: 'Chính Kịch', slug: 'chinh-kich' },
  { id: '5', name: 'Thảm Họa', slug: 'tham-hoa' },
  { id: '6', name: 'Bí Ẩn', slug: 'bi-an' },
  { id: '7', name: 'Kinh Dị', slug: 'kinh-di' },
  { id: '8', name: 'Khoa Học Viễn Tưởng', slug: 'khoa-hoc-vien-tuong' },
  { id: '9', name: 'Gia Đình', slug: 'gia-dinh' },
  { id: '10', name: 'Tâm Lý', slug: 'tam-ly' },
  { id: '11', name: 'Tội Phạm', slug: 'toi-pham' },
  { id: '12', name: 'Gián Điệp', slug: 'gian-diep' },
  { id: '13', name: 'Hoạt Hình', slug: 'hoat-hinh' }
];

export const countries = [
  { id: '1', name: 'Việt Nam', slug: 'viet-nam' },
  { id: '2', name: 'Mỹ', slug: 'my' },
  { id: '3', name: 'Nhật Bản', slug: 'nhat-ban' },
  { id: '4', name: 'Hàn Quốc', slug: 'han-quoc' },
  { id: '5', name: 'Pháp', slug: 'phap' },
  { id: '6', name: 'Úc', slug: 'uc' },
  { id: '7', name: 'Thái Lan', slug: 'thai-lan' },
  { id: '8', name: 'Singapore', slug: 'singapore' },
  { id: '9', name: 'Indonesia', slug: 'indonesia' },
  { id: '10', name: 'Brazil', slug: 'brazil' }
];
