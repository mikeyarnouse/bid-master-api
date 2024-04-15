/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    {
      user_id: 1,
      username: "john_doe",
      password: "password123",
      // avatar: "https://picsum.photos/200",
      balance: 1000,
      first_name: "John",
      last_name: "Doe",
      street_address: "123 Main St",
      city: "New York",
      country: "USA",
      phone_number: "+1 (646) 123-1234",
      email_address: "john.doe@example.com",
    },
    {
      user_id: 2,
      username: "jane_smith",
      password: "smith2022",
      // avatar: "https://picsum.photos/200",
      balance: 1000,
      first_name: "Jane",
      last_name: "Smith",
      street_address: "456 Oak Ave",
      city: "Los Angeles",
      country: "USA",
      phone_number: "+1 (213) 456-7890",
      email_address: "jane.smith@example.com",
    },
    {
      user_id: 3,
      username: "bob_jones",
      password: "pass1234",
      // avatar: "https://picsum.photos/200",
      balance: 1000,
      first_name: "Bob",
      last_name: "Jones",
      street_address: "789 Elm St",
      city: "Chicago",
      country: "USA",
      phone_number: "+1 (312) 555-6789",
      email_address: "bob.jones@example.com",
    },
  ]);
};
