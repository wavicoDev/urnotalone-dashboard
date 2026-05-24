import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { AppProvider } from "@/lib/app-context";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-4">🧸</div>
        <h1 className="text-3xl font-bold text-foreground">길을 잃었어요</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          찾으시는 페이지가 없어요. 도리가 함께 홈으로 가요.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">이 페이지가 열리지 않았어요</h1>
        <p className="mt-2 text-sm text-muted-foreground">잠시 후 다시 시도해 주세요.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            다시 시도
          </button>
          <a
            href="/"
            className="rounded-xl border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            홈으로
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "URNOTALONE · 도리 대시보드" },
      {
        name: "description",
        content:
          "7~12세 아동 정서 케어 AI '도리'의 부모·교사용 대시보드. 아이의 마음 신호를 부드럽게 닿게 합니다.",
      },
      { property: "og:title", content: "URNOTALONE · 도리 대시보드" },
      { name: "twitter:title", content: "URNOTALONE · 도리 대시보드" },
      { name: "description", content: "This app assists in spec-driven development by saving specifications and guiding development based on them." },
      { property: "og:description", content: "This app assists in spec-driven development by saving specifications and guiding development based on them." },
      { name: "twitter:description", content: "This app assists in spec-driven development by saving specifications and guiding development based on them." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3bce9335-ff42-43fc-9e3b-180dffbec74f/id-preview-2308ae40--15815433-8401-47d6-a34f-4d89f0aba2c4.lovable.app-1779583396981.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3bce9335-ff42-43fc-9e3b-180dffbec74f/id-preview-2308ae40--15815433-8401-47d6-a34f-4d89f0aba2c4.lovable.app-1779583396981.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Outlet />
        <Toaster position="top-right" richColors closeButton />
      </AppProvider>
    </QueryClientProvider>
  );
}
