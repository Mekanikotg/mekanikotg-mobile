// tailwind.config.js

module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      width: {
        "calc-vw-minus-10rem": "calc(90vw - 8rem)",
      },
    },
  },
  plugins: [
    async function myAsyncPlugin(css) {
      return new Promise((resolve, reject) => {
        // Asynchronous processing
        setTimeout(() => {
          // Process the CSS here
          resolve(); // Resolve the Promise when processing is done
        }, 1000); // Example: Simulating async behavior with setTimeout
      });
    }
  ],
};
