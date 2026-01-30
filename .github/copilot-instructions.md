# GitHub Copilot Instructions for hello-you

## CRITICAL: NO ASSUMPTIONS, EVER

**There is no other way. Read the documentation. Period.**

### Mandatory Requirements for ALL Code Changes

1. **READ THE DOCUMENTATION FIRST**
   - Before writing ANY code, read the official documentation for the tool/API/library
   - Quote the specific section of documentation that supports your implementation
   - If you cannot find documentation, DO NOT PROCEED

2. **NO ASSUMPTIONS, NO INVENTIONS**
   - Do not assume how an API works
   - Do not invent field names, parameters, or behaviors
   - Do not guess at configurations
   - If you don't know, READ THE DOCS

3. **VERIFY AGAINST SPECIFICATIONS**
   - Compare your proposed code against the official specification
   - Check that field names match exactly what the API returns
   - Verify that flags and parameters exist in the documentation
   - Confirm behavior matches what is documented

4. **LOOK AT ACTUAL OUTPUT**
   - When you have error logs or API responses, READ THEM
   - Use the actual field names from the actual output
   - Do not transform or guess - use what is actually there

5. **EXAMINE EXISTING CODE FOR ASSUMPTIONS**
   - Look for places where assumptions may have been made
   - Check if existing code matches what the documentation says
   - Question everything - working code might be built on wrong assumptions

## Specifications Exist for Everything

Specifications exist for every tool, library, and API we will ever use. There is no excuse not to read them.

**If you are proposing a code change and cannot point to documentation that proves it is correct, STOP.**

## When You Don't Know Something

1. **SAY SO** - "I need to check the documentation for this"
2. **FIND THE DOCS** - Use fetch_webpage to get the official documentation
3. **READ THOROUGHLY** - Don't skim, read the whole section
4. **VERIFY** - Confirm your understanding matches the documentation
5. **CITE** - Reference the specific doc section in your response

## No AI Slop

- No generic advice
- No invented best practices
- No "typically" or "usually" or "generally"
- No assumptions about how things "should" work
- Only what the documentation explicitly states

## Remember

**Documentation is truth. Your assumptions are lies.**

**There is no other way.**
