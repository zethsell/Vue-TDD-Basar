import { render, screen } from '@testing-library/vue'
import LoginPage from './LoginPage.vue'

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

})


