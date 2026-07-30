import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const rubySegmentSchema = z.object({
  text: z.string(),
  reading: z.string().optional(),
});

const sentenceSchema = z.object({
  id: z.string(),
  original: z.string(),
  ruby: z.array(rubySegmentSchema),
  hiragana: z.string(),
  pronunciationKo: z.string(),
  translationKo: z.string(),
  grammarIds: z.array(z.string()),
  kanjiIds: z.array(z.string()),
});

const vocabularySchema = z.object({
  id: z.string(),
  term: z.string(),
  reading: z.string(),
  meaning: z.string(),
  note: z.string().optional(),
});

const quizSchema = z
  .object({
    id: z.string(),
    prompt: z.string(),
    options: z.array(z.string()).min(2),
    answerIndex: z.number().int().nonnegative(),
    explanation: z.string(),
  })
  .refine((question) => question.answerIndex < question.options.length, {
    message: 'answerIndex must point to an existing option',
    path: ['answerIndex'],
  });

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/lessons' }),
  schema: z.object({
    songSlug: z.string(),
    lessonNumber: z.number().int().positive(),
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    estimatedMinutes: z.number().int().positive(),
    sentences: z.array(sentenceSchema),
    vocabulary: z.array(vocabularySchema),
    quiz: z.array(quizSchema),
  }),
});

const grammar = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/grammar' }),
  schema: z.object({
    title: z.string(),
    pattern: z.string(),
    summary: z.string(),
    level: z.enum(['입문', '초급']),
    examples: z.array(
      z.object({
        japanese: z.string(),
        korean: z.string(),
      }),
    ),
  }),
});

const kanji = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/kanji' }),
  schema: z.object({
    character: z.string().length(1),
    onyomi: z.array(z.string()),
    kunyomi: z.array(z.string()),
    basicMeaning: z.string(),
    wordMeaning: z.string(),
    mnemonic: z.string(),
    examples: z.array(
      z.object({
        word: z.string(),
        reading: z.string(),
        meaning: z.string(),
      }),
    ),
  }),
});

export const collections = { lessons, grammar, kanji };
