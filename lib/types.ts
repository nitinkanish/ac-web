export type JsonNode = string | { t: string; a?: Record<string, string>; c?: JsonNode[] };
export type Variant = { node?: JsonNode; bp?: { min: number; max: number; node: JsonNode }[] };
export type PageSection = Variant & { id: string };
export type PageData = {
  route: string;
  source: string;
  meta: { title: string; description: string };
  contentAttrs: Record<string, string>;
  sections: PageSection[];
};
