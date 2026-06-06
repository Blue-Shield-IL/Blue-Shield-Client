export interface Topic {
  id: string;
  name: string;
  icon: string | null;
  keywords: Keyword[];
}

export interface Keyword {
  id: string;
  word: string;
}
