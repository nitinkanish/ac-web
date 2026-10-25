import Link from "next/link";
import { childrenOf } from "@/lib/routes";
import { pad } from "@/lib/ui";

const groups = [
  { title: "About", path: "/about" },
  { title: "Knowledge", path: "/knowledge" },
  { title: "Programmes", path: "/programmes" },
];

export default function Footer() {
  return (
    <footer className="bg-background-bg-footer flex flex-col">
      <div className="relative m-auto w-full max-w-[1920px]">
        <div className={`${pad} flex flex-col gap-8 py-8 lg:grid lg:grid-cols-[375px_1fr] lg:py-16 xl:grid-cols-[501px_1fr] xl:py-20`}>
          <div>
            <img src="/brand/logo.png" alt="Arun Chandan" width={512} height={512} className="h-16 w-16" />
            <p className="text-text mt-4 max-w-xl text-base leading-base-tight">
              Ayurveda, medicinal plants, and livelihoods. Dharamshala and Joginder Nagar, Himachal Pradesh.
            </p>
            <p className="mt-4 text-base">
              <a href="mailto:doctorchandan@gmail.com">doctorchandan@gmail.com</a>
              <br />
              <a href="tel:+917018001026">7018001026</a>
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {groups.map((group) => (
              <div key={group.path}>
                <p className="text-xs font-bold uppercase">{group.title}</p>
                <ul className="m-0 mt-3 list-none p-0">
                  <li className="mt-2">
                    <Link href={group.path}>{group.title}</Link>
                  </li>
                  {childrenOf(group.path)
                    .slice(0, 6)
                    .map((child) => (
                      <li key={child.path} className="mt-2">
                        <Link href={child.path}>{child.title}</Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className={`${pad} pb-28 text-sm`}>
          <p>
            General education, not a diagnosis or emergency care. <Link href="/medical-disclaimer">Read the medical disclaimer</Link>.
          </p>
          <p className="mt-2">
            <Link href="/privacy">Privacy</Link>
            {" · "}
            <Link href="/cookies">Cookies</Link>
            {" · "}
            <Link href="/terms">Terms</Link>
            {" · "}
            <Link href="/contact">Contact</Link>
            {" · "}
            <Link href="/community/newsletter">Newsletter</Link>
          </p>
          <p className="mt-4">
            <button className="text-sm underline" type="button" id="privacy-choices">
              Privacy choices
            </button>
          </p>
        </div>
      </div>
    </footer>
  );
}
