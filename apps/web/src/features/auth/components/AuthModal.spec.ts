import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import AuthModal from './AuthModal.vue'

enableAutoUnmount(afterEach)
afterEach(() => {
  document.body.innerHTML = ''
  document.body.style.overflow = ''
})
describe('AuthModal', () => {
  it('abre, encierra el foco, cierra con Escape y restaura página y foco', async () => {
    const opener = document.createElement('button')
    opener.inert = false
    document.body.append(opener)
    opener.focus()
    document.body.style.overflow = 'auto'
    const wrapper = mount(AuthModal, { props: { open: false }, attachTo: document.body })
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    await wrapper.setProps({ open: true })
    await nextTick()
    const close = document.querySelector<HTMLButtonElement>('.auth-close')!
    const submit = document.querySelector<HTMLButtonElement>('.login-submit')!
    expect(document.activeElement).toBe(close)
    expect(document.body.style.overflow).toBe('hidden')
    expect(opener.inert).toBe(true)
    close.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }))
    expect(document.activeElement).toBe(submit)
    submit.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }))
    expect(document.activeElement).toBe(close)
    opener.focus()
    expect(document.activeElement).toBe(close)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('close')).toHaveLength(1)
    await wrapper.setProps({ open: false })
    expect(document.activeElement).toBe(opener)
    expect(opener.inert).toBe(false)
    expect(document.body.style.overflow).toBe('auto')
    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })
  it('cierra con botón y fondo, y limpia al desmontar abierto', async () => {
    const wrapper = mount(AuthModal, { props: { open: true }, attachTo: document.body })
    await nextTick()
    document.querySelector<HTMLButtonElement>('.auth-close')!.click()
    document.querySelector<HTMLElement>('.auth-overlay')!.click()
    expect(wrapper.emitted('close')).toHaveLength(2)
    const emissions = wrapper.emitted('close')!
    wrapper.unmount()
    expect(document.body.style.overflow).toBe('')
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(emissions).toHaveLength(2)
  })
})
