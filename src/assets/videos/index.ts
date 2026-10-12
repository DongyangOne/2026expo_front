import canDent from './feedback_can_dent.mp4';
import canWaterOff from './feedback_can_waterOff.mp4';
import paperWeight from './feedback_paper_weight.mp4';
import plasticDent from './feedback_plastic_dent.mp4';
import plasticForeign from './feedback_plastic_foreign.mp4';
import plasticHolderOff from './feedback_plastic_holderOff.mp4';
import plasticStrawOff from './feedback_plastic_strawOff.mp4';
import plasticStrawHolderOff from './feedback_plastic_straw_holderOff.mp4';
import plasticVinlyOff from './feedback_plastic_vinlyOff.mp4';
import plasticWaterOff from './feedback_plastic_waterOff.mp4';
import vinlyWeight from './feedback_vinly_weight.mp4';

// 정적 import로 참조해야 릴리스 APK에 영상 파일이 포함됩니다.
const FEEDBACK_VIDEOS = new Map<string, number>([
  ['feedback_can_dent.mp4', canDent],
  ['feedback_can_wateroff.mp4', canWaterOff],
  ['feedback_paper_weight.mp4', paperWeight],
  ['feedback_plastic_dent.mp4', plasticDent],
  ['feedback_plastic_foreign.mp4', plasticForeign],
  ['feedback_plastic_holderoff.mp4', plasticHolderOff],
  ['feedback_plastic_strawoff.mp4', plasticStrawOff],
  ['feedback_plastic_straw_holderoff.mp4', plasticStrawHolderOff],
  ['feedback_plastic_vinlyoff.mp4', plasticVinlyOff],
  ['feedback_plastic_wateroff.mp4', plasticWaterOff],
  ['feedback_vinly_weight.mp4', vinlyWeight],
]);

export const getFeedbackVideoSource = (videoUrl: string | null | undefined): number | undefined => {
  if (!videoUrl) {
    return undefined;
  }

  // 서명 쿼리와 호스트가 바뀌어도 파일명으로 같은 로컬 영상을 선택합니다.
  const fileName = videoUrl.split(/[?#]/, 1)[0].split('/').pop();
  if (!fileName) {
    return undefined;
  }

  try {
    return FEEDBACK_VIDEOS.get(decodeURIComponent(fileName).toLowerCase());
  } catch {
    return undefined;
  }
};
