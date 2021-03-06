/* global describe, it, expect */
import webdriver from 'next-webdriver'
import { waitFor } from 'next-test-utils'

export default function (context) {
  describe('Render via browser', () => {
    it('should render the home page', async () => {
      const browser = await webdriver(context.port, '/')
      const text = await browser
        .elementByCss('#home-page p').text()

      expect(text).toBe('This is the home page')
      browser.close()
    })

    it('should do navigations via Link', async () => {
      const browser = await webdriver(context.port, '/')
      const text = await browser
        .elementByCss('#about-via-link').click()
        .waitForElementByCss('#about-page')
        .elementByCss('#about-page p').text()

      expect(text).toBe('This is the About page')
      browser.close()
    })

    it('should do navigations via Router', async () => {
      const browser = await webdriver(context.port, '/')
      const text = await browser
        .elementByCss('#about-via-router').click()
        .waitForElementByCss('#about-page')
        .elementByCss('#about-page p').text()

      expect(text).toBe('This is the About page')
      browser.close()
    })

    it('should do run client side javascript', async () => {
      const browser = await webdriver(context.port, '/')
      const text = await browser
        .elementByCss('#counter').click()
        .waitForElementByCss('#counter-page')
        .elementByCss('#counter-increase').click()
        .elementByCss('#counter-increase').click()
        .elementByCss('#counter-page p').text()

      expect(text).toBe('Counter: 2')
      browser.close()
    })

    it('should render pages using getInitialProps', async () => {
      const browser = await webdriver(context.port, '/')
      const text = await browser
        .elementByCss('#get-initial-props').click()
        .waitForElementByCss('#dynamic-page')
        .elementByCss('#dynamic-page p').text()

      expect(text).toBe('cool dynamic text')
      browser.close()
    })

    it('should render dynamic pages with custom urls', async () => {
      const browser = await webdriver(context.port, '/')
      const text = await browser
        .elementByCss('#dynamic-1').click()
        .waitForElementByCss('#dynamic-page')
        .elementByCss('#dynamic-page p').text()

      expect(text).toBe('next export is nice')
      browser.close()
    })

    it('should support client side naviagtion', async () => {
      const browser = await webdriver(context.port, '/')
      const text = await browser
        .elementByCss('#counter').click()
        .waitForElementByCss('#counter-page')
        .elementByCss('#counter-increase').click()
        .elementByCss('#counter-increase').click()
        .elementByCss('#counter-page p').text()

      expect(text).toBe('Counter: 2')

      // let's go back and come again to this page:
      const textNow = await browser
        .elementByCss('#go-back').click()
        .waitForElementByCss('#home-page')
        .elementByCss('#counter').click()
        .waitForElementByCss('#counter-page')
        .elementByCss('#counter-page p').text()

      expect(textNow).toBe('Counter: 2')

      browser.close()
    })

    it('should render dynamic import components in the client', async () => {
      const browser = await webdriver(context.port, '/')
      await browser
        .elementByCss('#dynamic-imports-page').click()
        .waitForElementByCss('#dynamic-imports-page')

      // Wait until browser loads the dynamic import chunk
      // TODO: We may need to find a better way to do this
      await waitFor(5000)

      const text = await browser
        .elementByCss('#dynamic-imports-page p').text()

      expect(text).toBe('Welcome to dynamic imports.')
      browser.close()
    })

    it('should render pages with url hash correctly', async () => {
      const browser = await webdriver(context.port, '/')

      // Check for the query string content
      const text = await browser
        .elementByCss('#with-hash').click()
        .waitForElementByCss('#dynamic-page')
        .elementByCss('#dynamic-page p').text()

      expect(text).toBe('zeit is awesome')

      // Check for the hash
      while (true) {
        const hashText = await browser
          .elementByCss('#hash').text()

        if (/cool/.test(hashText)) {
          break
        }
      }

      browser.close()
    })

    it('should navigate even if used a button inside <Link />', async () => {
      const browser = await webdriver(context.port, '/button-link')

      const text = await browser
        .elementByCss('button').click()
        .waitForElementByCss('#home-page')
        .elementByCss('#home-page p').text()

      expect(text).toBe('This is the home page')
      browser.close()
    })

    describe('pages in the nested level: level1', () => {
      it('should render the home page', async () => {
        const browser = await webdriver(context.port, '/')
        const text = await browser
          .elementByCss('#level1-home-page').click()
          .waitForElementByCss('#level1-home-page')
          .elementByCss('#level1-home-page p').text()

        expect(text).toBe('This is the Level1 home page')
        browser.close()
      })

      it('should render the about page', async () => {
        const browser = await webdriver(context.port, '/')
        const text = await browser
          .elementByCss('#level1-about-page').click()
          .waitForElementByCss('#level1-about-page')
          .elementByCss('#level1-about-page p').text()

        expect(text).toBe('This is the Level1 about page')
        browser.close()
      })
    })
  })
}
