import SignUpPage from './SignUpPage.vue'
import { render, screen } from '@testing-library/vue'
import "@testing-library/jest-dom"

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
})