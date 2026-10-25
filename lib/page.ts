import type { Metadata } from "next";
import type { PageData } from "./types";

export const meta = (p: PageData): Metadata => ({ title: p.meta.title, description: p.meta.description });
