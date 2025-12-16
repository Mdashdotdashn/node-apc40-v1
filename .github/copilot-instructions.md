- [x] Verify that the copilot-instructions.md file in the .github directory is created.

- [x] Clarify Project Requirements
	- Node.js module for Akai APC40 MIDI controller
	- Similar to launchpad-midi
	- TypeScript support with compiled JavaScript output

- [x] Scaffold the Project
	- Created project structure with src/, examples/, lib/ directories
	- Configured TypeScript with proper tsconfig.json
	- Setup npm scripts for build, dev, and testing

- [x] Customize the Project
	- Core APC40 class with event-based API
	- Constants for all LED notes, controller IDs, and colors
	- Utility functions for message parsing and building
	- MIDI message handling for buttons and controllers
	- Support for LED control with color and blinking support
	- LED ring type configuration for knobs

- [x] Install Required Extensions
	- No VS Code extensions required for this Node.js module

- [x] Compile the Project
	- TypeScript compiled successfully to lib/ directory
	- All type definitions generated (.d.ts files)
	- Source maps created for debugging

- [x] Create and Run Task
	- npm scripts configured: build, dev, test, example
	- Can be run with `npm run build` or `npm run dev`

- [x] Launch the Project
	- Examples provided in examples/ directory
	- Use `npm run build` to compile TypeScript
	- Use `node examples/basic.js` to run after building

- [x] Ensure Documentation is Complete
	- README.md with API documentation and examples
	- Clear constants exported for easy usage
	- Protocol reference included
