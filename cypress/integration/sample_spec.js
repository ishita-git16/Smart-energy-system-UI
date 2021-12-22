// sample_spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

//  test case:1
// describe("My First Test", () => {
//   it("Does not do much!", () => {
//     expect(true).to.equal(true);
//   });
// });

//  test case:2
// describe("My First Test", () => {
//   it("Visits the Kitchen Sink", () => {
//     cy.visit("http://localhost:3000/");
//     cy.contains("Login");
//   });
// });
//  test case:3
describe("My First Test", () => {
  it('clicks the link "Login"', () => {
    cy.visit("http://localhost:3000/");

    cy.contains("Login").click();
  });
});
//test case:4
describe("My First Test", () => {
  it('clicks the link "Login"', () => {
    cy.visit("http://localhost:3000/");

    cy.contains("Login").click();
    // Get an input, type into it and verify that the value has been updated
    cy.get(".username").type("smarti").should("have.value", "smarti");
  });
});
