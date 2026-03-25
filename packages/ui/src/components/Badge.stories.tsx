import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Violet: Story = { args: { children: "Ativo", color: "violet" } };
export const Green: Story = { args: { children: "Concluído", color: "green" } };
export const Yellow: Story = { args: { children: "Pendente", color: "yellow" } };
export const Red: Story = { args: { children: "Cancelado", color: "red" } };
