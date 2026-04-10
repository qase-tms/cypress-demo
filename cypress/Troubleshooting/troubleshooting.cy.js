import { qase } from "cypress-qase-reporter/mocha";
describe('Status Classification Demo', () => {

  // Should be FAILED - mirrors the #A18 scenario exactly
  // Cypress finds the element, but it has 0x0 dimensions, retries clicking, times out
  it('Test 1 - Should be FAILED: element found but not interactable', () => {
    cy.visit('https://example.com')
    // inject a hidden radio input into the page, just like the client's s-radio_input
    cy.document().then((doc) => {
      const input = doc.createElement('input')
      input.type = 'radio'
      input.style.width = '0px'
      input.style.height = '0px'
      input.style.overflow = 'hidden'
      doc.body.appendChild(input)
    })
    cy.get('input[type="radio"]').click() // finds it, can't click it, retries, times out
  })

  // Should be INVALID - genuine environment/setup failure
  // request to a non-existent endpoint, mirrors the cy.request() hook failures
  it('Test 2 - Should be INVALID: API request times out', () => {
    cy.request({
      url: 'https://httpstat.us/408', // returns 408 timeout
      timeout: 5000,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200) // will never get here
    })
  })

  // Should be FAILED - mirrors cy.wait() on intercept scenario like #F22
  // test runs, intercepts a route, waits for a call that never comes
  it('Test 3 - Should be FAILED: waited for API call that never happened', () => {
    cy.intercept('POST', '/api/v1/some-filter').as('filterQuery')
    cy.visit('https://example.com')
    // simulate clicking a filter - we just click something, the POST never fires
    cy.get('h1').click()
    cy.wait('@filterQuery') // times out because the intercepted call never happened
  })

})