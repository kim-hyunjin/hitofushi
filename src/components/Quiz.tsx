import { useState } from 'preact/hooks';
import { updateProgress } from '../lib/progress';
import type { QuizQuestion } from '../lib/types';

interface Props {
  lessonId: string;
  questions: QuizQuestion[];
}

export default function Quiz({ lessonId, questions }: Props) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const question = questions[index];

  const choose = (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === question.answerIndex) setScore((current) => current + 1);
  };

  const advance = () => {
    const finalScore = score;
    if (index === questions.length - 1) {
      const percent = Math.round((finalScore / questions.length) * 100);
      updateProgress((current) => ({
        ...current,
        quizScores: {
          ...current.quizScores,
          [lessonId]: Math.max(current.quizScores[lessonId] ?? 0, percent),
        },
      }));
      setFinished(true);
      return;
    }
    setIndex((current) => current + 1);
    setSelected(null);
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <div class="quiz-result" aria-live="polite">
        <span class="result-mark" aria-hidden="true">できた!</span>
        <h3>{questions.length}문제 중 {score}문제 정답</h3>
        <p>
          {score === questions.length
            ? '완벽해요. 이제 가사를 소리 내어 읽어 보세요.'
            : '틀린 표현을 문장 카드에서 한 번 더 확인해 보세요.'}
        </p>
        <button type="button" class="primary-button" onClick={restart}>
          다시 풀기
        </button>
      </div>
    );
  }

  return (
    <div class="quiz-card">
      <div class="quiz-meta">
        <span>문제 {index + 1} / {questions.length}</span>
        <span>현재 {score}점</span>
      </div>
      <div
        class="quiz-progress"
        aria-label={`퀴즈 진행률 ${index + 1}/${questions.length}`}
      >
        <span style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>
      <h3>{question.prompt}</h3>
      <div class="quiz-options">
        {question.options.map((option, optionIndex) => {
          const isAnswer = optionIndex === question.answerIndex;
          const isSelected = optionIndex === selected;
          const stateClass =
            selected === null
              ? ''
              : isAnswer
                ? ' is-correct'
                : isSelected
                  ? ' is-wrong'
                  : '';
          return (
            <button
              type="button"
              class={`quiz-option${stateClass}`}
              disabled={selected !== null}
              onClick={() => choose(optionIndex)}
            >
              <span>{optionIndex + 1}</span>
              {option}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div class="quiz-feedback" aria-live="polite">
          <strong>
            {selected === question.answerIndex ? '정답이에요!' : '한 번 더 기억해 둘까요?'}
          </strong>
          <p>{question.explanation}</p>
          <button type="button" class="primary-button" onClick={advance}>
            {index === questions.length - 1 ? '결과 보기' : '다음 문제'}
          </button>
        </div>
      )}
    </div>
  );
}
