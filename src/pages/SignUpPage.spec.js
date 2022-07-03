import SignUpPage from './SignUpPage.vue'
import { render, screen, waitFor } from '@testing-library/vue'
import "@testing-library/jest-dom"
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { rest } from 'msw'

describe('SignUpPage', () => {
  describe("Layout", () => {
    it('has Sign Up Header', () => {
      render(SignUpPage)
      const header = screen.queryByRole('heading', { name: 'Sign Up' })
      expect(header).toBeInTheDocument()
    })
    it("has username input", () => {
      render(SignUpPage)
      const input = screen.queryByLabelText('Username')
      expect(input).toBeInTheDocument()
    })
    it("has email input", () => {
      render(SignUpPage)
      const input = screen.queryByLabelText('E-mail')
      expect(input).toBeInTheDocument()
    })
    it("has password input", () => {
      render(SignUpPage)
      const input = screen.queryByLabelText('Password')
      expect(input).toBeInTheDocument()
    })
    it("has password type for password input", () => {
      render(SignUpPage)
      const input = screen.queryByLabelText('Password')
      expect(input.type).toBe('password')
    })
    it("has password repeat input", () => {
      render(SignUpPage)
      const input = screen.queryByLabelText('Password Repeat')
      expect(input).toBeInTheDocument()
    })
    it("has password repeat type for password input", () => {
      render(SignUpPage)
      const input = screen.queryByLabelText('Password Repeat')
      expect(input.type).toBe('password')
    })
    it('has Sign Up Button', () => {
      render(SignUpPage)
      const button = screen.queryByRole('button', { name: 'Sign Up' })
      expect(button).toBeInTheDocument()
    })
    it('disable the buttons initially', () => {
      render(SignUpPage)
      const button = screen.queryByRole('button', { name: 'Sign Up' })
      expect(button).toBeDisabled()
    })
  })
  describe('Interaction', () => {
    let requestBody
    let counter = 0
    let button, passwordInput, passwordRepeatInput, usernameInput, emailInput
    const server = setupServer(
      rest.post('/api/1.0/users', (req, res, ctx) => {
        requestBody = req.body
        counter += 1
        return res(ctx.status(200))
      })
    )

    beforeAll(() => server.listen())

    beforeEach(() => {
      counter = 0
      server.resetHandlers()
    })

    afterAll(() => server.close())

    const setup = async () => {
      render(SignUpPage)
      usernameInput = screen.queryByLabelText('Username')
      emailInput = screen.queryByLabelText('E-mail')
      passwordInput = screen.queryByLabelText('Password')
      passwordRepeatInput = screen.queryByLabelText('Password Repeat')
      button = screen.queryByRole('button', { name: 'Sign Up' })
      await userEvent.type(usernameInput, "user1")
      await userEvent.type(emailInput, "user1@mail.com")
      await userEvent.type(passwordInput, "P4ssword")
      await userEvent.type(passwordRepeatInput, "P4ssword")
    }

    const generateValidationError = (field, message) => {
      return rest.post('/api/1.0/users', (req, res, ctx) => {
        return res(ctx.status(400), ctx.json({
          validationErrors: {
            [field]: message
          }
        }))
      })
    }

    it('enables the button when the password and password resets matchs', async () => {
      await setup()
      expect(button).toBeEnabled()
    })
    it('send username, email and password to backend after clicking the button', async () => {
      await setup()
      await userEvent.click(button)
      await screen.findByText("Please check your e-mail to activate your account")
      expect(requestBody).toEqual({
        username: 'user1',
        email: 'user1@mail.com',
        password: 'P4ssword',
      })
    })
    it('does not allow clickng to the button when there is an ongoing api call', async () => {
      await setup()
      await userEvent.click(button)
      await userEvent.click(button)
      await screen.findByText("Please check your e-mail to activate your account")
      expect(counter).toBe(1)
    })
    /* it('display spinner while the api request in progress', async () => {
      await setup()
      await userEvent.click(button)
      const spinner = screen.queryByRole("status")
      expect(spinner).toBeInTheDocument()
    }) */
    it('does not display spinner when there is no api request', async () => {
      await setup()
      const spinner = screen.queryByRole('status')
      expect(spinner).not.toBeInTheDocument()
    })
    it('display account activavtion information after successful sign up request', async () => {
      await setup()
      await userEvent.click(button)
      const text = await screen.findByText("Please check your e-mail to activate your account")
      expect(text).toBeInTheDocument()
    })
    it("does not display account activation message before sign up request", async () => {
      await setup()
      const text = await screen.queryByText("Please check your e-mail to activate your account")
      expect(text).not.toBeInTheDocument()
    })
    it('does not display account activavtion information after failing sign up request', async () => {
      server.use(
        rest.post('/api/1.0/users', (req, res, ctx) => {
          return res(ctx.status(400))
        })
      )
      await setup()
      await userEvent.click(button)
      const text = screen.queryByText("Please check your e-mail to activate your account")
      expect(text).not.toBeInTheDocument()
    })
    it('hides sign up from after successful sign up request', async () => {
      await setup()
      const form = screen.queryByTestId('form-sign-up')
      await userEvent.click(button)
      await waitFor(() => {
        expect(form).not.toBeInTheDocument()
      })
    })
    it.each`
      field         | message
      ${'username'} | ${'Username cannot be null'}
      ${'email'}    | ${'E-mail cannot be null'}
      ${'password'} | ${'Password cannot be null'}
    `('displays $message for field $field', async ({ field, message }) => {
      server.use(generateValidationError(field, message))
      await setup()
      await userEvent.click(button)
      const text = await screen.findByText(message)
      expect(text).toBeInTheDocument()
    })
    it('hides spinner after error response received', async () => {
      server.use(generateValidationError('username', 'Username cannot be null'))
      await setup()
      await userEvent.click(button)
      await screen.findByText("Username cannot be null")
      const spinner = screen.queryByRole('status')
      expect(spinner).not.toBeInTheDocument()
    })
    it('enables the button after error response received', async () => {
      server.use(generateValidationError('username', 'Username cannot be null'))
      await setup()
      await userEvent.click(button)
      await screen.findByText("Username cannot be null")
      expect(button).toBeEnabled()
    })
    it('display mismatch message for password repeat input', async () => {
      await setup()
      await userEvent.type(passwordInput, "P4ss1")
      await userEvent.type(passwordRepeatInput, "P4ss2")
      const text = await screen.findByText("Password mismatch")
      expect(text).toBeInTheDocument()
    })
    it.each`
      field         | message                      | label
      ${'username'} | ${'Username cannot be null'} | ${'Username'}
      ${'email'}    | ${'E-mail cannot be null'}   | ${'E-mail'}
      ${'password'} | ${'Password cannot be null'} | ${'Password'} 
    `('clear validation error after field $field is updated', async ({ field, message, label }) => {
      server.use(generateValidationError(field, message))
      await setup()
      await userEvent.click(button)
      const text = await screen.findByText(message)
      const input = screen.queryByLabelText(label)
      await userEvent.type(input, "updated")
      expect(text).not.toBeInTheDocument()
    })
  })
})