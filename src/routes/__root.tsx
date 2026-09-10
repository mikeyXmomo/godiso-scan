import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { useTheme } from "@/lib/theme";

function RootComponent() {
  useTheme();
  return (
    <>
      <HeadContent />
      <Outlet />
      {import.meta.env.DEV ? (
        <TanStackRouterDevtools position="bottom-right" />
      ) : null}
    </>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        content:
          "Ubah PDF menjadi dokumen seperti hasil scan langsung di browser. Gratis dan file tetap di perangkat Anda.",
        name: "description",
      },
      { title: "Look Scanned — PDF Seperti Hasil Scan" },
    ],
  }),
});
