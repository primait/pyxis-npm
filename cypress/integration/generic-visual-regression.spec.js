/// <reference types="cypress" />

const devices = [{ name: "iPhone6", width: 375, height: 667 }];

const pages = [
  {
    name: "Accordion",
    relativeURL: "src/test/accordions.html",
    visualRegressionTargetSelectors: [
      // We can target preexisting DOM or add test divs (e.g. to test for margins)
      '[data-test-id="visual-regression-target"]',
    ],
  },
];

pages.forEach((page) => {
  devices.forEach((device) => {
    const deviceString = `${device.name}-${device.width}x${device.height}`;
    const testLabel = `${page.name}-${Cypress.browser.displayName}-${deviceString}`;

    it(testLabel, function() {
      cy.visit(page.relativeURL);
      cy.viewport(device.width, device.height);

      page.visualRegressionTargetSelectors.forEach((target) => {
        cy.get(target).each((target) =>
          cy.get(target).toMatchImageSnapshot({ separator: "-" })
        );
      });
    });
  });
});
