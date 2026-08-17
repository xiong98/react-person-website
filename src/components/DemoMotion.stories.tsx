import type { Meta, StoryObj } from '@storybook/react-vite'
import { DemoMotion } from './DemoMotion'

const meta: Meta<typeof DemoMotion> = {
  title: 'Components/DemoMotion',
  component: DemoMotion,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DemoMotion>

export const Default: Story = {}
