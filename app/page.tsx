import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { IS_MOCK, MODEL_LABEL } from "@/lib/ai/model";

/**
 * Placeholder page (template spec §5.6), in the shape of a page with no chat: SiteHeader, main,
 * Footer. lib/ai/model.ts is server-only, so its values reach the client header as props.
 */
export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader
        modelLabel={MODEL_LABEL}
        isMock={IS_MOCK}
        commit={process.env.VERCEL_GIT_COMMIT_SHA ?? "local"}
      />
      <main className="flex-1 p-4">
        <p>Replace this page.</p>
      </main>
      <Footer />
    </div>
  );
}
