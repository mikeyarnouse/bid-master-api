/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("bids", (table) => {
    table.increments("bid_id").primary();
    table.integer("amount").notNullable().unsigned();
    table.timestamp("timestamp").defaultTo(knex.fn.now());
    table
      .integer("user_id")
      .unsigned()
      .references("users.user_id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table
      .integer("item_id")
      .unsigned()
      .references("items.item_id")
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
  return knex.schema.dropTable("bids");
};
