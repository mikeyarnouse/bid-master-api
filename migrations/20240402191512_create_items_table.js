/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("items", (table) => {
    table.increments("item_id").primary();
    table.string("name").notNullable();
    table.string("description").notNullable();
    table.string("image_key");
    table
      .string("image_url", 1000)
      .notNullable()
      .defaultTo("https://placehold.co/250");
    table.string("category").notNullable();
    table.integer("start_bid").notNullable().unsigned();
    table.integer("highest_bid").notNullable().unsigned();
    table.string("expiration_date").notNullable();
    table.string("expiration_time").notNullable();
    table
      .integer("user_id")
      .unsigned()
      .references("users.user_id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("items");
};
