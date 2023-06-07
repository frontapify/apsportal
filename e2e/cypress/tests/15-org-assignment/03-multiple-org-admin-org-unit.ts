import ApiDirectoryPage from '../../pageObjects/apiDirectory'
import HomePage from '../../pageObjects/home'
import LoginPage from '../../pageObjects/login'
import NamespaceAccessPage from '../../pageObjects/namespaceAccess'
import Products from '../../pageObjects/products'
import ServiceAccountsPage from '../../pageObjects/serviceAccounts'
import keycloakGroupPage from '../../pageObjects/keycloakGroup'
import AuthorizationProfile from '../../pageObjects/authProfile'
import keycloakUsersPage from '../../pageObjects/keycloakUsers'


describe('Give a user org admin access at organization unit level', () => {
  const user = new keycloakUsersPage()
  const groups = new keycloakGroupPage()

  before(() => {
    cy.visit(Cypress.env('KEYCLOAK_URL'))
    cy.deleteAllCookies()
    cy.reload()
  })

  beforeEach(() => {
    cy.preserveCookies()
    cy.fixture('developer').as('developer')
    cy.fixture('apiowner').as('apiowner')
    cy.fixture('state/regen').as('regen')
    cy.fixture('admin').as('admin')
  })

  it('Authenticates Admin owner', () => {
    cy.get('@admin').then(({ user }: any) => {
      cy.contains('Administration Console').click({force:true})
      cy.keycloakLogin(user.credentials.username, user.credentials.password)
    })
  })

  it('Navigate to User Groups', () => {
    groups.navigateToUserGroups()
  })

  it('Add another org unit', () => {
    cy.contains('ministry-of-health').click()
    cy.get('[id="createGroup"]').click()
    cy.get('[id="name"]').type('health-protection')
    cy.contains('Save').click()
  })

  it('Navigate to Users Page', () => {
    cy.contains('Users').click()
  })

  it('Search Wendy (Credential Issuer) from the user list', () => {
    cy.get('@apiowner').then(({ clientCredentials }: any) => {
      user.editUser(clientCredentials.Wendy.email)
    })
  })

  it('Navigate to Groups tab', () => {
    user.selectTab('Groups')
  })

  it('Reset any existing assoction', () => {
    user.resetAssociation()
  })

  it('Set the user(Wendy) to the Organization Unit', () => {
    user.setUserToOrganization('health-protection')
  })

  after(() => {
    cy.keycloakLogout()
    cy.clearLocalStorage({ log: true })
    cy.deleteAllCookies()
  })

})

describe('Multiple Org Admin for the organization', () => {
  const home = new HomePage()
  const na = new NamespaceAccessPage()
  const pd = new Products()
  const sa = new ServiceAccountsPage()
  const apiDir = new ApiDirectoryPage()

  before(() => {
    cy.visit('/')
    cy.deleteAllCookies()
    cy.reload()
    cy.resetState()
  })

  beforeEach(() => {
    cy.preserveCookies()
    cy.fixture('apiowner').as('apiowner')
    // cy.visit(login.path)
  })

  it('Authenticates api owner', () => {
    cy.get('@apiowner').then(({ user }: any) => {
      cy.login(user.credentials.username, user.credentials.password)
    })
  })

  it('Creates and activates new namespace', () => {
    cy.get('@apiowner').then(({ orgAssignmentOrgUnit }: any) => {
      home.createNamespace(orgAssignmentOrgUnit.namespace)
      // home.useNamespace(orgAssignmentMultipleAdmin.namespace)
    })
  })

  it('creates a new service account', () => {
    cy.visit(sa.path)
    cy.get('@apiowner').then(({ serviceAccount }: any) => {
      sa.createServiceAccount(serviceAccount.scopes)
    })
    sa.saveServiceAcctCreds()
  })


  it('creates as new product in the directory', () => {
    cy.visit(pd.path)
    cy.get('@apiowner').then(({ orgAssignmentOrgUnit }: any) => {
      pd.createNewProduct(orgAssignmentOrgUnit.product.name, orgAssignmentOrgUnit.product.environment.name)
    })
  })

  it('Assign organization to the created namespace', () => {
    cy.visit(apiDir.path)
    cy.get('@apiowner').then(({ product }: any) => {
      apiDir.addOrganizationAndOrgUnit(product)
    })
  })

  it('Verify that member(Wendy) set for org unit should not display in Organization group access', () => {
    cy.visit(na.path)
    cy.wait(2000)
    na.clickOnOrganizationGroupAccess()
    cy.get('@apiowner').then(({ orgAssignmentOrgUnit }: any) => {
    na.checkMembersForGroupAccess(orgAssignmentOrgUnit.GroupAccess.members)
    })
  })

  after(() => {
    cy.logout()
    cy.clearLocalStorage({ log: true })
    cy.deleteAllCookies()
  })
})
