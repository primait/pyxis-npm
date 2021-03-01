/// <reference types="cypress" />

const devices = new Map(
  Object.entries({
    iPhone6: { width: 375, height: 667 },
  })
);

describe("Accordion", {}, function() {
  for (let [deviceName, deviceSpecs] of devices) {
    const deviceString = `${deviceName}-${deviceSpecs.width}x${deviceSpecs.height}`;
    const testLabel = `${Cypress.browser.displayName}-${deviceString}`;

    it(`Should match baseline (${testLabel})`, function() {
      cy.visit("http://0.0.0.0:8080/src/test/accordions.html");
      cy.viewport(deviceSpecs.width, deviceSpecs.height);
      cy.get(".accordion-group").each((ag, i) =>
        cy.get(ag).toMatchImageSnapshot()
      );
    });
  }
});
