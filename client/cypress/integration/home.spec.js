describe('Home page test', () => {

    beforeEach(() => {
        cy.on("window:before:load", win => {
            win.fetch = null;
        });
        cy.server();
        cy.route({
            url: 'http://localhost:3001/api/calendar/list',
            response: 'fixture:calendarList',
            delay: 1000
        }).as('calendarList');
        cy.route({
            url: 'http://localhost:3001/api/calendar/custom/*/subjects',
            response: 'fixture:subjects',
            delay: 1000
        }).as('subjects');
    });

    it('Allows selecting elements', () => {
        cy.visit('/');
        cy.viewport('iphone-6');
        cy.wait('@calendarList');
        cy.contains('Sélectionner des calendriers').parent().children().should('have.length', 1);
        cy.get('header button').should('be.disabled');
        cy.contains('Option disciplinaire').click();
        cy.contains('Parcours S2D').should('exist').click();
        cy.contains('Parcours APN').should('exist').click();
        cy.contains('Sélectionner des calendriers').parent()
            .children().should('have.length', 2)
            .last().should('have.text', '2 calendriers sélectionnés');
        cy.get('header button').should('not.be.disabled');
        cy.contains('Filtrer les matières pour la sélection').should('exist')
            .parent('div').find('button').click()
        cy.wait('@subjects');
        cy.contains('Terminer').should('exist').click()
        cy.get('header input[type=checkbox]').should('exist').wait(1000).click();
        cy.contains('Filtrer les matières pour la sélection').should('not.exist');
        cy.get('header button').should('be.disabled');
    })
});