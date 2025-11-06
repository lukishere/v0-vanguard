# CopilotKit Testing Documentation

## Overview
This document provides comprehensive testing setup and troubleshooting for CopilotKit integration in the v0-vanguard project.

## Current Status: ✅ BASIC FUNCTIONALITY WORKING - Multiple Issues Pending Resolution

### Issue Resolution Summary
**Original Problem**: CopilotKit was showing "[Network] No Content" error due to GraphQL/runtime mismatch.

**Root Cause**: CopilotKit uses a specific GraphQL-based runtime system, not simple REST API calls.

**Solution Implemented**: Custom Gemini integration that bypasses CopilotKit's built-in adapters and handles GraphQL operations directly.

### ✅ RESOLVED ISSUES

#### 1. GraphQL Protocol Mismatch
**Status**: ✅ FIXED
**Solution**: Implemented custom GraphQL handler for CopilotKit operations

#### 2. Gemini Model Compatibility
**Status**: ✅ FIXED
**Problem**: `gemini-pro` model returned 404 error from v1beta API
**Solution**: Changed to `gemini-1.5-flash` model

#### 3. Message Content Extraction
**Status**: ✅ FIXED
**Problem**: CopilotKit sends messages with nested `textMessage.content` structure
**Solution**: Updated parsing to handle `lastMessage?.textMessage?.content`
**Verification**: User's actual question "What services does VANGUARD offer?" now extracted correctly

### 🔄 PENDING ISSUES - MARKED FOR SYSTEMATIC RESOLUTION

#### 1. Frontend forEach Error (CRITICAL)
**Status**: ✅ COMPLETELY FIXED
**Problem**: Multiple content format issues causing display and JavaScript errors
**Root Cause**: CopilotKit expected specific content array format for proper display and `.join()` method calls
**Solution Applied**: Updated API response structure through iterative fixes:
- ✅ Added `__typename: "TextMessageOutput"` for message type discrimination
- ✅ Changed from `response: {...}` to `messages: [...]` array structure
- ✅ Fixed content format to array of strings: `["response text here"]`
- ✅ Added empty `metaEvents: []` array to prevent forEach errors
- ✅ Maintained all existing functionality and usage tracking
**Final Resolution**: 
- ✅ No more forEach errors in browser console
- ✅ No more "[object Object]" display issues
- ✅ Content displays correctly as readable text
- ✅ Chat functionality fully preserved
**Priority**: HIGH - User experience restored

#### 2. Missing Operations Support
**Status**: 🔴 PENDING FIX
**Problem**: CopilotKit makes `availableAgents` operation that returns "UNSUPPORTED OPERATION"
**Impact**: Agent discovery functionality missing
**Required Fix**: Implement handler for `availableAgents` GraphQL operation
**Priority**: MEDIUM - Feature completeness

#### 3. Local Model Loading Performance
**Status**: 🔴 PENDING FIX
**Problem**: CopilotKit tries loading `all-MiniLM-L6-v2` embedding model, gets 404 errors
**Impact**: ~3 second response times, missing semantic search capabilities
**Required Fix**: Either provide local embedding model or disable embedding features
**Priority**: MEDIUM - Performance optimization

#### 4. Response Structure Compliance
**Status**: 🔴 PENDING FIX
**Problem**: Current simple response doesn't match CopilotKit's full GraphQL schema expectations
**Impact**: Potential compatibility issues with advanced features
**Required Fix**: Implement complete GraphQL response schema
**Priority**: MEDIUM - Future compatibility

## Setup Instructions

### 1. Environment Configuration
Create or update your `.env.local` file:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Required Packages
The following packages should be installed:
```bash
npm install @copilotkit/react-core @copilotkit/react-ui @copilotkit/react-textarea @google/generative-ai
```

### 3. API Endpoint Status
The API endpoint at `/api/copilotkit/route.ts` currently:
- ✅ Uses your Gemini API key directly
- ✅ Handles CopilotKit's GraphQL operations
- ✅ Processes chat messages through Gemini 1.5 Flash model
- ✅ Extracts user messages correctly
- ⚠️ Returns simplified response structure (pending full GraphQL compliance)

