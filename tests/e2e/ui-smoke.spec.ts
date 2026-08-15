import { expect, test } from '@playwright/test';

test('홈과 테마 전환이 정상 동작한다', async ({ page }) => {
  await page.goto('./');

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'HitoFushi 홈' })).toBeVisible();

  const root = page.locator('html');
  const initiallyDark = await root.evaluate((element) => element.classList.contains('dark'));
  await page.getByRole('button', { name: '라이트·다크 테마 전환' }).click();
  await expect.poll(() => root.evaluate((element) => element.classList.contains('dark')))
    .toBe(!initiallyDark);

  await page.reload();
  await expect.poll(() => root.evaluate((element) => element.classList.contains('dark')))
    .toBe(!initiallyDark);
});

test('모바일 메뉴가 열리고 가로 스크롤이 생기지 않는다', async ({ page, isMobile }) => {
  test.skip(!isMobile, '모바일 프로젝트에서만 실행합니다.');
  await page.goto('./');

  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
    .toBe(true);
  await page.getByRole('button', { name: '메뉴 열기' }).click();
  await expect(page.getByRole('navigation', { name: '모바일 주요 메뉴' })).toBeVisible();
  await expect(page.getByRole('link', { name: '노래 목록', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '메뉴 닫기' }).click();
  await expect(page.getByRole('navigation', { name: '모바일 주요 메뉴' })).toBeHidden();
});

test('레슨 읽기 설정과 학습 대화상자가 동작한다', async ({ page }) => {
  await page.goto('songs/lady/lessons/1/');

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  const videoFrame = page.locator('[data-slot="aspect-ratio-wrapper"]').first();
  await expect(videoFrame).toBeVisible();
  const videoFrameBox = await videoFrame.boundingBox();
  expect(videoFrameBox).not.toBeNull();
  expect(Math.abs(videoFrameBox!.height - videoFrameBox!.width * 9 / 16)).toBeLessThan(2);

  await page.getByRole('button', { name: '읽기', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-reading-mode', 'reading');

  const studyTrigger = page.locator('main [aria-haspopup="dialog"]').first();
  await studyTrigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: '대화상자 닫기' }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('내 학습 대시보드가 렌더링된다', async ({ page }) => {
  await page.goto('my-learning/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByText('전체 학습 현황', { exact: true })).toBeVisible();
});
