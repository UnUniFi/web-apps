describe('DashBoard', () => {
  it('Visits the top page and Faucet page', () => {
    cy.visit('/');
    cy.contains('Account');
    cy.contains('Faucet');
    cy.contains('Balance');
    cy.contains('Network');

    cy.get('[role="navigation"]').contains('Faucet').click();
  });
});