## Testing the Integration

### 1. Start Development Server
```bash
npm run dev
```

### 2. Test API Endpoint
You can test the API directly:
```bash
curl -X POST http://localhost:3000/api/copilotkit/ \
  -H "Content-Type: application/json" \
  -d '{
    "operationName": "generateCopilotResponse",
    "variables": {
      "data": {
        "messages": [
          {
            "textMessage": {
              "content": "Hello, can you help me?",
              "role": "user"
            }
          }
        ]
      }
    }
  }'
```

### 3. Test Frontend Integration
Navigate to your CopilotKit test pages:
- `/copilot-test` - Advanced test with rich UI
- `/copilot-simple` - Basic test page

**Current Behavior**: 
- ✅ Chat processes user input correctly
- ✅ Gemini generates appropriate responses
- ✅ No browser console errors (all display issues resolved)
- ✅ Content displays properly as readable text
- ✅ No "[object Object]" or forEach errors

## Architecture

### Custom Gemini Integration
Instead of using CopilotKit's built-in adapters (which don't support Gemini), we created a custom integration that:

1. **Receives GraphQL Queries**: Handles CopilotKit's standard GraphQL operations
2. **Processes with Gemini**: Uses Google's Generative AI SDK to process messages
3. **Returns Compatible Format**: Formats responses for CopilotKit (simplified structure)

### Key Components
- **API Route**: `/app/api/copilotkit/route.ts` - Custom Gemini integration with extensive debugging
- **Frontend Components**: CopilotKit React components for UI
- **Test Pages**: Multiple test environments for different scenarios

## Current Working Features

### ✅ What Works Now
- Basic chat functionality with Gemini AI
- User message extraction and processing
- Proper API key integration (no OpenAI required)
- GraphQL request handling
- Response generation and delivery
- Multiple test environments

### ⚠️ What Has Issues
- Advanced CopilotKit features (agents, embeddings) - 🔴 PENDING
- Response time optimization - 🔴 PENDING  
- Additional GraphQL operations support - 🔴 PENDING

## Debugging Information

### Debug Mode
The API includes extensive logging. Check your terminal/console for:
- Incoming request structure analysis
- Message extraction attempts
- Gemini API calls and responses
- Response formatting details

### Console Output Example
```
=== COPILOTKIT REQUEST DEBUG ===
Operation: generateCopilotResponse
Found messages: 2
Last message: {"textMessage":{"content":"What services does VANGUARD offer?","role":"user"}}
Final message content: What services does VANGUARD offer?
=== GEMINI RESPONSE ===
Generated response: [Gemini's actual response]
```

## Next Steps for Resolution

### Immediate Priority (HIGH)
1. ✅ **Fixed forEach Error**: Implemented proper GraphQL response structure
2. ✅ **Verified Error Resolution**: All frontend errors eliminated and functionality confirmed

### Medium Priority
1. **Add availableAgents Operation**: Implement agent discovery functionality
2. **Optimize Performance**: Address embedding model loading issues
3. **Complete GraphQL Schema**: Implement full response structure compliance

### Low Priority
1. **Add Advanced Features**: Implement additional CopilotKit operations as needed
2. **Performance Monitoring**: Add metrics and monitoring for response times
3. **Error Handling**: Improve error messages and fallback behaviors

## Troubleshooting

### Common Issues

#### "Gemini API key not configured"
**Solution**: Ensure `GEMINI_API_KEY` is set in your `.env.local` file

#### "models/gemini-pro is not found"
**Status**: ✅ RESOLVED - Now using `gemini-1.5-flash`

#### CORS Issues
**Status**: ✅ RESOLVED - API includes proper CORS headers

#### forEach Error in Browser Console
**Status**: ✅ RESOLVED - GraphQL response structure updated

### Debug Checklist
- [ ] Check `.env.local` has `GEMINI_API_KEY`
- [ ] Verify API endpoint responds to test requests
- [ ] Check browser console for specific error messages
- [ ] Review terminal logs for API processing details
- [ ] Test with different message formats if needed 