export type Photo = { src: string; alt: string };

const herbs: Photo = { src: "/photos/herbs-honey.jpg", alt: "Honey, herbs, and seeds arranged on a table" };
const leaves: Photo = { src: "/photos/herbs-leaves.jpg", alt: "Honey, herbs, and green leaves seen from above" };
const seeds: Photo = { src: "/photos/honey-seeds.jpg", alt: "A jar of honey beside seeds and dried herbs" };
const bay: Photo = { src: "/photos/bay-leaves.jpg", alt: "Bay leaves and small bowls of oil" };
const jars: Photo = { src: "/photos/herbal-jars.jpg", alt: "Jars of herbs and balms on a wooden table" };
const dried: Photo = { src: "/photos/dried-herbs.jpg", alt: "Dried herbal leaves packed in market bags" };
const amla: Photo = { src: "/photos/amla.jpg", alt: "Green amla fruit hanging among leaves" };
const bowl: Photo = { src: "/photos/brass-bowl.jpg", alt: "A hand holding a brass bowl with a purple flower" };
const turmeric: Photo = { src: "/photos/turmeric.jpg", alt: "Fresh turmeric roots" };
const mortar: Photo = { src: "/photos/mortar.jpg", alt: "A mortar and pestle with dried flowers" };
const aloe: Photo = { src: "/photos/mortar-aloe.jpg", alt: "Herbs, aloe, and a mortar and pestle" };
const hands: Photo = { src: "/photos/hands-herbs.jpg", alt: "Hands working herbs in a mortar" };
const bhringraj: Photo = { src: "/photos/bhringraj.jpg", alt: "A white bhringraj flower and green leaves" };
const pour: Photo = { src: "/photos/mortar-pour.jpg", alt: "Liquid poured into a mortar of herbs" };
const market: Photo = { src: "/photos/spices-market.jpg", alt: "Dried fruit, tea, and spices on display" };
const tea: Photo = { src: "/photos/tea.jpg", alt: "A glass cup of tea on a wooden surface" };
const flowers: Photo = { src: "/photos/flowers.jpg", alt: "A row of colourful flowers on a table" };
const spoons: Photo = { src: "/photos/spice-spoons.jpg", alt: "Spoons of coloured spice powders" };

const quiet = new Set(["/privacy", "/cookies", "/terms"]);

export function photoFor(path: string): Photo | null {
  if (quiet.has(path)) return null;
  if (path === "/" || path === "") return herbs;
  if (path.includes("amla")) return amla;
  if (path.includes("tejpat") || path.includes("processing")) return bay;
  if (path.includes("conservation") || path.includes("kutki") || path.includes("jatamansi")) return dried;
  if (path.includes("cultivation") || path.includes("nurseries")) return turmeric;
  if (path.startsWith("/plants") || path.startsWith("/medicinal-plants")) return turmeric;
  if (path.startsWith("/courses") || path.startsWith("/academy")) return hands;
  if (path.startsWith("/consultations") || path.startsWith("/consulting") || path.startsWith("/collaborate")) return tea;
  if (path.startsWith("/medical-astrology")) return bhringraj;
  if (path.startsWith("/knowledge") || path.startsWith("/publications") || path.startsWith("/research")) return jars;
  if (path.startsWith("/programmes") || path.startsWith("/community") || path.startsWith("/events")) return market;
  if (path.startsWith("/about") || path.startsWith("/expertise") || path.startsWith("/lokayurveda") || path.startsWith("/rcfc")) return flowers;
  if (path.startsWith("/ayush")) return bowl;
  if (path.startsWith("/contact") || path.startsWith("/hi")) return tea;
  return leaves;
}

const cards = [herbs, leaves, seeds, turmeric, mortar, aloe, pour, spoons, jars, dried, flowers, bowl];

export function cardPhoto(index: number): Photo {
  return cards[index % cards.length];
}
