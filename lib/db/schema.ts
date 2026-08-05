import { primaryKey } from "drizzle-orm/pg-core";
import { boolean, integer, jsonb, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compositePk: primaryKey({ columns: [account.provider, account.providerAccountId] }),
  }),
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compositePk: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const profiles = pgTable("profiles", {
  id: text("id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  phone: text("phone"),
  email: text("email"),
  name: text("name"),
  role: text("role").notNull().default("client"),
  accountType: text("account_type").notNull().default("free"),
  accountStatus: text("account_status").notNull().default("active"),
  credits: integer("credits").notNull().default(0),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  alias: text("alias").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  street: text("street").notNull(),
  city: text("city").notNull(),
  state: text("state"),
  zipCode: text("zip_code"),
  country: text("country").notNull().default("CO"),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  shortDescription: text("short_description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: numeric("original_price", { precision: 10, scale: 2 }),
  productType: text("product_type").notNull().default("digital"),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  tags: text("tags").array().default([]),
  images: text("images").array().default([]),
  stock: integer("stock").default(-1),
  features: jsonb("features").default([]),
  specifications: jsonb("specifications").default({}),
  metadata: jsonb("metadata").default({}),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  badge: text("badge"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const productVariants = pgTable("product_variants", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  priceAdjustment: numeric("price_adjustment", { precision: 10, scale: 2 }).default("0"),
  stock: integer("stock").default(-1),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const carts = pgTable("carts", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: text("profile_id").notNull().unique().references(() => profiles.id, { onDelete: "cascade" }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const cartItems = pgTable("cart_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  cartId: uuid("cart_id").notNull().references(() => carts.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
  quantity: integer("quantity").notNull().default(1),
  priceSnapshot: numeric("price_snapshot", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").notNull().default("pending"),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: numeric("tax", { precision: 10, scale: 2 }).default("0"),
  shippingCost: numeric("shipping_cost", { precision: 10, scale: 2 }).default("0"),
  discount: numeric("discount", { precision: 10, scale: 2 }).default("0"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("COP"),
  wompiTransactionId: text("wompi_transaction_id"),
  wompiReference: text("wompi_reference"),
  wompiStatus: text("wompi_status"),
  wompiPaymentMethod: text("wompi_payment_method"),
  wompiPaymentMethodType: text("wompi_payment_method_type"),
  wompiProcessorResponse: text("wompi_processor_response"),
  paymentStatus: text("payment_status").default("pending"),
  billingAddressId: uuid("billing_address_id").references(() => addresses.id),
  shippingAddressId: uuid("shipping_address_id").references(() => addresses.id),
  notes: text("notes"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id),
  variantId: uuid("variant_id").references(() => productVariants.id),
  productName: text("product_name").notNull(),
  productSlug: text("product_slug").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const serviceSlots = pgTable("service_slots", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  durationMinutes: integer("duration_minutes").notNull().default(60),
  maxCapacity: integer("max_capacity").default(1),
  bufferMinutes: integer("buffer_minutes").default(15),
  isActive: boolean("is_active").default(true),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const serviceAvailability = pgTable("service_availability", {
  id: uuid("id").primaryKey().defaultRandom(),
  slotId: uuid("slot_id").notNull().references(() => serviceSlots.id, { onDelete: "cascade" }),
  dayOfWeek: integer("day_of_week").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  isActive: boolean("is_active").default(true),
});

export const appointments = pgTable("appointments", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  slotId: uuid("slot_id").notNull().references(() => serviceSlots.id),
  orderItemId: uuid("order_item_id").references(() => orderItems.id, { onDelete: "set null" }),
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }).notNull(),
  status: text("status").notNull().default("scheduled"),
  notes: text("notes"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Etapas del pipeline visible en el Kanban de /admin/proyectos.
// Reutiliza el vocabulario que ya consume app/client-dashboard/projects/[id]/page.tsx
// (statusConfig) para no romper esa vista con un segundo set de valores.
// "maintenance" es una etapa posterior a la entrega (soporte continuo), no
// una parada más del pipeline lineal — se muestra aparte en el Kanban.
export const PROJECT_STATUSES = [
  "planning", // Cotizado
  "design", // En diseño
  "development", // En desarrollo
  "testing", // Revisión
  "completed", // Entregado
  "maintenance", // Mantenimiento (post-entrega)
  "paused",
  "cancelled",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const KANBAN_COLUMNS: { status: ProjectStatus; label: string }[] = [
  { status: "planning", label: "Cotizado" },
  { status: "design", label: "En diseño" },
  { status: "development", label: "En desarrollo" },
  { status: "testing", label: "Revisión" },
  { status: "completed", label: "Entregado" },
  { status: "maintenance", label: "Mantenimiento" },
];

// El catálogo de 7 tipos de servicio (con su ícono e IconKind animado) vive
// en components/shared/service-type.ts — única fuente de verdad, para no
// duplicar la lista aquí de nuevo.

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").default("planning"),
  serviceType: text("service_type").notNull().default("other"),
  // Ícono elegido a mano (uno de los 7 de components/shared/service-type.ts).
  // Si es null, la UI cae de vuelta al ícono que corresponde a serviceType.
  icon: text("icon"),
  clientId: text("client_id").references(() => profiles.id, { onDelete: "cascade" }),
  images: text("images").array().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const quotes = pgTable("quotes", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  projectType: text("project_type").notNull(),
  description: text("description").notNull(),
  budget: text("budget"),
  timeline: text("timeline"),
  techReqs: text("tech_reqs"),
  status: text("status").notNull().default("pending"),
  adminNotes: text("admin_notes"),
  // Toda cotización crea de una vez su proyecto en el pipeline (etapa
  // "planning" = tarjeta roja); este vínculo permite rastrear cuál es.
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const meetingRequests = pgTable("meeting_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  description: text("description"),
  preferredDate: timestamp("preferred_date", { withTimezone: true }),
  status: text("status").notNull().default("pending"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Las 3 ramas del árbol de habilidades que ve el cliente en
// components/client/ProjectPipeline.tsx. Cada fase pertenece a una sola rama.
export const PROJECT_TRACKS = ["planning", "development", "quality", "maintenance"] as const;
export type ProjectTrack = (typeof PROJECT_TRACKS)[number];

export const projectPhases = pgTable("project_phases", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  order: integer("order").notNull().default(0),
  status: text("status").notNull().default("pending"),
  track: text("track").notNull().default("development"),
  startDate: timestamp("start_date", { withTimezone: true }),
  endDate: timestamp("end_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const phaseTasks = pgTable("phase_tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  phaseId: uuid("phase_id").notNull().references(() => projectPhases.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  // Uno de los "key" de components/shared/task-icons.ts, elegido a mano por
  // el admin al crear la tarea. Si es null, el árbol usa un ícono genérico.
  icon: text("icon"),
  completed: boolean("completed").default(false),
  assignedTo: text("assigned_to").references(() => profiles.id),
  dueDate: timestamp("due_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Desglose de una tarea en pasos concretos. El admin las agrega libremente
// (de a 3, según necesite) para que la rama de esa tarea siga creciendo en
// el árbol. No gatillan el desbloqueo global — solo son detalle bajo su tarea.
export const phaseTaskSubtasks = pgTable("phase_task_subtasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskId: uuid("task_id").notNull().references(() => phaseTasks.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  completed: boolean("completed").default(false),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// @deprecated: reemplazada por phaseTasks (tarea ligada a una fase de projectPhases).
// Ya no se escribe ni se lee desde ninguna ruta; se conserva la tabla en la DB
// por ahora, se elimina en una migración posterior una vez confirmado que no
// queda ningún consumidor.
export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion"),
  estado: text("estado").default("pendiente"),
  prioridad: text("prioridad").default("media"),
  categoria: text("categoria").notNull(),
  finalizada: boolean("finalizada").default(false),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }),
  assignedTo: text("assigned_to").references(() => profiles.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const projectSuggestions = pgTable("project_suggestions", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const bugReports = pgTable("bug_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  profileId: text("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  severity: text("severity").notNull().default("medium"),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Bóveda de credenciales por cliente/proyecto (tokens de API, contraseñas de
// hosting, claves de terceros, etc.). El valor NUNCA se guarda en texto
// plano: se cifra con AES-256-GCM en lib/crypto/secrets.ts antes de llegar
// aquí. `value`/`iv`/`authTag` van en base64. Solo admin/team pueden leer
// o escribir esta tabla (ver lib/auth/require-admin.ts).
export const clientSecrets = pgTable("client_secrets", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: text("client_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  label: text("label").notNull(),
  value: text("value").notNull(),
  iv: text("iv").notNull(),
  authTag: text("auth_tag").notNull(),
  notes: text("notes"),
  createdBy: text("created_by").references(() => profiles.id, { onDelete: "set null" }),
  lastRevealedAt: timestamp("last_revealed_at", { withTimezone: true }),
  lastRevealedBy: text("last_revealed_by").references(() => profiles.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
