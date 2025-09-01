# Search Screen Fixes - TODO List

## Files to Fix:
- [ ] src/screens/customer/home/SearchScreen.tsx
- [ ] src/components/customer/FilterModal.tsx

## SearchScreen.tsx Tasks:
- [ ] Remove duplicate Text import
- [ ] Fix category filtering logic to use actual categories
- [ ] Remove unused type parameter from useSearchFood hook
- [ ] Remove unused activeFilterCategory state or implement functionality
- [ ] Update filter button categories to match available categories

## FilterModal.tsx Tasks:
- [ ] Add props to receive current filter state
- [ ] Implement functionality to show relevant section based on activeFilterCategory
- [ ] Initialize state with current filter values

## Integration Tasks:
- [ ] Update SearchScreen to pass current filters to FilterModal
- [ ] Test the search and filtering functionality
