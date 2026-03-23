export type CartProduct = {
	id: string;
	slug: string;
	title: string;
	category: string;
	price: number;
	image: string;
	summary: string;
	specs: string[];
	featured?: boolean;
	inStock?: boolean;
};

export type DemoProduct = CartProduct & {
	category: "audio" | "wearables" | "smart-home";
};

export const demoProducts: DemoProduct[] = [
	{
		id: "sonic-frame-01",
		slug: "sonic-frame-headphones",
		title: "Sonic Frame Headphones",
		category: "audio",
		price: 3499,
		image:
			"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
		summary:
			"Closed-back wireless reference headphones tuned for long critical listening sessions.",
		specs: ["40h battery", "ANC", "USB-C DAC"],
		featured: true,
		inStock: true,
	},
	{
		id: "pulse-watch-02",
		slug: "pulse-vector-watch",
		title: "Pulse Vector Watch",
		category: "wearables",
		price: 4299,
		image:
			"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
		summary:
			"A precision daily wearable with sapphire glass, LTE, and week-long battery efficiency.",
		specs: ["7-day battery", "LTE", "Sapphire glass"],
		featured: true,
		inStock: true,
	},
	{
		id: "dock-voice-03",
		slug: "dock-voice-speaker",
		title: "Dock Voice Speaker",
		category: "smart-home",
		price: 2199,
		image:
			"https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80",
		summary:
			"Desk-scale room audio with beamforming mics and warm studio-grade tonality.",
		specs: ["Spatial audio", "Wi-Fi 6", "Voice control"],
		featured: true,
		inStock: true,
	},
	{
		id: "arc-buds-04",
		slug: "arc-buds-pro",
		title: "Arc Buds Pro",
		category: "audio",
		price: 2799,
		image:
			"https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=1200&q=80",
		summary:
			"Low-latency in-ear monitors with adaptive listening modes and clean industrial geometry.",
		specs: ["IPX5", "Adaptive ANC", "Low latency"],
		inStock: true,
	},
	{
		id: "glass-panel-05",
		slug: "glass-panel-hub",
		title: "Glass Panel Hub",
		category: "smart-home",
		price: 5199,
		image:
			"https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80",
		summary:
			"A wall-mounted control surface for connected scenes, monitoring, and energy orchestration.",
		specs: ["Matter ready", "AMOLED", "Scene automation"],
		inStock: false,
	},
	{
		id: "halo-band-06",
		slug: "halo-band-fit",
		title: "Halo Band Fit",
		category: "wearables",
		price: 1899,
		image:
			"https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?auto=format&fit=crop&w=1200&q=80",
		summary:
			"A lightweight performance band for recovery metrics, sleep tracking, and training readiness.",
		specs: ["Recovery score", "Swimproof", "12-day battery"],
		inStock: true,
	},
];

export const featuredProducts = demoProducts.filter((product) => product.featured);