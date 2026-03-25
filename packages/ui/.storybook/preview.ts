import type { Preview } from "@storybook/react";
import "../src/storybook.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "canvas",
      values: [
        { name: "canvas",  value: "rgb(252,252,252)" },
        { name: "surface", value: "rgb(245,245,245)" },
        { name: "dark",    value: "rgb(35,35,35)"    },
      ],
    },
  },
};

export default preview;
