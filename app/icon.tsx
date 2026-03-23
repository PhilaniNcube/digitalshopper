import { ImageResponse } from "next/og";

export const size = {
	width: 64,
	height: 64,
};

export const contentType = "image/png";

export default function Icon() {
	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background:
						"radial-gradient(circle at 30% 25%, #18d7ec 0%, #009fb2 42%, #071019 100%)",
					borderRadius: "18%",
					border: "4px solid rgba(255, 255, 255, 0.18)",
					color: "#f8fafc",
					fontSize: 30,
					fontWeight: 800,
					letterSpacing: "-0.08em",
					fontFamily: "sans-serif",
					boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.18)",
				}}
			>
				<div
					style={{
						display: "flex",
						transform: "translateY(-1px)",
					}}
				>
					DS
				</div>
			</div>
		),
		size,
	);
}