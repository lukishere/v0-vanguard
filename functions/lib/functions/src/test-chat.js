"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("firebase/functions");
const app_1 = require("firebase/app");
// Your Firebase configuration
const firebaseConfig = {
    // Add your Firebase config here
    projectId: 'v0-vanguard',
    // Add other config values as needed
};
// Initialize Firebase
const app = (0, app_1.initializeApp)(firebaseConfig);
const functions = (0, functions_1.getFunctions)(app);
// Test the chat function
async function testChat() {
    try {
        const chatFunction = (0, functions_1.httpsCallable)(functions, 'chat');
        const result = await chatFunction({
            message: "What services does VANGUARD offer?",
            context: []
        });
        console.log('Response:', result.data);
    }
    catch (error) {
        console.error('Error:', error);
    }
}
// Run the test
testChat();
//# sourceMappingURL=test-chat.js.map