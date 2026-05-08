"use client";

import Image from "next/image";
import { useState } from "react";
import { ViewTransition } from "react";
import { cn } from "@/lib/utils";

type ProductImageGalleryProps = {
  images: { url: string; isPrimary: boolean }[];
  title: string;
  transitionName?: string;
};

export function ProductImageGallery({
  images,
  title,
  transitionName,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex]?.url ?? "/images/banner.webp";

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden bg-surface-low ring-1 ring-white/6">
        {transitionName ? (
          <ViewTransition
            name={transitionName}
            share="product-image-morph"
          >
            <Image
              src={activeImage}
              alt={title}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain"
              priority
            />
          </ViewTransition>
        ) : (
          <Image
            src={activeImage}
            alt={title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-contain"
            priority
          />
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative size-20 shrink-0 overflow-hidden bg-surface-low ring-1 transition-colors",
                index === activeIndex
                  ? "ring-primary-strong"
                  : "ring-white/6 hover:ring-white/20",
              )}
            >
              <Image
                src={image.url}
                alt={`${title} - view ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
