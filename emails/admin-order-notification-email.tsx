import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Section,
	Text,
} from "@react-email/components";
import { formatCurrency } from "@/lib/utils";
import type { StoredOrderItem } from "@/db/schema";

type AdminOrderNotificationEmailProps = {
	orderNumber: string;
	customerName: string;
	customerEmail: string;
	total: number;
	items: StoredOrderItem[];
};

export function AdminOrderNotificationEmail({
	orderNumber,
	customerName,
	customerEmail,
	total,
	items,
}: AdminOrderNotificationEmailProps) {
	return (
		<Html>
			<Head />
			<Preview>New order received: {orderNumber}</Preview>
			<Body style={body}>
				<Container style={container}>
					<Heading style={heading}>New order received</Heading>
					<Text style={paragraph}>
						Order <strong>{orderNumber}</strong> has been paid.
					</Text>
					<Section style={panel}>
						<Text style={detailLine}>
							<strong>Customer:</strong> {customerName}
						</Text>
						<Text style={detailLine}>
							<strong>Email:</strong> {customerEmail}
						</Text>
					</Section>
					<Section style={panel}>
						{items.map((item) => (
							<Text key={item.id} style={lineItem}>
								{item.title} x {item.quantity} · {formatCurrency(item.price * item.quantity)}
							</Text>
						))}
					</Section>
					<Text style={totalText}>Total: {formatCurrency(total)}</Text>
				</Container>
			</Body>
		</Html>
	);
}

const body = {
	backgroundColor: "#0b1016",
	fontFamily: "Inter, Arial, sans-serif",
	padding: "40px 0",
};

const container = {
	backgroundColor: "#161b22",
	borderRadius: "18px",
	margin: "0 auto",
	maxWidth: "560px",
	padding: "40px",
	color: "#dfe2eb",
};

const heading = {
	fontFamily: "'Space Grotesk', Inter, Arial, sans-serif",
	fontSize: "32px",
	letterSpacing: "-0.02em",
	margin: "0 0 16px",
	color: "#f6fbff",
};

const paragraph = {
	fontSize: "15px",
	lineHeight: "24px",
	margin: "0 0 12px",
};

const panel = {
	backgroundColor: "#0f141b",
	borderRadius: "12px",
	padding: "16px",
	marginTop: "20px",
};

const detailLine = {
	fontSize: "14px",
	lineHeight: "22px",
	margin: "0 0 4px",
};

const lineItem = {
	fontSize: "14px",
	lineHeight: "22px",
	margin: "0 0 8px",
};

const totalText = {
	fontSize: "18px",
	fontWeight: 700,
	marginTop: "18px",
	color: "#00daf3",
};
