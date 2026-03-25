import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "ghost", "danger"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    loading: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { children: "Doar agora", variant: "primary" } };
export const Secondary: Story = { args: { children: "Saiba mais", variant: "secondary" } };
export const Ghost: Story = { args: { children: "Cancelar", variant: "ghost" } };
export const Danger: Story = { args: { children: "Excluir", variant: "danger" } };
export const Loading: Story = { args: { children: "Carregando...", loading: true } };
export const Large: Story = { args: { children: "Criar campanha", size: "lg" } };
