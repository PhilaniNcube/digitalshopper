import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Row,
	Column,
	Section,
	Text,
} from "@react-email/components";
import { formatCurrency } from "@/lib/utils";
import type { StoredOrderItem } from "@/db/schema";

type AbandonedCartEmailProps = {
	customerName: string;
	orderId: string;
	items: StoredOrderItem[];
	subtotal: number;
	total: number;
	checkoutUrl: string;
	supportEmail: string;
};

export function AbandonedCartEmail({
	customerName,
	orderId,
	items,
	subtotal,
	total,
	checkoutUrl,
	supportEmail,
}: AbandonedCartEmailProps) {
	const shortOrderId = orderId.slice(0, 8).toUpperCase();

	return (
		<Html>
			<Head />
			<Preview>
				You left something behind — your cart is waiting for you
			</Preview>
			<Body style={body}>
				<Container style={container}>
					{/* Header */}
					<Section style={header}>
						<Text style={brand}>Digital Shopper</Text>
					</Section>

					{/* Hero */}
					<Section style={heroSection}>
						<Heading style={heading}>
							Your cart is waiting, {customerName.split(" ")[0]} 🛒
						</Heading>
						<Text style={paragraph}>
							We noticed you started an order{" "}
							<span style={orderRef}>#{shortOrderId}</span> but it hasn&apos;t
							been completed yet. Your items are still reserved — complete your
							purchase before they sell out.
						</Text>
					</Section>

					{/* Items */}
					<Section style={itemsSection}>
						<Text style={sectionLabel}>Items in your order</Text>
						{items.map((item) => (
							<Row key={item.id} style={itemRow}>
								{item.image ? (
									<Column style={itemImageCol}>
										<Img
											src={item.image}
											alt={item.title}
											width={56}
											height={56}
											style={itemImage}
										/>
									</Column>
								) : null}
								<Column style={itemDetailsCol}>
									<Text style={itemTitle}>{item.title}</Text>
									<Text style={itemMeta}>
										Qty: {item.quantity} &nbsp;·&nbsp;{" "}
										{formatCurrency(item.price)} each
									</Text>
								</Column>
								<Column style={itemPriceCol}>
									<Text style={itemPrice}>
										{formatCurrency(item.price * item.quantity)}
									</Text>
								</Column>
							</Row>
						))}
					</Section>

					{/* Totals */}
					<Section style={totalsSection}>
						<Row style={totalsRow}>
							<Column>
								<Text style={totalsLabel}>Subtotal</Text>
							</Column>
							<Column style={totalsValueCol}>
								<Text style={totalsValue}>{formatCurrency(subtotal)}</Text>
							</Column>
						</Row>
						<Hr style={divider} />
						<Row style={totalsRow}>
							<Column>
								<Text style={grandTotalLabel}>Total</Text>
							</Column>
							<Column style={totalsValueCol}>
								<Text style={grandTotalValue}>{formatCurrency(total)}</Text>
							</Column>
						</Row>
					</Section>

					{/* CTA */}
					<Section style={ctaSection}>
						<Button style={ctaButton} href={checkoutUrl}>
							Complete my order →
						</Button>
					</Section>

					{/* Help */}
					<Section style={helpSection}>
						<Text style={helpHeading}>Need help completing your order?</Text>
						<Text style={helpParagraph}>
							If you ran into any issues or have questions about your order, our
							team is ready to help. Simply reply to this email or reach us at{" "}
							<Link href={`mailto:${supportEmail}`} style={helpLink}>
								{supportEmail}
							</Link>{" "}
							and we&apos;ll get back to you as soon as possible.
						</Text>
						<Text style={helpParagraph}>
							Whether it&apos;s a question about a product, payment, or delivery
							— just let us know and we&apos;ll sort it out.
						</Text>
					</Section>

					<Hr style={divider} />

					{/* Footer */}
					<Section>
						<Text style={footer}>
							You received this email because you started an order on Digital
							Shopper. If this wasn&apos;t you,{" "}
							<Link href={`mailto:${supportEmail}`} style={footerLink}>
								let us know
							</Link>
							.
						</Text>
						<Text style={footer}>
							&copy; {new Date().getFullYear()} Digital Shopper &mdash; South
							Africa
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
}

/* ── Styles ──────────────────────────────────────────────────── */

const body = {
	backgroundColor: "#0b1016",
	fontFamily: "Inter, Arial, sans-serif",
	padding: "40px 0",
};

const container = {
	backgroundColor: "#161b22",
	borderRadius: "18px",
	margin: "0 auto",
	maxWidth: "580px",
	overflow: "hidden" as const,
	color: "#dfe2eb",
};

const header = {
	backgroundColor: "#0f141b",
	padding: "20px 40px",
	borderBottom: "1px solid #1e2631",
};

const brand = {
	fontFamily: "'Space Grotesk', Inter, Arial, sans-serif",
	fontSize: "18px",
	fontWeight: 700,
	color: "#00daf3",
	margin: 0,
};

const heroSection = {
	padding: "36px 40px 24px",
};

const heading = {
	fontFamily: "'Space Grotesk', Inter, Arial, sans-serif",
	fontSize: "28px",
	letterSpacing: "-0.02em",
	margin: "0 0 16px",
	color: "#f6fbff",
};

const paragraph = {
	fontSize: "15px",
	lineHeight: "24px",
	margin: "0 0 8px",
	color: "#b0b8c8",
};

const orderRef = {
	fontFamily: "monospace",
	color: "#00daf3",
	fontSize: "13px",
};

const sectionLabel = {
	fontSize: "11px",
	fontWeight: 700,
	letterSpacing: "0.08em",
	textTransform: "uppercase" as const,
	color: "#7b8898",
	margin: "0 0 12px",
};

const itemsSection = {
	padding: "0 40px 8px",
};

const itemRow = {
	borderBottom: "1px solid #1e2631",
	padding: "12px 0",
};

const itemImageCol = {
	width: "64px",
	verticalAlign: "top" as const,
};

const itemImage = {
	borderRadius: "8px",
	border: "1px solid #1e2631",
	objectFit: "contain" as const,
};

const itemDetailsCol = {
	verticalAlign: "top" as const,
	paddingLeft: "12px",
};

const itemTitle = {
	fontSize: "14px",
	fontWeight: 600,
	color: "#f6fbff",
	margin: "0 0 4px",
	lineHeight: "20px",
};

const itemMeta = {
	fontSize: "12px",
	color: "#7b8898",
	margin: 0,
};

const itemPriceCol = {
	verticalAlign: "top" as const,
	textAlign: "right" as const,
	width: "90px",
};

const itemPrice = {
	fontSize: "14px",
	fontWeight: 600,
	color: "#dfe2eb",
	margin: 0,
};

const totalsSection = {
	padding: "16px 40px",
	backgroundColor: "#0f141b",
};

const totalsRow = {
	marginBottom: "4px",
};

const totalsLabel = {
	fontSize: "14px",
	color: "#7b8898",
	margin: 0,
};

const totalsValueCol = {
	textAlign: "right" as const,
};

const totalsValue = {
	fontSize: "14px",
	color: "#dfe2eb",
	margin: 0,
};

const grandTotalLabel = {
	fontSize: "16px",
	fontWeight: 700,
	color: "#f6fbff",
	margin: "8px 0 0",
};

const grandTotalValue = {
	fontSize: "16px",
	fontWeight: 700,
	color: "#00daf3",
	margin: "8px 0 0",
};

const divider = {
	borderColor: "#1e2631",
	margin: "12px 0",
};

const ctaSection = {
	padding: "28px 40px 24px",
	textAlign: "center" as const,
};

const ctaButton = {
	backgroundColor: "#00daf3",
	borderRadius: "10px",
	color: "#0b1016",
	display: "inline-block",
	fontSize: "15px",
	fontWeight: 700,
	padding: "14px 32px",
	textDecoration: "none",
};

const helpSection = {
	padding: "0 40px 28px",
	backgroundColor: "#161b22",
};

const helpHeading = {
	fontSize: "15px",
	fontWeight: 700,
	color: "#f6fbff",
	margin: "0 0 8px",
};

const helpParagraph = {
	fontSize: "14px",
	lineHeight: "22px",
	color: "#b0b8c8",
	margin: "0 0 10px",
};

const helpLink = {
	color: "#00daf3",
	textDecoration: "none",
};

const footer = {
	fontSize: "12px",
	color: "#4a5568",
	textAlign: "center" as const,
	lineHeight: "18px",
	padding: "0 40px",
	margin: "12px 0 0",
};

const footerLink = {
	color: "#4a5568",
};
