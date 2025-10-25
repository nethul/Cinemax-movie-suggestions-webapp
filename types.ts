export interface Movie {
  id: number;
  title: string;
  posterPath: string | null;
}

export interface MovieRecommendation {
  title:string;
  reason: string;
  match_reasons: string[];
  posterPath?: string | null;
}