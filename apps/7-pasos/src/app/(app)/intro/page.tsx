"use client";

import Link from "next/link";
import { introContent, type StepSection } from "@/data/steps-content";
import { ArrowRight } from "lucide-react";

function RenderSection({ section }: { section: StepSection }) {
  switch (section.type) {
    case "heading":
      return (
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-stone-800 mt-10 mb-4">
          {section.content}
        </h2>
      );
    case "paragraph":
      return (
        <p className="text-lg leading-relaxed text-stone-700 mb-6">
          {section.content}
        </p>
      );
    case "quote":
      return (
        <blockquote className="border-l-4 border-victoria-500 pl-6 py-3 my-8 bg-victoria-50 rounded-r-lg">
          <p className="italic text-stone-600 text-lg">{section.content}</p>
        </blockquote>
      );
    case "list":
      return (
        <div className="mb-6">
          {section.content && (
            <p className="text-lg text-stone-700 mb-3 font-medium">
              {section.content}
            </p>
          )}
          <ul className="space-y-2 pl-6">
            {section.items?.map((item, i) => (
              <li key={i} className="text-lg text-stone-700 list-disc">
                {item}
              </li>
            ))}
          </ul>
        </div>
      );
    default:
      return (
        <p className="text-lg text-stone-700 mb-6">{section.content}</p>
      );
  }
}

export default function IntroPage() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <span className="text-sm font-semibold text-victoria-600 uppercase tracking-wider">
          Introducción
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-stone-900 mt-2 mb-3">
          {introContent.title}
        </h1>
        <p className="text-xl text-stone-500">{introContent.subtitle}</p>
      </div>

      <hr className="border-stone-200 mb-10" />

      {/* Content */}
      <article className="prose-step">
        {introContent.sections.map((section, i) => (
          <RenderSection key={i} section={section} />
        ))}
      </article>

      {/* Closing Quote */}
      <blockquote className="border-l-4 border-stone-300 pl-6 py-3 my-10">
        <p className="text-xl font-display italic text-stone-600">
          &ldquo;{introContent.closingQuote}&rdquo;
        </p>
      </blockquote>

      {/* CTA */}
      <div className="flex justify-end pt-8 border-t border-stone-200">
        <Link href="/paso/1">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-victoria-500 text-white rounded-xl font-semibold hover:bg-victoria-600 transition-colors">
            Empezar con el Paso 1
            <ArrowRight size={18} />
          </button>
        </Link>
      </div>
    </div>
  );
}
