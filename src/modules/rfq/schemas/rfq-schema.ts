import { z } from "zod";
export const rfqAssessmentSchema=z.object({technical_match:z.number().min(1).max(5),competitive_advantage:z.number().min(1).max(5),strategic_significance:z.number().min(1).max(5),manual_win_probability:z.number().min(0).max(100).nullable()});
