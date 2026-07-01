"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Upload, X, Check } from "lucide-react";
import {
    ColorArea,
    ColorPicker,
    ColorSlider,
    ColorSwatch,
    ColorSwatchPicker,
} from "@heroui/react";
import { LoyaltyTheme, UnsplashImage } from "@/types/loyalty";
import { PRELOADED_FOOD_BANNERS, searchUnsplashPhotos } from "@/lib/unsplash";

const BRAND_COLOR_PRESETS = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#f43f5e",
];

export default function ThemeStep({
    theme,
    setTheme,
}: {
    theme: LoyaltyTheme;
    setTheme: React.Dispatch<React.SetStateAction<LoyaltyTheme>>;
}) {
    const logoInputRef = useRef<HTMLInputElement>(null);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setTheme((prev) => ({
            ...prev,
            logoFile: file,
            logoPreview: URL.createObjectURL(file),
        }));
    };

    const clearLogo = () => {
        setTheme((prev) => ({ ...prev, logoFile: null, logoPreview: null }));
        if (logoInputRef.current) logoInputRef.current.value = "";
    };

    const selectBanner = (image: UnsplashImage) => {
        setTheme((prev) => ({
            ...prev,
            bannerFile: null,
            bannerPreview: image.url,
        }));
    };

    const clearBanner = () => {
        setTheme((prev) => ({ ...prev, bannerFile: null, bannerPreview: null }));
    };

    return (
        <div className="space-y-7">
            <div className="space-y-1.5">
                <h3 className="text-base font-semibold">Set up your loyalty page theme</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    Your logo, banner, and brand color appear on the customer-facing loyalty
                    page.
                </p>
            </div>

            {/* Logo upload */}
            <div className="space-y-2.5">
                <Label className="text-sm font-medium">Logo</Label>
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 shrink-0 rounded-xl border bg-muted/30 flex items-center justify-center overflow-hidden">
                        {theme.logoPreview ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={theme.logoPreview}
                                alt="Logo preview"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <Upload className="h-5 w-5 text-muted-foreground" />
                        )}
                    </div>
                    <div className="flex items-center gap-2.5">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => logoInputRef.current?.click()}
                        >
                            {theme.logoPreview ? "Replace logo" : "Upload logo"}
                        </Button>
                        {theme.logoPreview && (
                            <Button type="button" variant="ghost" size="sm" onClick={clearLogo}>
                                Remove
                            </Button>
                        )}
                    </div>
                    <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        aria-label="Logo file"
                        className="hidden"
                        onChange={handleLogoChange}
                    />
                </div>
            </div>

            {/* Banner picker */}
            <BannerPicker
                bannerPreview={theme.bannerPreview}
                onSelect={selectBanner}
                onClear={clearBanner}
            />

            {/* Brand color */}
            <div className="space-y-2.5">
                <Label className="text-sm font-medium">Brand color</Label>
                <ColorPicker
                    value={theme.primaryColor}
                    onChange={(color) =>
                        setTheme((prev) => ({ ...prev, primaryColor: String(color) }))
                    }
                >
                    <ColorPicker.Trigger>
                        <ColorSwatch size="lg" />
                        <span className="text-sm text-muted-foreground">{theme.primaryColor}</span>
                    </ColorPicker.Trigger>
                    <ColorPicker.Popover>
                        <ColorArea
                            aria-label="Color area"
                            className="max-w-full"
                            colorSpace="hsb"
                            xChannel="saturation"
                            yChannel="brightness"
                        >
                            <ColorArea.Thumb />
                        </ColorArea>
                        <ColorSlider
                            aria-label="Hue slider"
                            channel="hue"
                            className="gap-1 px-1"
                            colorSpace="hsb"
                        >
                            <ColorSlider.Track>
                                <ColorSlider.Thumb />
                            </ColorSlider.Track>
                        </ColorSlider>
                        <ColorSwatchPicker className="justify-center px-1" size="xs">
                            {BRAND_COLOR_PRESETS.map((preset) => (
                                <ColorSwatchPicker.Item key={preset} color={preset}>
                                    <ColorSwatchPicker.Swatch />
                                </ColorSwatchPicker.Item>
                            ))}
                        </ColorSwatchPicker>
                    </ColorPicker.Popover>
                </ColorPicker>
            </div>
        </div>
    );
}

/**
 * ---------------------------------------------------------------------------
 * Banner picker — preset food images + Unsplash search
 * ---------------------------------------------------------------------------
 */
function BannerPicker({
    bannerPreview,
    onSelect,
    onClear,
}: {
    bannerPreview: string | null;
    onSelect: (image: UnsplashImage) => void;
    onClear: () => void;
}) {
    const [query, setQuery] = useState("");
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [results, setResults] = useState<UnsplashImage[] | null>(null);

    const images = results ?? PRELOADED_FOOD_BANNERS;

    const runSearch = async () => {
        const trimmed = query.trim();
        if (!trimmed) {
            setResults(null);
            return;
        }
        setSearching(true);
        setSearchError(null);
        try {
            const photos = await searchUnsplashPhotos(trimmed);
            setResults(photos);
        } catch (err) {
            setSearchError(err instanceof Error ? err.message : "Search failed. Try again.");
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="space-y-2.5">
            <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Banner</Label>
                {bannerPreview && (
                    <Button type="button" variant="ghost" size="sm" onClick={onClear}>
                        Remove
                    </Button>
                )}
            </div>

            {bannerPreview && (
                <div className="rounded-xl border overflow-hidden h-32 w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={bannerPreview}
                        alt="Selected banner"
                        className="h-full w-full object-cover"
                    />
                </div>
            )}

            <div className="flex gap-2.5">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                runSearch();
                            }
                        }}
                        placeholder="Search Unsplash, e.g. street food"
                        className="pl-9"
                    />
                </div>
                <Button type="button" variant="outline" onClick={runSearch} disabled={searching}>
                    {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                </Button>
            </div>

            {searchError && <p className="text-sm text-destructive">{searchError}</p>}

            <div className="grid grid-cols-3 gap-2.5">
                {images.map((image) => {
                    const isSelected = bannerPreview === image.url;
                    return (
                        <button
                            key={image.id}
                            type="button"
                            onClick={() => onSelect(image)}
                            className={`relative h-20 rounded-lg overflow-hidden border-2 transition-colors ${isSelected ? "border-primary" : "border-transparent hover:border-muted-foreground/30"
                                }`}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={image.thumbUrl}
                                alt={image.alt}
                                className="h-full w-full object-cover"
                            />
                            {isSelected && (
                                <span className="absolute top-1 right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                    <Check className="h-3 w-3 text-primary-foreground" />
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {results && results.length === 0 && !searching && (
                <p className="text-sm text-muted-foreground">No results. Try another search term.</p>
            )}
        </div>
    );
}