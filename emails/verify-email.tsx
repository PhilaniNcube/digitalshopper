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

type VerifyEmailProps = {
	verificationUrl: string;
	userName?: string;
};

export function VerifyEmail({
	verificationUrl,
	userName = "there",
}: VerifyEmailProps) {
	return (
		<Html>
			<Head />
			<Preview>Verify your Digital Shopper account</Preview>
			<Body style={body}>
				<Container style={container}>
					<Heading style={heading}>Verify your email address</Heading>
					<Text style={paragraph}>Hi {userName},</Text>
					<Text style={paragraph}>
						Confirm your email address to activate your Digital Shopper account and
						start signing in securely.
					</Text>
					<Section style={buttonRow}>
						<Button href={verificationUrl} style={button}>
							Verify email
						</Button>
					</Section>
					<Text style={caption}>
						If you did not create this account, you can ignore this email.
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