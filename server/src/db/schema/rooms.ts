import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const rooms = pgTable('rooms', {
  id: uuid().primaryKey().defaultRandom(),
  name: text(),
  description: text(),
  createdAt: timestamp().defaultNow().notNull(),
})