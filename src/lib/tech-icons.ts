import type { IconType } from "react-icons";
import {
  SiNextdotjs,
  SiNestjs,
  SiTypescript,
  SiReactquery,
  SiBetterauth,
  SiPostgresql,
  SiTailwindcss,
  SiJavascript,
  SiRedux,
  SiFastapi,
  SiRedis,
  SiReact,
  SiSpringboot,
  SiMongodb,
  SiExpress,
  SiNodedotjs,
} from "react-icons/si";

/** brand glyphs for tech-stack labels; render as currentColor (monochrome) */
export const TECH_ICONS: Record<string, IconType> = {
  "Next.js": SiNextdotjs,
  NestJS: SiNestjs,
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  "TanStack Query": SiReactquery,
  "Better Auth": SiBetterauth,
  PostgreSQL: SiPostgresql,
  "Tailwind CSS": SiTailwindcss,
  Redux: SiRedux,
  FastAPI: SiFastapi,
  Redis: SiRedis,
  React: SiReact,
  "Spring Boot": SiSpringboot,
  MongoDB: SiMongodb,
  "Express.js": SiExpress,
  "Node.js": SiNodedotjs,
};
