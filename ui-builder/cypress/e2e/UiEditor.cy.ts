describe("UiEditor", () => {
    it("Drags and Drops multiple components", () => {
        cy.visit(
            "http://localhost:6006/iframe.html?id=page-builder--basic&viewMode=story",
        );

        cy.get("[data-draggable=\"HtmlElement\"]").mouseMoveBy(600, -100);
        cy.wait(300)
            .get("[data-draggable=\"HtmlElement\"]")
            .mouseMoveBy(600, 100);
    });
});
