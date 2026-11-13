// Register skills here: import the file and add it to the list (order = sidebar order).
import designCritique from './design-critique.json';
import impeccable from './impeccable.json';
import unslop from './unslop-ai-ui.json';
import screens from './87-screens.json';
import typographyJson from './better-typography.json';
import typographyAi from './better-typography.md?raw';
import emil from './emil-animations.json';
import apple from './apple-motion.json';
import appleDesign from './apple-design.json';
import m3 from './m3-motion.json';
import lottie from './motion-design.json';
import uxReview from './ux-review.json';
import uxPatterns from './ux-patterns.json';

const typography = { ...typographyJson, ai: typographyAi.endsWith('\n') ? typographyAi : `${typographyAi}\n` };

export const skills = [designCritique, unslop, impeccable, uxReview, uxPatterns, typography, apple, appleDesign, emil, m3, lottie, screens];
// Sidebar groups, in order. Each skill names its group in `category`.
export const categories = ['Design', 'Typography', 'Motion', 'Workflow'];
