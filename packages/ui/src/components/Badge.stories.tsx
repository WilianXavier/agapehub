import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "select",
      options: ["brand", "success", "info", "warning", "error", "neutral", "tithe", "offer", "campaign", "donors"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Brand: Story    = { args: { children: "ÁgapeHub",  color: "brand"    } };
export const Success: Story  = { args: { children: "Concluído", color: "success"  } };
export const Info: Story     = { args: { children: "Em análise",color: "info"     } };
export const Warning: Story  = { args: { children: "Pendente",  color: "warning"  } };
export const Error: Story    = { args: { children: "Cancelado", color: "error"    } };
export const Neutral: Story  = { args: { children: "Rascunho",  color: "neutral"  } };
export const Tithe: Story    = { args: { children: "Dízimo",    color: "tithe"    } };
export const Offer: Story    = { args: { children: "Oferta",    color: "offer"    } };
export const Campaign: Story = { args: { children: "Campanha",  color: "campaign" } };
export const Donors: Story   = { args: { children: "Doador",    color: "donors"   } };
