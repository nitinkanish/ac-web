import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { secret?: string; paths?: string[] } | null;
  if (!body || body.secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ ok: false }, { status: 401 });
  }
  revalidateTag("wordpress", "max");
  for (const path of body.paths || []) {
    if (path.startsWith("/")) revalidatePath(path);
  }
  revalidatePath("/");
  return Response.json({ ok: true });
}
