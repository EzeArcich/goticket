import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import LoginForm from './LoginForm.vue'

enableAutoUnmount(afterEach)
describe('LoginForm', () => {
  it('valida campos requeridos y asocia errores con los controles', async () => {
    const wrapper = mount(LoginForm, { attachTo: document.body })
    await wrapper.get('form').trigger('submit')
    for (const input of wrapper.findAll('input')) {
      expect(input.attributes('aria-invalid')).toBe('true')
      expect(document.getElementById(input.attributes('aria-describedby')!)).not.toBeNull()
    }
    expect(document.activeElement).toBe(wrapper.get('input[type="email"]').element)
    expect(wrapper.text()).toContain('Ingresá tu contraseña')
  })
  it('rechaza email inválido y comunica el alcance visual sin autenticar', async () => {
    const wrapper = mount(LoginForm)
    await wrapper.get('input[type="email"]').setValue('incorrecto')
    await wrapper.get('input[type="password"]').setValue('clave')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.text()).toContain('Ingresá un correo válido')
    expect(wrapper.find('[role="status"]').exists()).toBe(false)
    await wrapper.get('input[type="email"]').setValue('persona@example.com')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.findAll('[role="alert"]')).toHaveLength(0)
    expect(wrapper.get('[role="status"]').text()).toContain('próximamente')
    expect(wrapper.emitted('login')).toBeUndefined()
  })
  it('muestra y oculta contraseña y mantiene proveedores deshabilitados', async () => {
    const wrapper = mount(LoginForm)
    const toggle = wrapper.get('.password-toggle')
    await toggle.trigger('click')
    expect(wrapper.get('input[name="password"]').attributes('type')).toBe('text')
    expect(toggle.attributes('aria-pressed')).toBe('true')
    await toggle.trigger('click')
    expect(wrapper.get('input[name="password"]').attributes('type')).toBe('password')
    expect(toggle.attributes('aria-label')).toBe('Mostrar contraseña')
    expect(wrapper.findAll('.social-buttons button:disabled')).toHaveLength(2)
    expect(wrapper.find('a[href="#"]').exists()).toBe(false)
  })
  it('genera IDs únicos para formularios simultáneos', () => {
    const wrapper = mount({ components: { LoginForm }, template: '<LoginForm /><LoginForm />' })
    const ids = wrapper.findAll('[id]').map((node) => node.attributes('id'))
    expect(new Set(ids).size).toBe(ids.length)
    for (const label of wrapper.findAll('label')) {
      expect(ids).toContain(label.attributes('for'))
    }
  })
})
