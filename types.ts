export interface Movie {
  id: number;
  title: string;
  posterPath: string | null;
}

export interface MovieRecommendation {
  title:string;
  reason: string;
  posterPath?: string | null;
}
