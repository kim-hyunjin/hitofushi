import { toast } from '@starwind-ui/runtime/toast';
import { IconDownload, IconTrash, IconUpload } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './starwind-react/alert-dialog';
import { Button } from './starwind-react/button';
import { Card, CardContent, CardHeader, CardTitle } from './starwind-react/card';
import { Skeleton } from './starwind-react/skeleton';
import { Toaster } from './starwind-react/toast';
import { useProgress } from '../hooks/useProgress';
import { saveProgress, updateProgress } from '../lib/progress';
import {
  deriveLearningSummary,
  isLearningProgressReset,
  type LearningLessonSummary,
} from '../lib/learningSummary';
import { downloadProgress, parseProgress } from '../lib/progressTransfer';
import {
  FavoriteVocabularySection,
  LearningSummarySection,
  LessonProgressSection,
} from './LearningDashboardSections';

export type { LearningLessonSummary } from '../lib/learningSummary';

interface Props {
  lessons: LearningLessonSummary[];
}

export default function LearningDashboard({ lessons }: Props) {
  const { progress, ready } = useProgress();
  const [resetMessage, setResetMessage] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  if (!ready) {
    return (
      <div className="grid gap-4" aria-label="학습 기록 불러오는 중">
        <Skeleton className="h-52 w-full rounded-2xl" />
        <Skeleton className="h-36 w-full rounded-2xl" />
      </div>
    );
  }

  const summary = deriveLearningSummary(lessons, progress);

  const importProgress = async (file?: File) => {
    if (!file) return;
    try {
      const next = parseProgress(await file.text());
      if (!saveProgress(next)) throw new Error('Progress storage is unavailable');
      toast.success('학습 기록을 가져왔습니다.');
    } catch {
      toast.error('진도 파일을 읽지 못했습니다.', {
        description: 'HitoFushi에서 내보낸 JSON 파일인지 확인해 주세요.',
      });
    } finally {
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const resetLearningProgress = () => {
    const next = updateProgress((current) => ({
      ...current,
      completedSentences: [],
      quizScores: {},
      lyricsReview: {},
      favoriteVocabulary: [],
    }));
    const success = isLearningProgressReset(next);
    const message = success ? '학습 현황을 초기화했습니다.' : '학습 현황을 초기화하지 못했습니다.';
    setResetMessage(message);
    success ? toast.success(message) : toast.error(message);
  };

  return (
    <div className="grid gap-8">
      <Toaster position="bottom-right" />
      <LearningSummarySection summary={summary} lessonCount={lessons.length} />

      <Card className="border-border/80 bg-card shadow-sm" aria-labelledby="progress-transfer-title">
        <CardHeader>
          <p className="eyebrow">학습 기록 관리</p>
          <CardTitle id="progress-transfer-title" className="text-2xl">전체 진도 옮기기</CardTitle>
          <p className="max-w-2xl text-sm text-muted-foreground">
            익힌 문장, 퀴즈 최고 점수, 가사 최종 점검, 즐겨찾기 어휘와 읽기 설정을 JSON 파일로
            보관하거나 다른 브라우저로 가져올 수 있습니다.
          </p>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button onClick={() => downloadProgress(progress)}>
            <IconDownload className="size-4" aria-hidden="true" /> 전체 진도 내보내기
          </Button>
          <Button variant="outline" onClick={() => fileInput.current?.click()}>
            <IconUpload className="size-4" aria-hidden="true" /> 전체 진도 가져오기
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="error">
                <IconTrash className="size-4" aria-hidden="true" /> 학습 현황 초기화
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>학습 현황을 초기화할까요?</AlertDialogTitle>
                <AlertDialogDescription>
                  익힌 문장, 퀴즈 점수, 가사 최종 점검과 즐겨찾기가 삭제됩니다. 읽기 설정은 유지됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction variant="error" onClick={resetLearningProgress}>초기화</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <input
            ref={fileInput}
            className="sr-only"
            type="file"
            accept="application/json,.json"
            onChange={(event) => importProgress(event.currentTarget.files?.[0])}
          />
          {resetMessage && <p className="sr-only" role="status" aria-live="polite">{resetMessage}</p>}
        </CardContent>
      </Card>

      <LessonProgressSection lessons={lessons} progress={progress} />
      <FavoriteVocabularySection items={summary.favoriteVocabulary} />
    </div>
  );
}
