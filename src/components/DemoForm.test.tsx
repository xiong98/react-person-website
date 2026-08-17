import { describe, expect, it } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DemoForm } from '@/components/DemoForm'

describe('DemoForm', () => {
  it('使用 zod 校验非法邮箱并显示错误', async () => {
    render(<DemoForm />)
    fireEvent.change(screen.getByPlaceholderText('姓名'), { target: { value: '张三' } })
    fireEvent.change(screen.getByPlaceholderText('邮箱'), { target: { value: 'bad-email' } })
    fireEvent.click(screen.getByText('提交'))
    expect(await screen.findByText('邮箱格式不正确')).toBeInTheDocument()
  })
})
