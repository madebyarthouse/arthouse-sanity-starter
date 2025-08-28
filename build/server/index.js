import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, createCookieSessionStorage, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, useRouteLoaderData, Meta, Links, ScrollRestoration, Scripts, Link, redirect } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { VisualEditing } from "@sanity/visual-editing/react-router";
import { useState, useEffect } from "react";
import crypto from "node:crypto";
import * as serverOnly from "@sanity/react-loader";
import { useQuery } from "@sanity/react-loader";
import { createClient } from "@sanity/client";
import { validatePreviewUrl } from "@sanity/preview-url-secret";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function getServerConfig() {
  return {
    productionDomain: process.env.PLAUSIBLE_DOMAIN || "your-domain.com",
    // Change this to your actual domain
    productionUrl: process.env.PRODUCTION_URL || `https://${process.env.PLAUSIBLE_DOMAIN || "your-domain.com"}`,
    themeColor: "#000"
    // Your brand color
  };
}
function DisablePreviewMode() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(window === window.parent && !window.opener);
  }, []);
  return show ? /* @__PURE__ */ jsx(
    "a",
    {
      href: "/api/preview-mode/disable",
      className: "fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg hover:bg-red-600 transition-colors z-50",
      children: "Disable Preview Mode"
    }
  ) : null;
}
function SanityVisualEditing() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(VisualEditing, {}),
    /* @__PURE__ */ jsx(DisablePreviewMode, {})
  ] });
}
const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    httpOnly: true,
    name: "__sanity_preview",
    path: "/",
    sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
    secrets: [crypto.randomBytes(16).toString("hex")],
    secure: process.env.NODE_ENV !== "development"
  }
});
async function previewContext(headers) {
  const previewSession = await getSession(headers.get("Cookie"));
  const preview = previewSession.get("projectId") === process.env.PUBLIC_SANITY_PROJECT_ID;
  return {
    preview,
    options: preview ? {
      perspective: "previewDrafts",
      stega: true
    } : {
      perspective: "published",
      stega: false
    }
  };
}
async function loader$4({
  request
}) {
  const {
    preview
  } = await previewContext(request.headers);
  const ENV = {
    PUBLIC_SANITY_PROJECT_ID: process.env.PUBLIC_SANITY_PROJECT_ID,
    PUBLIC_SANITY_DATASET: process.env.PUBLIC_SANITY_DATASET,
    PUBLIC_SANITY_STUDIO_URL: process.env.PUBLIC_SANITY_STUDIO_URL
  };
  const config = getServerConfig();
  return {
    preview,
    ENV,
    config
  };
}
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  const data = useRouteLoaderData("root");
  const {
    preview,
    ENV,
    config
  } = data || {
    preview: false,
    ENV: {},
    config: {}
  };
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {}), preview && /* @__PURE__ */ jsx(SanityVisualEditing, {}), /* @__PURE__ */ jsx("script", {
        dangerouslySetInnerHTML: {
          __html: `window.ENV = ${JSON.stringify(ENV)}`
        }
      })]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
