import { getCollection, type CollectionEntry } from 'astro:content';
import { songs } from './songs';

export async function getOrderedLessons(): Promise<CollectionEntry<'lessons'>[]> {
  const lessons = await getCollection('lessons');
  const songOrder = new Map(songs.map((song) => [song.slug, song.sequence]));

  return lessons.sort(
    (a, b) =>
      (songOrder.get(a.data.songSlug) ?? Number.MAX_SAFE_INTEGER) -
        (songOrder.get(b.data.songSlug) ?? Number.MAX_SAFE_INTEGER) ||
      a.data.lessonNumber - b.data.lessonNumber,
  );
}

export async function getLessonsForSong(
  songSlug: string,
): Promise<CollectionEntry<'lessons'>[]> {
  return (await getOrderedLessons()).filter((entry) => entry.data.songSlug === songSlug);
}

export async function getLessonReferences() {
  const [grammarEntries, kanjiEntries] = await Promise.all([
    getCollection('grammar'),
    getCollection('kanji'),
  ]);

  return {
    grammarMap: new Map(grammarEntries.map((entry) => [entry.id, entry])),
    kanjiMap: new Map(kanjiEntries.map((entry) => [entry.data.character, entry])),
  };
}
