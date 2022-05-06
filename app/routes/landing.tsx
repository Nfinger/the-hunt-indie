import type { LoaderFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";
const { start } = require("~/components/animatedText");

export const loader: LoaderFunction = async ({ request }) => {
  return null;
};

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    start();
  }, []);

  return (
    <main>
      <svg
        className="circles"
        width="100%"
        height="100%"
        viewBox="0 0 1400 1400"
      >
        <path
          id="circle-1"
          d="M250,700.5A450.5,450.5 0 1 11151,700.5A450.5,450.5 0 1 1250,700.5"
        />
        <path
          id="circle-2"
          d="M382,700.5A318.5,318.5 0 1 11019,700.5A318.5,318.5 0 1 1382,700.5"
        />
        <path
          id="circle-3"
          d="M487,700.5A213.5,213.5 0 1 1914,700.5A213.5,213.5 0 1 1487,700.5"
        />
        <path
          id="circle-4"
          d="M567.5,700.5A133,133 0 1 1833.5,700.5A133,133 0 1 1567.5,700.5"
        />
        <text className="circles__text circles__text--1">
          <textPath
            className="circles__text-path"
            xlinkHref="#circle-1"
            aria-label=""
            textLength="2830"
          >
            t The Hunt&nbsp; The Hunt&nbsp; The Hunt&nbsp; The Hunt&nbsp; The
            Hun
          </textPath>
        </text>
        <text className="circles__text circles__text--2">
          <textPath
            className="circles__text-path"
            xlinkHref="#circle-2"
            aria-label=""
            textLength="2001"
          >
            nt The Hunt&nbsp; The Hunt&nbsp; The Hunt&nbsp; The Hu
          </textPath>
        </text>
        <text className="circles__text circles__text--3">
          <textPath
            className="circles__text-path"
            xlinkHref="#circle-3"
            aria-label=""
            textLength="1341"
          >
            unt The Hunt&nbsp; The Hunt&nbsp; The H
          </textPath>
        </text>
        <text className="circles__text circles__text--4">
          <textPath
            className="circles__text-path"
            xlinkHref="#circle-4"
            aria-label=""
            textLength="836"
          >
            Hunt The Hunt&nbsp; The Hunt&nbsp; The
          </textPath>
        </text>
      </svg>
      <div className="content"></div>
      <button className="enter" onClick={() => navigate("/")}>
        <div className="enter__bg"></div>
        <span className="enter__text">Enter</span>
      </button>
    </main>
  );
}
