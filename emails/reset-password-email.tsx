import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Section,
	Text,
} from "@react-email/components";

type ResetPasswordEmailProps = {
	resetUrl: string;
	userName?: string;
};

export function ResetPasswordEmail({
	resetUrl,
	userName = "there",
}: ResetPasswordEmailProps) {
	return (
		<Html>
			<Head />
			<Preview>Reset your Digital Shopper password</Preview>
			<Body style={body}>
				<Container style={container}>
					<Heading style={heading}>Reset your password</Heading>
					<Text style={paragraph}>Hi {userName},</Text>
					<Text style={paragraph}>
						Use the secure link below to reset your Digital Shopper password.
					</Text>
					<Section style={buttonRow}>
						<Button href={resetUrl} style={button}>
							Reset password
						</Button>
					</Section>
					<Text style={caption}>
						If you did not request this, you can ignore this email.
					</Text>
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

const buttonRow = {
	padding: "20px 0 12px",
};

const button = {
	background: "linear-gradient(135deg, #00daf3 0%, #009fb2 100%)",
	borderRadius: "10px",
	color: "#00363d",
	fontWeight: 700,
	padding: "14px 20px",
	textDecoration: "none",
};

const caption = {
	fontSize: "13px",
	lineHeight: "20px",
	color: "#a8b0bd",
	margin: "16px 0 0",
};