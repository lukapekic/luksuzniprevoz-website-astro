import { type z } from "zod";
import { LocaleCodeSchema, LocaleSchema, RouteSchema } from "../core/config.ts";

export { LocaleCodeSchema, LocaleSchema, RouteSchema };

export type LocaleCode = z.infer<typeof LocaleCodeSchema>;
export type Locale = z.infer<typeof LocaleSchema>;
export type Route = z.infer<typeof RouteSchema>;
