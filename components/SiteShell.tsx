import navigation from "@/data/navigation.json";
import footer from "@/data/footer.json";
import { renderVariant } from "@/lib/render";
import type { PageData, Variant } from "@/lib/types";
import Behaviors from "./Behaviors";
import Overlays from "./Overlays";

/** Page frame: header, the page's JSON sections, footer and interactive overlays. */
export default function SiteShell({ page }: { page: PageData }) {
  const { class: cls, ...rest } = page.contentAttrs;
  return (
    <div className="prod-mode">
      {renderVariant(navigation.header as unknown as Variant, "header")}
      <main>
        <div className={cls} {...rest}>
          {page.sections.map((s) => renderVariant(s, s.id))}
        </div>
      </main>
      {renderVariant(footer.footer as unknown as Variant, "footer")}
      <Overlays />
      <Behaviors />
    </div>
  );
}
