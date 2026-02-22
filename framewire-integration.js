// framewire-integration.js
export default function framewireIntegration() {
  return {
    name: "framewire",
    hooks: {
      "astro:config:setup": ({ injectScript, command }) => {
        if (command === "dev") {
          injectScript(
            "page",
            `import loadFramewire from "/src/framewire.js";
             loadFramewire(true);`
          );
        }
      },
    },
  };
}