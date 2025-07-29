Pruebas de extremo a extremo implementadas en la aplicación

- Test de login

```typescript
describe("Login", () => {
  it("should login", () => {
    cy.visit("http://localhost:4200");

    cy.get('[data-cy="emailInput"]').focus().type("diego.baquero01@epn.edu.ec");
    cy.get('[data-cy="passwordInput"]').focus().type("Ola1234!");
    cy.get('[data-cy="loginButton"]').click();

    cy.url().should("not.include", "login");
  });
});
```

- Tests de botones de descarga de cada pantalla

```typescript
describe("Download page reports", () => {
  const routes = ["/docentes", "/asignaturas", "/carreras", "/numero_estudiantes_por_semestre", "/actividades"];

  routes.forEach((route) => {
    it(`should download reports for ${route}`, () => {
      cy.login();
      cy.visit(route);

      // Download XLSX report
      cy.contains("button", "Descargar Reporte").click();
      cy.contains("button", "Formato XLSX").click();
      cy.wait(1000);

      // Download PDF report
      cy.contains("button", "Descargar Reporte").click();
      cy.contains("button", "Formato PDF").click();
      cy.wait(1000);
    });
  });
});
```

- Tests de módulo global de reportes

```typescript
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
```
