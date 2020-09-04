export interface Imovies {
  page: number;
  total_results: number;
  total_pages: number;
  results: [
    {
      popularity: number;
      vote_count: number;
      video: boolean;
      poster_path: string; //img
      id: number;
      adult: boolean;
      backdrop_path: string; //img
      original_language: string;
      original_title: string;
      genre_ids: number[];
      title: string;
      vote_average: number;
      overview: string;
      release_date: string;
    }
  ];
}

export interface ImovieDetails {
  adult: boolean;
  backdrop_path: string; //img poster
  belongs_to_collection: any;
  budget: number;
  genres: [
    {
      id: number;
      name: string;
    }
  ];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: [
    {
      id: number;
      logo_path: any;
      name: string;
      origin_country: string;
    },
    {
      id: number;
      logo_path: any;
      name: string;
      origin_country: string;
    }
  ];
  production_countries: [
    {
      iso_3166_1: string;
      name: string;
    },
    {
      iso_3166_1: string;
      name: string;
    }
  ];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: [
    {
      iso_639_1: string;
      name: string;
    }
  ];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}
