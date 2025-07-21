describe("Download asignatures reports", () => {
  const routes = [
    "/docentes",
    "/asignaturas",
    "/carreras",
    "/numero_estudiantes_por_semestre",
    "/actividades",
  ];

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
