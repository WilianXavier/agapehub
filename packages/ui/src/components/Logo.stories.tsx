import type { Meta, StoryObj } from "@storybook/react";
import { Logo } from "./Logo";

const meta: Meta<typeof Logo> = {
  title: "UI/Logo",
  component: Logo,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const Default: Story = { args: { size: "md", variant: "full" } };
export const Large: Story = { args: { size: "lg", variant: "full" } };
export const IconOnly: Story = { args: { size: "md", variant: "icon" } };
