'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
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

  // ✅ 3D Animation refs
  const stageRef = useRef<HTMLDivElement | null>(null);
  const tiltRef = useRef<HTMLDivElement | null>(null);

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

  // ✅ 3D hover / tilt logic
  useEffect(() => {
    const stage = stageRef.current;
    const tilt = tiltRef.current;
    if (!stage || !tilt) return;

    const maxRotate = 10; // degrees
    const maxTranslate = 10; // px

    function onMove(e: MouseEvent) {
      const rect = (stage as HTMLDivElement).getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; // 0..1
      const y = (e.clientY - rect.top) / rect.height; // 0..1

      const rotateY = (x - 0.5) * (maxRotate * 2);
      const rotateX = -(y - 0.5) * (maxRotate * 2);

      const tx = (x - 0.5) * (maxTranslate * 2);
      const ty = (y - 0.5) * (maxTranslate * 2);

      (tilt as HTMLDivElement).style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(${tx}px, ${ty}px, 0)`;
    }

    function onLeave() {
      (tilt as HTMLDivElement).style.transform = `rotateX(0deg) rotateY(0deg) translate3d(0px, 0px, 0px)`;
    }

    stage.addEventListener('mousemove', onMove);
    stage.addEventListener('mouseleave', onLeave);

    return () => {
      stage.removeEventListener('mousemove', onMove);
      stage.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div className="relative">
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
                <Badge title="Footwear" subtitle="Step into comfort and style with our shoes." />
              </div>

              {/* Social */}
              <div className="pt-6 flex items-center gap-4 text-black/60">
                <button className="hover:text-black" aria-label="Facebook"><IconFacebook /></button>
                <button className="hover:text-black" aria-label="Twitter"><IconTwitter /></button>
                <button className="hover:text-black" aria-label="Pinterest"><IconPinterest /></button>
                <button className="hover:text-black" aria-label="Instagram"><IconInstagram /></button>
              </div>
            </div>

            {/* RIGHT (✅ 3D stage) */}
            <div
              ref={stageRef}
              className="relative"
              style={{ perspective: '1100px' }}
            >
              {/* Circle behind image */}
              <div className="absolute right-8 top-10 h-72 w-72 md:h-120 md:w-120 rounded-full bg-[#f0d9d2] opacity-70" />

              {/* ✅ Tilt wrapper */}
              <div
                ref={tiltRef}
                className="relative z-10 flex justify-center md:justify-end transition-transform duration-200 ease-out"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div
                  className="relative w-[280px] h-[380px] md:w-[360px] md:h-[480px] rounded-2xl overflow-hidden border border-black/10 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.12)]"
                  style={{
                    transform: 'translateZ(60px)',
                    animation: 'floatHero 6s ease-in-out infinite',
                  }}
                >
                  <Image
                    src="/hero-model.jpg"
                    alt="Hero"
                    fill
                    className="object-cover"
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

              {/* ✅ Small hint */}
              <div className="absolute right-3 top-3 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-[11px] text-black/60">
                Hover for 3D
              </div>
            </div>
          </div>

          {/* ✅ Floating animation keyframes */}
          <style jsx>{`
            @keyframes floatHero {
              0%,
              100% {
                transform: translateZ(60px) translateY(0px);
              }
              50% {
                transform: translateZ(60px) translateY(-10px);
              }
            }
          `}</style>
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

            {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Featured Products</h2>
            <p className="text-sm text-black/60 mt-1">
              Handpicked items from our latest collection.
            </p>
          </div>
          <Link href="/products" className="text-sm underline hover:opacity-70">
            View all →
          </Link>
        </div>

        {err && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {err}
          </div>
        )}

        {loading ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-black/10 bg-white p-5">
                <div className="h-44 rounded-xl bg-gray-100 animate-pulse" />
                <div className="mt-3 h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
                <div className="mt-2 h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-black/10 bg-white p-6 text-black/60">
            No products available yet. Add products as a seller/admin.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Link
                key={p._id}
                href={`/products/${p._id}`}
                className="group rounded-2xl border border-black/10 bg-white p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="relative overflow-hidden rounded-xl border border-black/10 bg-gray-50 h-44">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`${API_BASE}${p.imageUrl}`}
                      alt={p.title}
                      className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-black/50 text-sm">
                      No image
                    </div>
                  )}
                </div>

                <div className="mt-3 space-y-1">
                  <h3 className="font-semibold line-clamp-1">{p.title}</h3>
                  <p className="text-sm text-black/60 line-clamp-2">
                    {p.description || 'No description'}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="font-semibold">LKR {p.price}</span>
                  <span className="text-xs rounded-full bg-black/5 px-3 py-1">
                    Stock: {p.stock ?? 0}
                  </span>
                </div>

                <div className="mt-3 text-sm font-medium opacity-0 group-hover:opacity-100 transition">
                  View details →
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Shop by Category</h2>
            <p className="text-sm text-black/60 mt-1">
              Find what you love faster with curated categories.
            </p>
          </div>
          <Link href="/products" className="text-sm underline hover:opacity-70">
            Browse →
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <CategoryCard title="Fashion" desc="New arrivals & trends" />
          <CategoryCard title="Footwear" desc="Sneakers • Casual • Formal" />
          <CategoryCard title="Accessories" desc="Bags • Watches • More" />
          <CategoryCard title="Streetwear" desc="Daily essentials" />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="rounded-3xl border border-black/10 bg-white/60 backdrop-blur p-8 md:p-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">What customers say</h2>
              <p className="text-sm text-black/60 mt-1">
                Trusted by shoppers and sellers.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Testimonial
              quote="Super smooth checkout and the products look premium."
              name="Nimal • Colombo"
            />
            <Testimonial
              quote="As a seller, uploading items is easy and fast."
              name="Kavindi • Jaffna"
            />
            <Testimonial
              quote="Admin dashboard gives full control. Clean UI."
              name="Team • MiniEcom"
            />
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="rounded-3xl border border-black/10 bg-black text-white p-8 md:p-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold">
                Get offers & new drops
              </h2>
              <p className="text-white/70 mt-2">
                Subscribe for updates. No spam — only the good stuff.
              </p>
            </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm outline-none focus:bg-white/15"
                placeholder="Enter your email"
              />
              <button className="rounded-xl bg-white text-black px-5 py-3 text-sm font-semibold hover:opacity-90">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-black/10 bg-[#f6f2ee]">
        <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-4">
          <div>
            <div className="text-lg font-semibold">
              MiniEcom<span className="text-red-500">.</span>
            </div>
            <p className="text-sm text-black/60 mt-2">
              Modern mini e-commerce built with Next.js + NestJS + MongoDB.
            </p>
          </div>

          <FooterCol
            title="Shop"
            links={[
              { label: 'Products', href: '/products' },
              { label: 'Cart', href: '/cart' },
              { label: 'Orders', href: '/orders' },
            ]}
          />

          <FooterCol
            title="Account"
            links={[
              { label: 'Login', href: '/login' },
              { label: 'Register', href: '/register' },
              { label: 'Profile', href: '/profile' },
            ]}
          />

          <FooterCol
            title="Seller"
            links={[
              { label: 'Seller Dashboard', href: '/seller/products' },
              { label: 'Add Product', href: '/seller/products/new' },
            ]}
          />
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-8 text-sm text-black/50">
          © {new Date().getFullYear()} MiniEcom. All rights reserved.
        </div>
      </footer>

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

/* ------------------ Social Icons ------------------ */
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

function Testimonial({ quote, name }: { quote: string; name: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-sm text-black/70 leading-relaxed">“{quote}”</div>
      <div className="mt-4 text-sm font-semibold">{name}</div>
    </div>
  );
}

function CategoryCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 hover:shadow-md transition cursor-pointer">
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-black/60 mt-1">{desc}</div>
    </div>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-3 space-y-2">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="block text-sm text-black/60 hover:text-black">
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

