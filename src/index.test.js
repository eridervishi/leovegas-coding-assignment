jest.mock("react-dom/client", () => ({
    createRoot: jest.fn(() => ({
        render: jest.fn(),
    })),
}));

describe("index.js", () => {
    it("renders without crashing", () => {
        // Create a div to serve as the root
        const root = document.createElement("div");
        root.id = "root";
        document.body.appendChild(root);

        // Run the index.js code
        require("./index.js");

        // Get the mocked createRoot function
        const { createRoot } = require("react-dom/client");

        // Check if createRoot was called
        expect(createRoot).toHaveBeenCalled();

        // Check if render was called
        const mockRoot = createRoot.mock.results[0].value;
        expect(mockRoot.render).toHaveBeenCalled();
    });
});