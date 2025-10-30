# Sound Assets for Stack Rollercoaster Project

## Overview
This directory contains sound effects that enhance the user experience of the Stack Rollercoaster application. The sounds are designed to complement the visual animations and interactions, making the stack operations more engaging and intuitive.

## Sound Effects

1. **Ding Sound**
   - **File Name:** ding.mp3
   - **Description:** A cheerful sound played when a passenger successfully boards a rollercoaster car (push operation).
   - **Usage:** Triggered during the push operation to indicate a successful addition of a passenger.

2. **Whoosh Sound**
   - **File Name:** whoosh.mp3
   - **Description:** A swooshing sound effect played when a passenger disembarks from a rollercoaster car (pop operation).
   - **Usage:** Triggered during the pop operation to signify the removal of a passenger.

3. **Error Sound**
   - **File Name:** error.mp3
   - **Description:** A humorous "womp womp" sound played when an invalid operation is attempted, such as popping from an empty stack or pushing when the stack is not empty.
   - **Usage:** Triggered during error conditions to alert the user of invalid actions.

## Licensing
All sound effects used in this project are either created in-house or sourced from royalty-free sound libraries. Please ensure to check the licensing agreements for any third-party sounds used.

## Integration
To integrate these sounds into the application, ensure that the audio files are correctly referenced in the `audio.js` file, and that the appropriate sound effects are triggered during the respective stack operations.