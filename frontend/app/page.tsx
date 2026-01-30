'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from './lib/api';

type Product = {
  _id: string;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock?: number;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:3001';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setErr(null);
      setLoading(true);
      try {
        const data = await apiFetch('/products');
        setProducts(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch (e: any) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const hasProducts = products.length > 0;

  return (
    <div className='relative'>
      <div className="bg-[#f6f2ee] text-[#121212]">
        {/* HERO */}
        <main className="relative mx-auto max-w-6xl px-4 py-10 md:py-14">
          {/* soft background shapes */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-10 -left-10 h-56 w-56 rounded-full bg-[#f0d9d2] opacity-50 blur-2xl" />
            <div className="absolute top-40 -right-10 h-64 w-64 rounded-full bg-black/5 opacity-70 blur-2xl" />
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* LEFT */}
            <div className="space-y-5">
              <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-black/70">
                  SUMMER COLLECTION
                </span>

              <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
                Fall - Winter <br />
                Collections 2030
              </h1>

              <p className="text-sm md:text-base text-black/60 leading-relaxed max-w-md">
                A specialist label creating luxury essentials. Ethically crafted with an
                unwavering commitment to exceptional quality.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 text-sm font-semibold hover:opacity-90"
                >
                  SHOP NOW <span className="text-base">→</span>
                </Link>

                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 border border-black/20 bg-white/60 px-6 py-3 text-sm font-semibold hover:bg-white"
                >
                  CREATE ACCOUNT
                </Link>
              </div>

              {/* Trust badges */}
              <div className="pt-6 grid grid-cols-3 gap-3">
                <Badge title="Clothing" subtitle="Explore our latest apparel collection." />
                <Badge title="Accessories" subtitle="Discover trendy accessories for every style." />
                <Badge title="Footwear" subtitle="Step into comfort and style with our shoes.
  " />
              </div>

              {/* Social */}
              <div className="pt-6 flex items-center gap-4 text-black/60">
                <button className="hover:text-black" aria-label="Facebook"><IconFacebook /></button>
                <button className="hover:text-black" aria-label="Twitter"><IconTwitter /></button>
                <button className="hover:text-black" aria-label="Pinterest"><IconPinterest /></button>
                <button className="hover:text-black" aria-label="Instagram"><IconInstagram /></button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative">
              {/* Circle behind image */}
              <div className="absolute right-8 top-10 h-72 w-72 md:h-120 md:w-120 rounded-full bg-[#f0d9d2] opacity-70" />

              <div className="relative z-10 flex justify-center md:justify-end">
                <div className="relative w-[280px] h-[380px] md:w-[360px] md:h-[480px]">
                  {/* Put an image in /public/hero-model.png */}
                  <Image
                    src="/hero-model.jpg"
                    alt="Hero"
                    fill
                    className="object-contain border w-10 px-4"
                    priority
                  />
                </div>
              </div>

              {/* dotted patterns */}
              <div className="pointer-events-none absolute left-8 top-12 hidden md:block opacity-30">
                <Dots />
              </div>
              <div className="pointer-events-none absolute right-[-8] bottom-2 hidden md:block opacity-60">
                <DotsSmall />
              </div>
            </div>
          </div>
        </main>  
      </div>
      
      {/* STEPS */} 
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Step n="01" title="Browse Products" desc="Explore our wide range of products and find your favorites." />
          <Step n="02" title="Add to Cart" desc="Select your desired items and add them to your shopping cart." />
          <Step n="03" title="Checkout & Enjoy" desc="Complete your purchase and enjoy your new products." />
        </div>
      </section>
    </div>
  );
}

/* ------------------ Components ------------------ */
function Badge({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white/60 p-3">
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-xs text-black/60">{subtitle}</div>
    </div>
  );
}

function Step({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-xs font-semibold tracking-widest text-red-500">{n}</div>
      <div className="mt-2 font-semibold">{title}</div>
      <div className="mt-1 text-sm text-black/60">{desc}</div>
    </div>
  );
}

function CategoryCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/60 backdrop-blur p-5 hover:bg-white transition">
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-sm text-black/60">{desc}</div>
    </div>
  );
}

/* ------------------ Dotted patterns ------------------ */
function Dots() {
  return (
    <div className="grid grid-cols-8 gap-2">
      {Array.from({ length: 64 }).map((_, i) => (
        <span key={i} className="h-1.5 w-1.5 rounded-full bg-black" />
      ))}
    </div>
  );
}
function DotsSmall() {
  return (
    <div className="grid grid-cols-6 gap-2">
      {Array.from({ length: 36 }).map((_, i) => (
        <span key={i} className="h-1.5 w-1.5 rounded-full bg-black" />
      ))}
    </div>
  );
}

/* ------------------ Icons (no extra library) ------------------ */
function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-black/80">
      <path
        d="M21 21l-4.3-4.3m1.3-5.2a7 7 0 11-14 0 7 7 0 0114 0z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-black/80">
      <path
        d="M12 21s-7-4.6-9.4-8.4C.8 9.6 2.4 6.5 5.6 5.6c1.9-.6 4 .1 5.4 1.6 1.4-1.5 3.5-2.2 5.4-1.6 3.2.9 4.8 4 3 7-2.4 3.8-9.4 8.4-9.4 8.4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBag() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-black/80">
      <path
        d="M6 8h12l-1 13H7L6 8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 8a3 3 0 016 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-current">
      <path
        d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v3H7v3h3v6h3v-6h3l1-3h-4v-3c0-.6.4-1 1-1z"
        fill="currentColor"
      />
    </svg>
  );
}
function IconTwitter() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-current">
      <path
        d="M20 7.4c-.6.3-1.3.4-2 .5.7-.4 1.2-1.1 1.5-1.9-.7.4-1.4.7-2.2.9A3.4 3.4 0 0011.5 9c0 .3 0 .6.1.8A9.7 9.7 0 014 6.4a3.4 3.4 0 001 4.6c-.5 0-1-.2-1.4-.4v.1c0 1.6 1.1 3 2.6 3.4-.3.1-.6.1-1 .1-.2 0-.4 0-.6-.1.4 1.4 1.8 2.4 3.3 2.4A6.9 6.9 0 014 18.3 9.7 9.7 0 009.3 20c6.3 0 9.8-5.3 9.8-9.8v-.4c.7-.5 1.2-1.1 1.7-1.8z"
        fill="currentColor"
      />
    </svg>
  );
}
function IconPinterest() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-current">
      <path
        d="M12 2a10 10 0 00-3.6 19.3c-.1-.8-.2-2 0-2.9l1.4-5.8s-.3-.7-.3-1.7c0-1.6.9-2.8 2-2.8.9 0 1.3.7 1.3 1.5 0 .9-.6 2.3-.9 3.6-.2 1.1.6 2 1.7 2 2.1 0 3.7-2.2 3.7-5.4 0-2.8-2-4.7-4.9-4.7-3.3 0-5.2 2.5-5.2 5.1 0 1 .4 2.1.9 2.7.1.1.1.2.1.3l-.3 1.1c-.1.3-.3.3-.5.2-1.1-.5-1.8-2.2-1.8-3.6 0-2.9 2.1-5.6 6.1-5.6 3.2 0 5.7 2.3 5.7 5.3 0 3.2-2 5.8-4.8 5.8-1 0-1.9-.5-2.2-1.1l-.6 2.4c-.2.9-.8 2.1-1.2 2.8A10 10 0 1012 2z"
        fill="currentColor"
      />
    </svg>
  );
}
function IconInstagram() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-current">
      <path
        d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm10 2H7a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3zm-5 4a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm5.5-.5a1 1 0 11-2 0 1 1 0 012 0z"
        fill="currentColor"
      />
    </svg>
  );
}
