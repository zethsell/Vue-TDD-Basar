import { render, screen } from '@testing-library/vue'
import LoginPage from './LoginPage.vue'
import userEvent from '@testing-library/user-event'

describe('Login Page', () => {
  const setup = async () => {
    render(LoginPage)
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
    it('enables the button when email and pasword inputs are filled', async () => {
      await setup()
      const emailInput = screen.queryByLabelText('E-mail')
      const passwordInput = screen.queryByLabelText('Password')
      await userEvent.type(emailInput, 'user100@mail.com')
      await userEvent.type(passwordInput, 'P4ssoword')
      const button = screen.queryByRole('button', { name: 'Login' })
      expect(button).toBeEnabled()
    })
  })

})


