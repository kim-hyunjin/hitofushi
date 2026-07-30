export interface ExplanationRequest {
  kind: 'grammar' | 'kanji' | 'vocabulary';
  id: string;
  context?: string;
}

export interface ExplanationResult {
  title: string;
  body: string;
  source: 'static' | 'ai';
}

export interface ExplanationProvider {
  explain(request: ExplanationRequest): Promise<ExplanationResult | null>;
}

/**
 * 초기 버전은 Content Collections의 정적 설명을 직접 렌더링한다.
 * 향후 AI 기능은 이 인터페이스를 구현한 provider로 교체한다.
 */
export class StaticExplanationProvider implements ExplanationProvider {
  async explain(): Promise<null> {
    return null;
  }
}
