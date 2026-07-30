export type ReadingMode = 'beginner' | 'elementary' | 'reading';

export interface RubySegment {
  text: string;
  reading?: string;
}

export interface LessonSentence {
  id: string;
  original: string;
  ruby: RubySegment[];
  hiragana: string;
  pronunciationKo: string;
  translationKo: string;
  grammarIds: string[];
  kanjiIds: string[];
}

export interface VocabularyItem {
  id: string;
  term: string;
  reading: string;
  meaning: string;
  note?: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}
