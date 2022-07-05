import { render, screen } from '@testing-library/vue'
import App from './App.vue'
import i18n from './locales/i18n'
import userEvent from '@testing-library/user-event'

const setup = (path) => {
  window.history.pushState({}, '', path)

  render(App, {
    global: {
      plugins: [i18n]
    }
  })
}

describe('Routing', () => {
  it.each`
  path         | pageTestId
  ${'/'}       | ${'home-page'}
  ${'/signup'} | ${'signup-page'}
  ${'/login'} | ${'login-page'}
  ${'/user/1'} | ${'user-page'}
  ${'/user/2'} | ${'user-page'}
  `('display $pageTestId when path is $path', ({ path, pageTestId }) => {
    setup(path)
    const page = screen.queryByTestId(pageTestId)
    expect(page).toBeInTheDocument()
  })

  it.each`
  path         | pageTestId
  ${'/'}       | ${'signup-page'}
  ${'/'}       | ${'login-page'}
  ${'/'}       | ${'user-page'}
  ${'/signup'} | ${'home-page'}
  ${'/signup'} | ${'login-page'}
  ${'/signup'} | ${'user-page'}
  ${'/login'}  | ${'home-page'}
  ${'/login'}  | ${'signup-page'}
  ${'/login'}  | ${'user-page'}
  ${'/user/1'} | ${'home-page'}
  ${'/user/1'} | ${'signup-page'}
  ${'/user/1'} | ${'login-page'}
  `('does not display $pageTestId when path is $path', ({ path, pageTestId }) => {
    setup(path)
    const page = screen.queryByTestId(pageTestId)
    expect(page).not.toBeInTheDocument()
  })

  it.each`
    targetPage
    ${'Home'}
    ${'Sign Up'}
    ${'Login'}
  `('has a link to $targetPage on Navbar', ({ targetPage }) => {
    setup('/')
    const link = screen.queryByRole('link', { name: targetPage })
    expect(link).toBeInTheDocument()
  })

  it.each`
  initialPath | clickingTo    | visiblePage
  ${'/'}      | ${'Sign Up'}  | ${'signup-page'}
  ${'/'}      | ${'Login'}    | ${'login-page'}
  ${'/signup'}| ${'Home'}     | ${'home-page'}
  `('displays  $visiblePage after clicking $clickingTo link',
    async ({ initialPath, visiblePage, clickingTo }) => {
      setup(initialPath)
      const link = screen.queryByRole('link', { name: clickingTo })
      await userEvent.click(link)
      const page = screen.queryByTestId(visiblePage)
      expect(page).toBeInTheDocument()
    })

  it('displays home page when clicking brand logo', async () => {
    setup('/login')
    const image = screen.queryByAltText('Home Logo')
    await userEvent.click(image)
    const page = screen.queryByTestId('home-page')
    expect(page).toBeInTheDocument()
  })

})
