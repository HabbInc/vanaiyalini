"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/dist/client/link";

export default function AboutPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const root = rootRef.current;
    if (!root) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) return;

      document.querySelectorAll<HTMLElement>(".panel").forEach((panel) => {
        const bg = panel.querySelector<HTMLElement>(".bg");
        const title = panel.querySelector<HTMLElement>(".title");
        const sub = panel.querySelector<HTMLElement>(".sub");

        ScrollTrigger.create({
          trigger: panel,
          start: "top top",
          end: "+=120%",
          pin: true,
          pinSpacing: true,
        });

        if (bg) {
          gsap.fromTo(
            bg,
            { scale: 1.18 },
            {
              scale: 1.02,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }

        if (title) {
          gsap.fromTo(
            title,
            { y: 0, scale: 1, opacity: 1 },
            {
              y: -60,
              scale: 1.18,
              opacity: 0.95,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }

        if (sub) {
          gsap.fromTo(
            sub,
            { y: 0, opacity: 0.95 },
            {
              y: -30,
              opacity: 0.75,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }
      });

      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="min-h-screen bg-[#0b0d12] text-[#f5f5f5] overflow-x-hidden"
    >
      {/* TOPBAR */}
      <div className="topbar">
        <div className="brand">About Us</div>
        <div className="brand flex items-center gap-4">
            <Link className="hover:opacity-70" href="/">Home</Link>
            <Link className="hover:opacity-70" href="/products">Shop</Link>
            <Link className="hover:opacity-70" href="/about">About</Link>
        </div>
        <div className="hint">Scroll ↓</div>
      </div>

      {/* PANEL 1 */}
      <section
        className="panel"
        style={{
          ["--bg-image" as any]:
            "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2400&q=80')",
        }}
      >
        <div className="bg" aria-hidden="true" />

        <div className="content">
          <div className="kicker">Chapter 01</div>
          <h1 className="title">The Art of Light</h1>
          <p className="sub">
            Big text, cinematic image zoom, and smooth scroll transitions—built
            for a website using GSAP + ScrollTrigger.
          </p>
        </div>

        <div className="scroll-cue" aria-hidden="true">
          <span className="dot"></span>
          <span>Scroll</span>
        </div>
      </section>

      {/* PANEL 2 */}
      <section
        className="panel"
        style={{
          ["--bg-image" as any]:
            "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2400&q=80')",
        }}
      >
        <div className="bg" aria-hidden="true" />

        <div className="content">
          <div className="kicker">Chapter 02</div>
          <h2 className="title">Into the Wild</h2>
          <p className="sub">
            Each section pins for a moment, while the background slowly zooms and
            the typography scales and drifts—like your video.
          </p>
        </div>
      </section>

      {/* PANEL 3 */}
      <section
        className="panel"
        style={{
          ["--bg-image" as any]:
            "url('https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=2400&q=80')",
        }}
      >
        <div className="bg" aria-hidden="true" />

        <div className="content">
          <div className="kicker">Chapter 03</div>
          <h2 className="title">Motion & Mood</h2>
          <p className="sub">
            Replace the images + text with your content. This is a Next.js About
            page with the same cinematic effect.
          </p>
        </div>
      </section>

      <div className="footer">
        Made with GSAP ScrollTrigger • Replace images/text to match your design
      </div>

      {/* GLOBAL CSS (same as your HTML) */}
      <style jsx global>{`
        :root {
          --fg: #f5f5f5;
          --muted: rgba(245, 245, 245, 0.7);
          --bg: #0b0d12;
        }

        /* smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Fixed header */
        .topbar {
          position: fixed;
          inset: 0 0 auto 0;
          padding: 16px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          z-index: 50;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.55),
            rgba(0, 0, 0, 0)
          );
          pointer-events: none;
        }

        .topbar .brand,
        .topbar .hint {
          pointer-events: auto;
          user-select: none;
        }

        .brand {
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-size: 12px;
          opacity: 0.95;
        }

        .hint {
          font-size: 12px;
          color: var(--muted);
        }

        /* Panels */
        .panel {
          height: 100vh;
          position: relative;
          overflow: hidden;
          display: grid;
          place-items: center;
          isolation: isolate;
        }

        /* Background image layer */
        .panel .bg {
          position: absolute;
          inset: -2%;
          background-image: var(--bg-image);
          background-size: cover;
          background-position: center;
          transform: scale(1.15);
          filter: saturate(1.05) contrast(1.05);
          will-change: transform;
          z-index: 0;
        }

        /* Dark overlay for readability */
        .panel::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
              80% 80% at 50% 40%,
              rgba(0, 0, 0, 0.25),
              rgba(0, 0, 0, 0.75)
            ),
            linear-gradient(
              to bottom,
              rgba(0, 0, 0, 0.25),
              rgba(0, 0, 0, 0.65)
            );
          z-index: 1;
        }

        /* Content layer */
        .content {
          position: relative;
          z-index: 2;
          width: min(1100px, 92vw);
          text-align: center;
          padding: 24px 12px;
        }

        .kicker {
          display: inline-block;
          font-size: 12px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 14px;
        }

        .title {
          font-family: "Playfair Display", Georgia, serif;
          font-weight: 700;
          font-size: clamp(44px, 7.6vw, 128px);
          line-height: 0.95;
          margin: 0 0 14px 0;
          letter-spacing: 0.01em;
          text-shadow: 0 10px 40px rgba(0, 0, 0, 0.35);
          will-change: transform, opacity;
        }

        .sub {
          margin: 0 auto;
          max-width: 65ch;
          font-size: clamp(14px, 1.6vw, 18px);
          color: rgba(245, 245, 245, 0.82);
          line-height: 1.6;
          will-change: transform, opacity;
        }

        /* Bottom scroll cue */
        .scroll-cue {
          position: absolute;
          left: 50%;
          bottom: 18px;
          transform: translateX(-50%);
          z-index: 3;
          color: rgba(245, 245, 245, 0.75);
          font-size: 12px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 10px;
          user-select: none;
          pointer-events: none;
        }

        .scroll-cue .dot {
          width: 26px;
          height: 42px;
          border: 1px solid rgba(245, 245, 245, 0.45);
          border-radius: 999px;
          position: relative;
          overflow: hidden;
        }
        .scroll-cue .dot::after {
          content: "";
          width: 4px;
          height: 8px;
          border-radius: 999px;
          background: rgba(245, 245, 245, 0.75);
          position: absolute;
          left: 50%;
          top: 10px;
          transform: translateX(-50%);
          animation: wheel 1.4s infinite ease-in-out;
        }
        @keyframes wheel {
          0% {
            transform: translateX(-50%) translateY(0);
            opacity: 0.9;
          }
          70% {
            transform: translateX(-50%) translateY(14px);
            opacity: 0.25;
          }
          100% {
            transform: translateX(-50%) translateY(14px);
            opacity: 0;
          }
        }

        /* Footer */
        .footer {
          padding: 26px 18px;
          text-align: center;
          color: rgba(245, 245, 245, 0.65);
          font-size: 13px;
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
          .scroll-cue .dot::after {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
