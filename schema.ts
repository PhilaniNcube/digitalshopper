export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
		public: {
			Tables: {
				admins: {
					Row: {
						created_at: string;
						id: string;
						user_id: string;
					};
					Insert: {
						created_at?: string;
						id?: string;
						user_id: string;
					};
					Update: {
						created_at?: string;
						id?: string;
						user_id?: string;
					};
					Relationships: [
						{
							foreignKeyName: "admins_user_id_fkey";
							columns: ["user_id"];
							isOneToOne: false;
							referencedRelation: "users";
							referencedColumns: ["id"];
						},
					];
				};
				brands: {
					Row: {
						created_at: string;
						id: string;
						logo_url: string | null;
						name: string;
						slug: string;
					};
					Insert: {
						created_at?: string;
						id?: string;
						logo_url?: string | null;
						name: string;
						slug: string;
					};
					Update: {
						created_at?: string;
						id?: string;
						logo_url?: string | null;
						name?: string;
						slug?: string;
					};
					Relationships: [];
				};
				categories: {
					Row: {
						created_at: string;
						id: string;
						image_url: string;
						slug: string;
						title: string;
					};
					Insert: {
						created_at?: string;
						id?: string;
						image_url: string;
						slug: string;
						title: string;
					};
					Update: {
						created_at?: string;
						id?: string;
						image_url?: string;
						slug?: string;
						title?: string;
					};
					Relationships: [];
				};
				colour: {
					Row: {
						colour_name: string;
						created_at: string;
						id: string;
					};
					Insert: {
						colour_name: string;
						created_at?: string;
						id?: string;
					};
					Update: {
						colour_name?: string;
						created_at?: string;
						id?: string;
					};
					Relationships: [];
				};
				frame_styles: {
					Row: {
						created_at: string;
						id: string;
						slug: string;
						title: string;
					};
					Insert: {
						created_at?: string;
						id?: string;
						slug: string;
						title: string;
					};
					Update: {
						created_at?: string;
						id?: string;
						slug?: string;
						title?: string;
					};
					Relationships: [];
				};
				orders: {
					Row: {
						address: string;
						city: string;
						created_at: string;
						email: string;
						first_name: string;
						id: string;
						last_name: string;
						// biome-ignore lint/suspicious/noExplicitAny: <explanation>
						order_items: any[];
						paid: boolean;
						payment_id: string | null;
						phone: string;
						postal_code: string;
						profile_id: string | null;
						province: string;
						shipped: boolean;
						shipping: number;
						subtotal: number;
						total_amount: number;
					};
					Insert: {
						address?: string;
						city?: string;
						created_at?: string;
						email?: string;
						first_name?: string;
						id?: string;
						last_name?: string;
						// biome-ignore lint/suspicious/noExplicitAny: <explanation>
						order_items: any[];
						paid?: boolean;
						payment_id?: string | null;
						phone?: string;
						postal_code?: string;
						profile_id?: string | null;
						province?: string;
						shipped?: boolean;
						shipping?: number;
						subtotal?: number;
						total_amount?: number;
					};
					Update: {
						address?: string;
						city?: string;
						created_at?: string;
						email?: string;
						first_name?: string;
						id?: string;
						last_name?: string;
						// biome-ignore lint/suspicious/noExplicitAny: <explanation>
						order_items?: any[];
						paid?: boolean;
						payment_id?: string | null;
						phone?: string;
						postal_code?: string;
						profile_id?: string | null;
						province?: string;
						shipped?: boolean;
						shipping?: number;
						subtotal?: number;
						total_amount?: number;
					};
					Relationships: [
						{
							foreignKeyName: "orders_profile_id_fkey";
							columns: ["profile_id"];
							isOneToOne: false;
							referencedRelation: "profiles";
							referencedColumns: ["id"];
						},
					];
				};
				product_brands: {
					Row: {
						brand_id: string;
						created_at: string;
						product_id: string;
					};
					Insert: {
						brand_id: string;
						created_at?: string;
						product_id: string;
					};
					Update: {
						brand_id?: string;
						created_at?: string;
						product_id?: string;
					};
					Relationships: [
						{
							foreignKeyName: "product_brands_brand_id_fkey";
							columns: ["brand_id"];
							isOneToOne: false;
							referencedRelation: "brands";
							referencedColumns: ["id"];
						},
						{
							foreignKeyName: "product_brands_product_id_fkey";
							columns: ["product_id"];
							isOneToOne: false;
							referencedRelation: "products";
							referencedColumns: ["id"];
						},
					];
				};
				product_categories: {
					Row: {
						category_id: string;
						created_at: string;
						product_id: string;
					};
					Insert: {
						category_id: string;
						created_at?: string;
						product_id: string;
					};
					Update: {
						category_id?: string;
						created_at?: string;
						product_id?: string;
					};
					Relationships: [
						{
							foreignKeyName: "product_categories_category_id_fkey";
							columns: ["category_id"];
							isOneToOne: false;
							referencedRelation: "categories";
							referencedColumns: ["id"];
						},
						{
							foreignKeyName: "product_categories_product_id_fkey";
							columns: ["product_id"];
							isOneToOne: false;
							referencedRelation: "products";
							referencedColumns: ["id"];
						},
					];
				};
				product_subcategories: {
					Row: {
						created_at: string;
						product_id: string;
						subcategory_id: string;
					};
					Insert: {
						created_at?: string;
						product_id: string;
						subcategory_id: string;
					};
					Update: {
						created_at?: string;
						product_id?: string;
						subcategory_id?: string;
					};
					Relationships: [
						{
							foreignKeyName: "product_subcategories_product_id_fkey";
							columns: ["product_id"];
							isOneToOne: false;
							referencedRelation: "products";
							referencedColumns: ["id"];
						},
						{
							foreignKeyName: "product_subcategories_subcategory_id_fkey";
							columns: ["subcategory_id"];
							isOneToOne: false;
							referencedRelation: "sub_categories";
							referencedColumns: ["id"];
						},
					];
				};
				product_tags: {
					Row: {
						created_at: string;
						product_id: string;
						tag_id: string;
					};
					Insert: {
						created_at?: string;
						product_id: string;
						tag_id: string;
					};
					Update: {
						created_at?: string;
						product_id?: string;
						tag_id?: string;
					};
					Relationships: [
						{
							foreignKeyName: "product_tags_product_id_fkey";
							columns: ["product_id"];
							isOneToOne: false;
							referencedRelation: "products";
							referencedColumns: ["id"];
						},
						{
							foreignKeyName: "product_tags_tag_id_fkey";
							columns: ["tag_id"];
							isOneToOne: false;
							referencedRelation: "tags";
							referencedColumns: ["id"];
						},
					];
				};
				products: {
					Row: {
						attributes: { key: string; value: string }[] | null;
						brand: string;
						category: string;
						created_at: string;
						description: string;
						featured: boolean | null;
						frame_style: string | null;
						gender: string | null;
						has_variants: boolean;
						id: string;
						images: string[];
						instock: boolean | null;
						price: number;
						slug: string;
						sub_category: string;
						title: string;
						// biome-ignore lint/suspicious/noExplicitAny: <explanation>
						variants: any;
					};
					Insert: {
						attributes?: { key: string; value: string }[] | null;
						brand: string;
						category: string;
						created_at?: string;
						description: string;
						featured?: boolean | null;
						frame_style?: string | null;
						gender?: string | null;
						has_variants?: boolean;
						id?: string;
						images: string[];
						instock?: boolean | null;
						price?: number;
						slug: string;
						sub_category: string;
						title: string;

					};
					Update: {
						attributes?: { key: string; value: string }[] | null;
						brand?: string;
						category?: string;
						created_at?: string;
						description?: string;
						featured?: boolean | null;
						frame_style?: string | null;
						gender?: string | null;
						has_variants?: boolean;
						id?: string;
						images?: string[];
						instock?: boolean | null;
						price?: number;
						slug?: string;
						sub_category?: string;
						title?: string;
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
						variants?: any;
					};
					Relationships: [
						{
							foreignKeyName: "products_brand_fkey";
							columns: ["brand"];
							isOneToOne: false;
							referencedRelation: "brands";
							referencedColumns: ["id"];
						},
						{
							foreignKeyName: "products_category_fkey";
							columns: ["category"];
							isOneToOne: false;
							referencedRelation: "categories";
							referencedColumns: ["id"];
						},
						{
							foreignKeyName: "products_sub_category_fkey";
							columns: ["sub_category"];
							isOneToOne: false;
							referencedRelation: "sub_categories";
							referencedColumns: ["id"];
						},
					];
				};
				profiles: {
					Row: {
						email: string | null;
						first_name: string | null;
						id: string;
						last_name: string | null;
						updated_at: string | null;
					};
					Insert: {
						email?: string | null;
						first_name?: string | null;
						id: string;
						last_name?: string | null;
						updated_at?: string | null;
					};
					Update: {
						email?: string | null;
						first_name?: string | null;
						id?: string;
						last_name?: string | null;
						updated_at?: string | null;
					};
					Relationships: [
						{
							foreignKeyName: "profiles_id_fkey";
							columns: ["id"];
							isOneToOne: true;
							referencedRelation: "users";
							referencedColumns: ["id"];
						},
					];
				};
				size: {
					Row: {
						created_at: string;
						id: string;
						size_name: string;
					};
					Insert: {
						created_at?: string;
						id?: string;
						size_name: string;
					};
					Update: {
						created_at?: string;
						id?: string;
						size_name?: string;
					};
					Relationships: [];
				};
				sub_categories: {
					Row: {
						category: string;
						created_at: string;
						id: string;
						image_url: string;
						slug: string;
						title: string;
					};
					Insert: {
						category: string;
						created_at?: string;
						id?: string;
						image_url: string;
						slug: string;
						title: string;
					};
					Update: {
						category?: string;
						created_at?: string;
						id?: string;
						image_url?: string;
						slug?: string;
						title?: string;
					};
					Relationships: [
						{
							foreignKeyName: "sub_categories_category_fkey";
							columns: ["category"];
							isOneToOne: false;
							referencedRelation: "categories";
							referencedColumns: ["id"];
						},
					];
				};
				tags: {
					Row: {
						created_at: string;
						id: string;
						image_url: string;
						slug: string;
						title: string;
					};
					Insert: {
						created_at?: string;
						id?: string;
						image_url: string;
						slug: string;
						title: string;
					};
					Update: {
						created_at?: string;
						id?: string;
						image_url?: string;
						slug?: string;
						title?: string;
					};
					Relationships: [];
				};
			};
			Views: {
				[_ in never]: never;
			};
			Functions: {
				filter_products: {
					Args: {
						search_text: string;
					};
					Returns: {
						attributes: Json | null;
						brand: string;
						category: string;
						created_at: string;
						description: string;
						featured: boolean | null;
						frame_style: string | null;
						gender: string | null;
						has_variants: boolean;
						id: string;
						images: Json;
						instock: boolean | null;
						price: number;
						slug: string;
						sub_category: string;
						title: string;
						variants: Json | null;
					}[];
				};
				is_admin: {
					Args: Record<PropertyKey, never>;
					Returns: boolean;
				};
			};
			Enums: {
				[_ in never]: never;
			};
			CompositeTypes: {
				[_ in never]: never;
			};
		};
	};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema["Tables"] & PublicSchema["Views"])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
				Database[PublicTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
			Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
				PublicSchema["Views"])
		? (PublicSchema["Tables"] &
				PublicSchema["Views"])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	PublicTableNameOrOptions extends
		| keyof PublicSchema["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
		? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends
		| keyof PublicSchema["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
		? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	PublicEnumNameOrOptions extends
		| keyof PublicSchema["Enums"]
		| { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
		? PublicSchema["Enums"][PublicEnumNameOrOptions]
		: never;