const logoDark = "/assets/logo-dark-pX2395Y0.svg";
const logoLight = "/assets/logo-light-CVbx2LBR.svg";
const trackEvent = (eventName, props) => {
  console.log("Plausible analytics disabled - would have tracked client event:", eventName, props);
};
function Welcome() {
  const handleLinkClick = (href, text) => {
    trackEvent("External Link Click", {
      url: href,
      link_text: text,
      section: "welcome_page"
    });
  };
  return /* @__PURE__ */ jsx("main", { className: "flex items-center justify-center pt-16 pb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center gap-16 min-h-0", children: [
    /* @__PURE__ */ jsx("header", { className: "flex flex-col items-center gap-9", children: /* @__PURE__ */ jsxs("div", { className: "w-[500px] max-w-[100vw] p-4", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: logoLight,
          alt: "React Router",
          className: "block w-full dark:hidden"
        }
      ),
      /* @__PURE__ */ jsx(
        "img",
        {
          src: logoDark,
          alt: "React Router",
          className: "hidden w-full dark:block"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "max-w-[300px] w-full space-y-6 px-4", children: /* @__PURE__ */ jsxs("nav", { className: "rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4", children: [
      /* @__PURE__ */ jsx("p", { className: "leading-6 text-gray-700 dark:text-gray-200 text-center", children: "What's next?" }),
      /* @__PURE__ */ jsx("ul", { children: resources.map(({ href, text, icon }) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
        "a",
        {
          className: "group flex items-center gap-3 self-stretch p-3 leading-normal text-blue-700 hover:underline dark:text-blue-500",
          href,
          target: "_blank",
          rel: "noreferrer",
          onClick: () => handleLinkClick(href, text),
          children: [
            icon,
            text
          ]
        }
      ) }, href)) })
    ] }) })
  ] }) });
}
const resources = [
  {
    href: "https://reactrouter.com/docs",
    text: "React Router Docs",
    icon: /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "20",
        viewBox: "0 0 20 20",
        fill: "none",
        className: "stroke-gray-600 group-hover:stroke-current dark:stroke-gray-300",
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M9.99981 10.0751V9.99992M17.4688 17.4688C15.889 19.0485 11.2645 16.9853 7.13958 12.8604C3.01467 8.73546 0.951405 4.11091 2.53116 2.53116C4.11091 0.951405 8.73546 3.01467 12.8604 7.13958C16.9853 11.2645 19.0485 15.889 17.4688 17.4688ZM2.53132 17.4688C0.951566 15.8891 3.01483 11.2645 7.13974 7.13963C11.2647 3.01471 15.8892 0.951453 17.469 2.53121C19.0487 4.11096 16.9854 8.73551 12.8605 12.8604C8.73562 16.9853 4.11107 19.0486 2.53132 17.4688Z",
            strokeWidth: "1.5",
            strokeLinecap: "round"
          }
        )
      }
    )
  },
  {
    href: "https://rmx.as/discord",
    text: "Join Discord",
    icon: /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "20",
        viewBox: "0 0 24 20",
        fill: "none",
        className: "stroke-gray-600 group-hover:stroke-current dark:stroke-gray-300",
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M15.0686 1.25995L14.5477 1.17423L14.2913 1.63578C14.1754 1.84439 14.0545 2.08275 13.9422 2.31963C12.6461 2.16488 11.3406 2.16505 10.0445 2.32014C9.92822 2.08178 9.80478 1.84975 9.67412 1.62413L9.41449 1.17584L8.90333 1.25995C7.33547 1.51794 5.80717 1.99419 4.37748 2.66939L4.19 2.75793L4.07461 2.93019C1.23864 7.16437 0.46302 11.3053 0.838165 15.3924L0.868838 15.7266L1.13844 15.9264C2.81818 17.1714 4.68053 18.1233 6.68582 18.719L7.18892 18.8684L7.50166 18.4469C7.96179 17.8268 8.36504 17.1824 8.709 16.4944L8.71099 16.4904C10.8645 17.0471 13.128 17.0485 15.2821 16.4947C15.6261 17.1826 16.0293 17.8269 16.4892 18.4469L16.805 18.8725L17.3116 18.717C19.3056 18.105 21.1876 17.1751 22.8559 15.9238L23.1224 15.724L23.1528 15.3923C23.5873 10.6524 22.3579 6.53306 19.8947 2.90714L19.7759 2.73227L19.5833 2.64518C18.1437 1.99439 16.6386 1.51826 15.0686 1.25995ZM16.6074 10.7755L16.6074 10.7756C16.5934 11.6409 16.0212 12.1444 15.4783 12.1444C14.9297 12.1444 14.3493 11.6173 14.3493 10.7877C14.3493 9.94885 14.9378 9.41192 15.4783 9.41192C16.0471 9.41192 16.6209 9.93851 16.6074 10.7755ZM8.49373 12.1444C7.94513 12.1444 7.36471 11.6173 7.36471 10.7877C7.36471 9.94885 7.95323 9.41192 8.49373 9.41192C9.06038 9.41192 9.63892 9.93712 9.6417 10.7815C9.62517 11.6239 9.05462 12.1444 8.49373 12.1444Z",
            strokeWidth: "1.5"
          }
        )
      }
    )
  }
];
const env = typeof document === "undefined" ? process.env : window.ENV;
const client = createClient({
  projectId: env.PUBLIC_SANITY_PROJECT_ID || "rmappea8",
  dataset: env.PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-12-01",
  useCdn: true,
  stega: {
    studioUrl: env.PUBLIC_SANITY_STUDIO_URL
  }
});
const { loadQuery, setServerClient } = serverOnly;
setServerClient(client.withConfig({ token: process.env.SANITY_VIEWER_TOKEN }));
const query$1 = `*[_type == "house"] | order(title asc){
  _id,
  title,
  address,
  bedrooms
}`;
async function loader$3({
  request
}) {
  const {
    options
  } = await previewContext(request.headers);
  const data = await loadQuery(query$1, {}, options);
  return data;
}
function meta$1() {
  return [{
    title: "Arthouse - Houses"
  }, {
    name: "description",
    content: "Browse our collection of houses"
  }];
}
const home = UNSAFE_withComponentProps(function Home({
  loaderData
}) {
  const {
    data,
    encodeDataAttribute
  } = useQuery(query$1, {}, {
    initial: loaderData
  });
  const houses = Array.isArray(data) ? data : [];
  return /* @__PURE__ */ jsxs("div", {
    className: "container mx-auto px-4 py-8",
    children: [/* @__PURE__ */ jsx(Welcome, {}), /* @__PURE__ */ jsxs("div", {
      className: "mt-12",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-3xl font-bold text-gray-900 mb-8",
        children: "Houses"
      }), houses.length > 0 ? /* @__PURE__ */ jsx("div", {
        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        children: houses.map((house, index) => /* @__PURE__ */ jsxs(Link, {
          to: `/house/${house._id}`,
          className: "block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200",
          "data-sanity": encodeDataAttribute([index]),
          children: [/* @__PURE__ */ jsx("h2", {
            className: "text-xl font-semibold text-gray-900 mb-2",
            "data-sanity": encodeDataAttribute([index, "title"]),
            children: house.title || "Untitled House"
          }), house.address && /* @__PURE__ */ jsx("p", {
            className: "text-gray-600 mb-3 line-clamp-2",
            "data-sanity": encodeDataAttribute([index, "address"]),
            children: house.address
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex items-center text-sm text-gray-500",
            children: [/* @__PURE__ */ jsx("svg", {
              className: "w-4 h-4 mr-1",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24",
              children: /* @__PURE__ */ jsx("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
              })
            }), /* @__PURE__ */ jsxs("span", {
              "data-sanity": encodeDataAttribute([index, "bedrooms"]),
              children: [house.bedrooms || 0, " bedrooms"]
            })]
          })]
        }, house._id))
      }) : /* @__PURE__ */ jsxs("div", {
        className: "text-center py-12",
        children: [/* @__PURE__ */ jsx("p", {
          className: "text-gray-500 text-lg",
          children: "No houses found."
        }), /* @__PURE__ */ jsx("p", {
          className: "text-gray-400 text-sm mt-2",
          children: "Add some houses in your Sanity Studio to see them here."
        })]
      })]
    })]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  loader: loader$3,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const query = `*[_type == "house" && _id == $id][0]{
  _id,
  title,
  address,
  bedrooms
}`;
async function loader$2({
  request,
  params
}) {
  const {
    options
  } = await previewContext(request.headers);
  const data = await loadQuery(query, {
    id: params.id
  }, options);
  if (!data.data) {
    throw new Response("House not found", {
      status: 404
    });
  }
  return data;
}
function meta({
  loaderData
}) {
  const house = loaderData == null ? void 0 : loaderData.data;
  return [{
    title: (house == null ? void 0 : house.title) ? `${house.title} - Arthouse` : "House - Arthouse"
  }, {
    name: "description",
    content: (house == null ? void 0 : house.address) || "House details"
  }];
}
const house_$id = UNSAFE_withComponentProps(function HouseDetail({
  loaderData
}) {
  const {
    data: house,
    encodeDataAttribute
  } = useQuery(query, {
    id: loaderData.data._id
  }, {
    initial: loaderData
  });
  if (!house) {
    return /* @__PURE__ */ jsx("div", {
      className: "container mx-auto px-4 py-8",
      children: /* @__PURE__ */ jsxs("div", {
        className: "text-center",
        children: [/* @__PURE__ */ jsx("h1", {
          className: "text-2xl font-bold text-gray-900 mb-4",
          children: "House not found"
        }), /* @__PURE__ */ jsx(Link, {
          to: "/",
          className: "text-blue-600 hover:text-blue-800",
          children: "← Back to houses"
        })]
      })
    });
  }
  return /* @__PURE__ */ jsxs("div", {
    className: "container mx-auto px-4 py-8",
    children: [/* @__PURE__ */ jsx("div", {
      className: "mb-8",
      children: /* @__PURE__ */ jsxs(Link, {
        to: "/",
        className: "inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors",
        children: [/* @__PURE__ */ jsx("svg", {
          className: "w-4 h-4 mr-2",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
          children: /* @__PURE__ */ jsx("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M15 19l-7-7 7-7"
          })
        }), "Back to houses"]
      })
    }), /* @__PURE__ */ jsxs("div", {
      className: "bg-white rounded-lg shadow-lg p-8",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "border-b border-gray-200 pb-6 mb-6",
        children: [/* @__PURE__ */ jsx("h1", {
          className: "text-4xl font-bold text-gray-900 mb-2",
          "data-sanity": encodeDataAttribute(["title"]),
          children: house.title || "Untitled House"
        }), house.address && /* @__PURE__ */ jsx("p", {
          className: "text-lg text-gray-600",
          "data-sanity": encodeDataAttribute(["address"]),
          children: house.address
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-8",
        children: [/* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("h2", {
            className: "text-2xl font-semibold text-gray-900 mb-4",
            children: "Details"
          }), /* @__PURE__ */ jsxs("div", {
            className: "space-y-4",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center",
              children: [/* @__PURE__ */ jsx("svg", {
                className: "w-5 h-5 mr-3 text-gray-400",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsx("path", {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                })
              }), /* @__PURE__ */ jsxs("span", {
                className: "text-gray-700",
                children: [/* @__PURE__ */ jsx("span", {
                  className: "font-medium",
                  "data-sanity": encodeDataAttribute(["bedrooms"]),
                  children: house.bedrooms || 0
                }), " bedrooms"]
              })]
            }), house.address && /* @__PURE__ */ jsxs("div", {
              className: "flex items-start",
              children: [/* @__PURE__ */ jsxs("svg", {
                className: "w-5 h-5 mr-3 mt-0.5 text-gray-400",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: [/* @__PURE__ */ jsx("path", {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                }), /* @__PURE__ */ jsx("path", {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                })]
              }), /* @__PURE__ */ jsx("span", {
                className: "text-gray-700",
                "data-sanity": encodeDataAttribute(["address"]),
                children: house.address
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("h2", {
            className: "text-2xl font-semibold text-gray-900 mb-4",
            children: "Additional Info"
          }), /* @__PURE__ */ jsx("div", {
            className: "bg-gray-50 rounded-lg p-6",
            children: /* @__PURE__ */ jsx("p", {
              className: "text-gray-600 text-center",
              children: "More details about this house can be added to the Sanity schema."
            })
          })]
        })]
      })]
    })]
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: house_$id,
  loader: loader$2,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const loader$1 = async ({
  request
}) => {
  if (!process.env.SANITY_VIEWER_TOKEN) {
    throw new Response("Preview mode missing token", {
      status: 401
    });
  }
  const clientWithToken = client.withConfig({
    token: process.env.SANITY_VIEWER_TOKEN
  });
  const {
    isValid,
    redirectTo = "/"
  } = await validatePreviewUrl(clientWithToken, request.url);
  if (!isValid) {
    throw new Response("Invalid secret", {
      status: 401
    });
  }
  const session = await getSession(request.headers.get("Cookie"));
  await session.set("projectId", process.env.PUBLIC_SANITY_PROJECT_ID);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session)
    }
  });
};
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
const loader = async ({
  request
}) => {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session)
    }
  });
};
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-BQ9GfYjs.js", "imports": ["/assets/chunk-UH6JLGW7-D8LKGT5N.js", "/assets/index-D0WBLhZ5.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-rzB6_7En.js", "imports": ["/assets/chunk-UH6JLGW7-D8LKGT5N.js", "/assets/index-D0WBLhZ5.js", "/assets/root-DWBP4fe9.js", "/assets/preload-helper-ckwbz45p.js"], "css": ["/assets/root-Du7Tg0ss.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-E-ZKkUBW.js", "imports": ["/assets/chunk-UH6JLGW7-D8LKGT5N.js", "/assets/index.browser-C0-_AmFR.js", "/assets/preload-helper-ckwbz45p.js", "/assets/index-CKwF-_Vo.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/house.$id": { "id": "routes/house.$id", "parentId": "root", "path": "house/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/house._id-hggcEZZF.js", "imports": ["/assets/chunk-UH6JLGW7-D8LKGT5N.js", "/assets/index.browser-C0-_AmFR.js", "/assets/preload-helper-ckwbz45p.js", "/assets/index-CKwF-_Vo.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/preview-mode/enable": { "id": "routes/api/preview-mode/enable", "parentId": "root", "path": "api/preview-mode/enable", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/enable-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/api/preview-mode/disable": { "id": "routes/api/preview-mode/disable", "parentId": "root", "path": "api/preview-mode/disable", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/disable-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-2102b888.js", "version": "2102b888", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/house.$id": {
    id: "routes/house.$id",
    parentId: "root",
    path: "house/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/api/preview-mode/enable": {
    id: "routes/api/preview-mode/enable",
    parentId: "root",
    path: "api/preview-mode/enable",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/api/preview-mode/disable": {
    id: "routes/api/preview-mode/disable",
    parentId: "root",
    path: "api/preview-mode/disable",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
