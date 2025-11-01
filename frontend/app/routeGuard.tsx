"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const initialCheckDone = useRef(false);

  useEffect(() => {
    // Only run this logic once — on the very first load
    if (!initialCheckDone.current) {
      const lastPath = localStorage.getItem("lastPath");

      // If user manually loaded a different URL, redirect back
      if (lastPath && pathname !== lastPath) {
        router.replace(lastPath);
        return;
      }

      // Otherwise, mark this route as allowed and save it
      localStorage.setItem("lastPath", pathname);
      initialCheckDone.current = true;
      setIsReady(true);
      return;
    }

    // On normal in-app route changes → update stored path
    localStorage.setItem("lastPath", pathname);
  }, [pathname, router]);

  if (!isReady && !initialCheckDone.current) return null;

  return children;
}
