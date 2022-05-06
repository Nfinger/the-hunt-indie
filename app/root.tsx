import React, { useContext, useEffect } from "react";
import { withEmotionCache } from "@emotion/react";
import { ChakraProvider } from "@chakra-ui/react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type {
  MetaFunction,
  LoaderFunction,
  LinksFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";

import { ServerStyleContext, ClientStyleContext } from "./context";

import baseStylesheetUrl from "./styles/base.css";
import tailwindStylesheetUrl from "./styles/tailwind.css";
import { createUserSession, getSession, getUser } from "./session.server";
import { theme } from "./theme";
import { Fonts } from "./theme/Fonts";
import LayoutWrapper from "./components/Layouts/LayoutWrapper";

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "The Hunt",
  viewport: "width=device-width,initial-scale=1",
});

export let links: LinksFunction = () => {
  return [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstaticom" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap",
    },
    {
      rel: "stylesheet",
      href: "https://unpkg.com/swiper@6/swiper-bundle.min.css",
    },
    { rel: "stylesheet", href: "https://use.typekit.net/kxo3pgz.css" },
    { rel: "stylesheet", href: baseStylesheetUrl },
    { rel: "stylesheet", href: tailwindStylesheetUrl },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request);

  if (session.has("userId")) {
    // Redirect to the home page if they are already signed in.
    return json<LoaderData>({
      user: await getUser(request),
    });
  }

  const { user, headers } = await createUserSession(request);

  return json<LoaderData>({ user }, { headers });
};

interface DocumentProps {
  children: React.ReactNode;
}

const Document = withEmotionCache(
  ({ children }: DocumentProps, emotionCache) => {
    const serverStyleData = useContext(ServerStyleContext);
    const clientStyleData = useContext(ClientStyleContext);

    // Only executed on client
    useEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData?.reset();
    }, []);

    return (
      <html lang="en">
        <head>
          <Meta />
          <Links />
          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(" ")}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    );
  }
);

export default function App() {
  return (
    <Document>
      <ChakraProvider theme={theme}>
        <Fonts />
        <LayoutWrapper>
          <Outlet />
        </LayoutWrapper>
      </ChakraProvider>
    </Document>
  );
}
