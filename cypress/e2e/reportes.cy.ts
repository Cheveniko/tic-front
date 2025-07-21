describe("Download global reports", () => {
  it(`should download semester's reports`, () => {
    cy.login();
    cy.visit("/reportes");

    // Verify the presence of the table
    cy.get("mat-table").should("exist");

    // Iterate through each row in the table
    cy.get("mat-row").each(($row) => {
      // Click the Excel download button
      cy.wrap($row).find('button[data-cy^="excel"]').focus().click();

      // Click the PDF download button
      cy.wrap($row).find('button[data-cy^="pdf"]').focus().click();
    });
  });
});

describe("Download filtered semester report", () => {
  it(`should download 2025-A filtered report`, () => {
    cy.login();
    cy.visit("/reportes");

    // Verify the presence of the table
    cy.get("mat-table").should("exist");

    cy.get('button[data-cy="visualize-2025-A"]').focus().click();
    cy.get('button[data-cy="filtros"]').focus().click();
    cy.get('[data-cy="materia"]').focus().type("programación I");

    cy.get('button[data-cy="descargar-reporte"]').focus().click();
    cy.contains("button", "Formato XLSX").click();

    cy.wait(1000);

    cy.get('button[data-cy="descargar-reporte"]').focus().click();
    cy.contains("button", "Formato PDF").click();
  });
});
