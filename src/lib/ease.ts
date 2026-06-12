import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

/** house easing curve — cubic-bezier(0.22, 1, 0.36, 1) */
export const LUXE = CustomEase.create("luxe", "0.22, 1, 0.36, 1");
