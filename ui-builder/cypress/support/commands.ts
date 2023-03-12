/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import "@4tw/cypress-drag-drop";
import Chainable = Cypress.Chainable;

function getDocumentScroll(): Chainable {
    return cy.document().then((document) => {
        if (document.scrollingElement) {
            const { scrollTop, scrollLeft } = document.scrollingElement;

            return {
                x: scrollTop,
                y: scrollLeft,
            };
        }

        return {
            x: 0,
            y: 0,
        };
    });
}

Cypress.Commands.add(
    "mouseMoveBy",
    {
        prevSubject: "element",
    },
    (subject, x: number, y: number, options?: { delay: number }) => {
        cy.wrap(subject, { log: false })
            .then((subject) => {
                const initialRect = subject.get(0).getBoundingClientRect();

                return getDocumentScroll().then(
                    (windowScroll) =>
                        [subject, initialRect, windowScroll] as const,
                );
            })
            .then(([subject, initialRect, initialWindowScroll]) => {
                cy.wrap(subject)
                    .trigger("mousedown", { force: true })
                    .wait(options?.delay ?? 300, {
                        log: Boolean(options?.delay),
                    })
                    .trigger("mousemove", {
                        force: true,
                        clientX: Math.floor(
                            initialRect.left + initialRect.width / 2 + x / 2,
                        ),
                        clientY: Math.floor(
                            initialRect.top + initialRect.height / 2 + y / 2,
                        ),
                    })
                    .trigger("mousemove", {
                        force: true,
                        clientX: Math.floor(
                            initialRect.left + initialRect.width / 2 + x,
                        ),
                        clientY: Math.floor(
                            initialRect.top + initialRect.height / 2 + y,
                        ),
                    })
                    .wait(300)
                    .trigger("mouseup", { force: true })
                    .wait(300)
                    .then((subject: any) => {
                        const finalRect = subject
                            .get(0)
                            .getBoundingClientRect();

                        return getDocumentScroll().then((windowScroll) => {
                            const windowScrollDelta = {
                                x: windowScroll.x - initialWindowScroll.x,
                                y: windowScroll.y - initialWindowScroll.y,
                            };

                            const delta = {
                                x: Math.round(
                                    finalRect.left -
                                        initialRect.left -
                                        windowScrollDelta.x,
                                ),
                                y: Math.round(
                                    finalRect.top -
                                        initialRect.top -
                                        windowScrollDelta.y,
                                ),
                            };

                            return [
                                subject,
                                { initialRect, finalRect, delta },
                            ] as const;
                        });
                    });
            });
    },
);
