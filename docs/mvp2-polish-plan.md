# MVP 2 Polish Plan

## Summary
Focus tonight on edge-fixing only: discover-page modal, borrowed/requested books, explicit-submit search, targeted cleanup, and tests for changed behavior.

## Key Changes
- Discover modal uses the existing `BookDetailModal` flow, but is visibly modal-shaped with a centered surface, close button, and loading/error states inside the frame.
- Borrow button creates a real `Pending` loan request. The backend derives `borrower_id` from auth and `owner_id` from the target book.
- Borrowed dashboard shows loans where the current user is `borrower_id`, including book and owner context.
- Navbar/search page is explicit-submit only. Typing does not navigate or query; Enter/button submit updates `/books/search?query=...`.
- Cleanup stays limited to touched modal, borrowed, search, and loan areas.

## Tests
- API tests cover authenticated loan creation, spoofed owner/borrower rejection by derivation, unauthenticated rejection, and owner-only status updates.
- Focused frontend tests cover explicit-submit search, borrowed list states, and modal frame/close behavior where practical.

## Assumptions
- Current phase is MVP 2 polish/demo prep.
- Nothing outside current task areas should be touched.
- No database migration unless the existing loan schema blocks the minimal borrowed/request flow.
- Accessibility is secondary to modal, borrowed flow, search, cleanup, and tests being stable.
