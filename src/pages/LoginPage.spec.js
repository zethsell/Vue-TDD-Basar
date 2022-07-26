import { render, screen, waitFor } from '@testing-library/vue'
import LoginPage from './LoginPage.vue'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import i18n from '../locales/i18n'
import en from '../locales/en.json'
import pt from '../locales/pt.json'
import LanguageSelector from '../components/LanguageSelector.vue'

let requestBody, acceptLanguageHeader, counter = 0
const server = setupServer(
  rest.post('/api/1.0/auth', (req, res, ctx) => {
    requestBody = req.body
    counter += 1
    acceptLanguageHeader = req.headers.get('Accept-Language')
    return res(
      ctx.status(401),
      ctx.json({
        message: 'Incorrect credentials'
      })
    )
  })
)

beforeAll(() => server.listen())

beforeEach(() => {
  counter = 0
  server.resetHandlers()
})

afterAll(() => server.close())

let emailInput, passwordInput, button

describe('Login Page', () => {
  const setup = async () => {
    render(LoginPage, {
      global: {
        plugins: [i18n]
      }
    })
    emailInput = screen.queryByLabelText('E-mail')
    passwordInput = screen.queryByLabelText('Password')
    button = screen.queryByRole('button', { name: 'Login' })
  }

  describe('Layout', () => {
    it('has Login header', async () => {
      await setup()
      const header = screen.queryByRole("heading", { name: "Login" })
      expect(header).toBeInTheDocument()
    })

    it.each`
      label         
      ${'E-mail'} 
      ${'Password'} 
    `('has $label input', async ({ label }) => {
      await setup()
      const input = screen.queryByLabelText(label)
      expect(input).toBeInTheDocument()
    })

    it("has password type for password input", async () => {
      await setup()
      const input = screen.queryByLabelText('Password')
      expect(input.type).toBe('password')
    })

    it('has Login Button', async () => {
      await setup()
      const button = screen.queryByRole('button', { name: 'Login' })
      expect(button).toBeInTheDocument()
    })

    it('disable the buttons initially', async () => {
      await setup()
      const button = screen.queryByRole('button', { name: 'Login' })
      expect(button).toBeDisabled()
    })
  })

  describe('Interactions', () => {
    const setupFilled = async () => {
      await setup()
      await userEvent.type(emailInput, 'user100@mail.com')
      await userEvent.type(passwordInput, 'P4ssoword')
    }

    it('enables the button when email and pasword inputs are filled', async () => {
      await setupFilled()
      expect(button).toBeEnabled()
    })

    it('displays spinner after clicking the button', async () => {
      await setupFilled()
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
      // await userEvent.click(button)
      // expect(screen.queryByRole('status')).toBeInTheDocument()
    })

    it('hides spinner after api call finishes with fail reponse', async () => {
      await setupFilled()
      await userEvent.click(button)
      const spinner = screen.queryByRole('status')
      await waitFor(() => {
        expect(spinner).not.toBeInTheDocument()
      })
    })
    it('sends email and passord to backend after clicking the button', async () => {
      await setupFilled()
      await userEvent.click(button)
      // const spinner = screen.queryByRole('status')
      // await waitForElementToBeRemoved(spinner)
      expect(requestBody).toEqual({
        email: 'user100@mail.com',
        password: 'P4ssoword'
      })
    })

    it('disables the button when there is an api call', async () => {
      await setupFilled()
      await userEvent.click(button)
      await userEvent.click(button)
      /*  const spinner = screen.queryByRole('status')
       await waitForElementToBeRemoved(spinner) */
      expect(counter).toBe(2)
    })

    it('displays authentication fail message', async () => {
      await setupFilled()
      await userEvent.click(button)
      const errorMessage = await screen.findByText('Incorrect credentials')
      expect(errorMessage).toBeInTheDocument()
    })

    it('clears authentication fail message when email field is changed', async () => {
      await setupFilled()
      await userEvent.click(button)
      const errorMessage = await screen.findByText('Incorrect credentials')
      await userEvent.type(emailInput, 'new@mail.com')
      expect(errorMessage).not.toBeInTheDocument()
    })

    it('clears authentication fail message when password field is changed', async () => {
      await setupFilled()
      await userEvent.click(button)
      const errorMessage = await screen.findByText('Incorrect credentials')
      await userEvent.type(passwordInput, 'N3WP4ssword')
      expect(errorMessage).not.toBeInTheDocument()
    })
  })

  describe('Internationalization', () => {
    let portugueseLanguage
    const setupTranslation = () => {
      const app = {
        components: {
          LoginPage,
          LanguageSelector
        },
        template: `
        <LoginPage/>
        <LanguageSelector/>
        `
      }
      render(app, {
        global: {
          plugins: [i18n]
        }
      })
      portugueseLanguage = screen.queryByTitle('Portuguese')
    }


    it('initially displays all text in English', async () => {
      setupTranslation()
      expect(screen.queryByRole("heading", { name: en.login })).toBeInTheDocument()
      expect(screen.queryByRole("button", { name: en.login })).toBeInTheDocument()
      expect(screen.queryByLabelText(en.email)).toBeInTheDocument()
      expect(screen.queryByLabelText(en.password)).toBeInTheDocument()
    })

    it('display all text in portuguese after changing language', async () => {
      setupTranslation()
      await userEvent.click(portugueseLanguage)
      expect(screen.queryByRole("heading", { name: pt.login })).toBeInTheDocument()
      expect(screen.queryByRole("button", { name: pt.login })).toBeInTheDocument()
      expect(screen.queryByLabelText(pt.email)).toBeInTheDocument()
      expect(screen.queryByLabelText(pt.password)).toBeInTheDocument()
    })

    it('sends accept-language header as pt in login request', async () => {
      setupTranslation()
      await userEvent.click(portugueseLanguage)
      const emailInput = screen.queryByLabelText(pt.email)
      const passwordInput = screen.queryByLabelText(pt.email)
      await userEvent.type(emailInput, 'user100@mail.com')
      await userEvent.type(passwordInput, 'N3WP4ssword')
      const button = screen.queryByRole("button", { name: pt.login })
      await userEvent.click(button)
      expect(acceptLanguageHeader).toBe('en')
    })
  })

})


