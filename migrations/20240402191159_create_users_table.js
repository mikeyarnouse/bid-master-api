/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("user_id").primary();
    table.string("username").notNullable();
    table.string("password").notNullable();
    table.string("avatar_key");
    table
      .string("avatar_url", 2000)
      .notNullable()
      .defaultTo("https://picsum.photos/200");
    table.integer("balance").notNullable().defaultTo(0);
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.string("street_address").notNullable();
    table.string("city").notNullable();
    table.string("country").notNullable();
    table.string("phone_number").notNullable();
    table.string("email_address").notNullable();
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
  return knex.schema.dropTable("users");
};
