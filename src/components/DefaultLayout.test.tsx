import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { DefaultLayout } from '@/components/DefaultLayout'

vi.mock('@tanstack/react-router', () => ({
  Outlet: () => <div data-testid="outlet" />,
}))

afterEach(() => {
  delete document.documentElement.dataset.pch5
  document.documentElement.removeAttribute('data-theme')
})

describe('DefaultLayout', () => {
  it('H5 模式按钮切换 html 的 data-pch5 属性', () => {
    render(<DefaultLayout />)
    expect(document.documentElement.dataset.pch5).toBeUndefined()

    fireEvent.click(screen.getByText('h5模式'))
    expect(document.documentElement.dataset.pch5).toBe('')

    fireEvent.click(screen.getByText('h5模式'))
    expect(document.documentElement.dataset.pch5).toBeUndefined()
  })

  it('主题按钮切换 html 的 data-theme 属性', () => {
    render(<DefaultLayout />)
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false)

    fireEvent.click(screen.getByText('🌙 深色'))
    expect(document.documentElement.dataset.theme).toBe('dark')

    fireEvent.click(screen.getByText('☀️ 浅色'))
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false)
  })
})
