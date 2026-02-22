# Teacher Portal Routing - Testing & Verification Guide

## Quick Start Testing

### Step 1: Access Teacher Portal
1. Navigate to `/teacher-dashboard` in your browser
2. Verify you're logged in as a teacher user
3. Verify the sidebar appears on the left with all menu items
4. Verify the page title shows "Welcome, [Teacher Name]!"

### Step 2: Test Each Menu Button

#### Button 1: Home
- **Expected Path:** `/teacher-dashboard`
- **Test:** Click "Home" button in sidebar
- **Verify:** 
  - Page navigates to `/teacher-dashboard`
  - "Home" button is highlighted in orange
  - ChevronRight icon appears next to "Home"
  - Page title shows "Welcome, [Teacher Name]!"
  - Console shows: `[TeacherPortalLayout] Navigating to: /teacher-dashboard (Home)`

#### Button 2: My Profile
- **Expected Path:** `/teacher-profile`
- **Test:** Click "My Profile" button in sidebar
- **Verify:**
  - Page navigates to `/teacher-profile`
  - "My Profile" button is highlighted in orange
  - Page title shows "My Profile"
  - Console shows: `[TeacherPortalLayout] Navigating to: /teacher-profile (My Profile)`

#### Button 3: Demo Management
- **Expected Path:** `/teacher-demo-management`
- **Test:** Click "Demo Management" button in sidebar
- **Verify:**
  - Page navigates to `/teacher-demo-management`
  - "Demo Management" button is highlighted in orange
  - Page title shows "Demo Management"
  - Console shows: `[TeacherPortalLayout] Navigating to: /teacher-demo-management (Demo Management)`

#### Button 4: Curriculum
- **Expected Path:** `/teacher-curriculum`
- **Test:** Click "Curriculum" button in sidebar
- **Verify:**
  - Page navigates to `/teacher-curriculum`
  - "Curriculum" button is highlighted in orange
  - Page title shows "Curriculum"
  - Console shows: `[TeacherPortalLayout] Navigating to: /teacher-curriculum (Curriculum)`

#### Button 5: Class Management
- **Expected Path:** `/teacher-class-management`
- **Test:** Click "Class Management" button in sidebar
- **Verify:**
  - Page navigates to `/teacher-class-management`
  - "Class Management" button is highlighted in orange
  - Page title shows "Class Management"
  - Console shows: `[TeacherPortalLayout] Navigating to: /teacher-class-management (Class Management)`

#### Button 6: Renewal
- **Expected Path:** `/teacher-renewal`
- **Test:** Click "Renewal" button in sidebar
- **Verify:**
  - Page navigates to `/teacher-renewal`
  - "Renewal" button is highlighted in orange
  - Page title shows "Renewal"
  - Console shows: `[TeacherPortalLayout] Navigating to: /teacher-renewal (Renewal)`

#### Button 7: My Training
- **Expected Path:** `/teacher-my-training`
- **Test:** Click "My Training" button in sidebar
- **Verify:**
  - Page navigates to `/teacher-my-training`
  - "My Training" button is highlighted in orange
  - Page title shows "My Training"
  - Console shows: `[TeacherPortalLayout] Navigating to: /teacher-my-training (My Training)`

#### Button 8: Audit
- **Expected Path:** `/teacher-audit`
- **Test:** Click "Audit" button in sidebar
- **Verify:**
  - Page navigates to `/teacher-audit`
  - "Audit" button is highlighted in orange
  - Page title shows "Audit"
  - Console shows: `[TeacherPortalLayout] Navigating to: /teacher-audit (Audit)`

#### Button 9: Performance
- **Expected Path:** `/teacher-performance`
- **Test:** Click "Performance" button in sidebar
- **Verify:**
  - Page navigates to `/teacher-performance`
  - "Performance" button is highlighted in orange
  - Page title shows "Performance"
  - Console shows: `[TeacherPortalLayout] Navigating to: /teacher-performance (Performance)`

#### Button 10: Payout
- **Expected Path:** `/teacher-payout`
- **Test:** Click "Payout" button in sidebar
- **Verify:**
  - Page navigates to `/teacher-payout`
  - "Payout" button is highlighted in orange
  - Page title shows "Payout"
  - Console shows: `[TeacherPortalLayout] Navigating to: /teacher-payout (Payout)`

#### Button 11: Leave Management
- **Expected Path:** `/teacher-leave-management`
- **Test:** Click "Leave Management" button in sidebar
- **Verify:**
  - Page navigates to `/teacher-leave-management`
  - "Leave Management" button is highlighted in orange
  - Page title shows "Leave Management"
  - Console shows: `[TeacherPortalLayout] Navigating to: /teacher-leave-management (Leave Management)`

#### Button 12: Others
- **Expected Path:** `/teacher-others`
- **Test:** Click "Others" button in sidebar
- **Verify:**
  - Page navigates to `/teacher-others`
  - "Others" button is highlighted in orange
  - Page title shows "Others"
  - Console shows: `[TeacherPortalLayout] Navigating to: /teacher-others (Others)`

#### Button 13: Help & Support
- **Expected Path:** `/teacher-help-support`
- **Test:** Click "Help & Support" button in sidebar
- **Verify:**
  - Page navigates to `/teacher-help-support`
  - "Help & Support" button is highlighted in orange
  - Page title shows "Help & Support"
  - Console shows: `[TeacherPortalLayout] Navigating to: /teacher-help-support (Help & Support)`

## Advanced Testing

### Test 1: Active Menu Highlighting
**Objective:** Verify active menu item highlighting works correctly

**Steps:**
1. Navigate to `/teacher-profile`
2. Verify "My Profile" button is highlighted in orange
3. Verify ChevronRight icon appears next to "My Profile"
4. Click "Curriculum" button
5. Verify "Curriculum" button is now highlighted
6. Verify "My Profile" button is no longer highlighted
7. Repeat for all 13 menu items

**Expected Result:** Only the current page's menu item is highlighted

### Test 2: Navigation Sequence
**Objective:** Verify navigation works in any sequence

**Steps:**
1. Start at `/teacher-dashboard` (Home)
2. Click "Payout" → verify navigation to `/teacher-payout`
3. Click "Audit" → verify navigation to `/teacher-audit`
4. Click "My Profile" → verify navigation to `/teacher-profile`
5. Click "Help & Support" → verify navigation to `/teacher-help-support`
6. Click "Home" → verify navigation back to `/teacher-dashboard`

**Expected Result:** Navigation works in any order without errors

### Test 3: Sidebar Persistence
**Objective:** Verify sidebar remains visible and functional after navigation

**Steps:**
1. Start at `/teacher-dashboard`
2. Click "My Profile"
3. Verify sidebar is still visible
4. Click "Curriculum"
5. Verify sidebar is still visible
6. Verify all menu items are still clickable

**Expected Result:** Sidebar remains visible and functional on all pages

### Test 4: Logout Functionality
**Objective:** Verify logout button works correctly

**Steps:**
1. Navigate to any teacher portal page
2. Click "Logout" button at bottom of sidebar
3. Verify redirect to home page (`/`)
4. Verify user is logged out
5. Try to access `/teacher-profile` directly
6. Verify redirect to `/login`

**Expected Result:** Logout works correctly and redirects to home

### Test 5: Role Protection
**Objective:** Verify non-teachers cannot access portal pages

**Steps:**
1. Log in as a non-teacher user (student or admin)
2. Try to navigate to `/teacher-profile`
3. Verify redirect to `/login`
4. Check console for role validation message
5. Log in as a teacher
6. Verify access to `/teacher-profile`

**Expected Result:** Only teachers can access teacher portal pages

### Test 6: Console Logging
**Objective:** Verify all navigation events are logged

**Steps:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Navigate to `/teacher-dashboard`
4. Verify console shows: `[TeacherPortalLayout] ✓ Role validation passed`
5. Click "My Profile"
6. Verify console shows: `[TeacherPortalLayout] Navigating to: /teacher-profile (My Profile)`
7. Click "Curriculum"
8. Verify console shows: `[TeacherPortalLayout] Navigating to: /teacher-curriculum (Curriculum)`

**Expected Result:** All navigation events are logged with correct paths and labels

### Test 7: No Console Errors
**Objective:** Verify no errors appear in console

**Steps:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Clear console
4. Navigate through all 13 menu items
5. Check console for any errors (red messages)
6. Check console for any warnings (yellow messages)

**Expected Result:** No errors or warnings in console

### Test 8: Page Load Performance
**Objective:** Verify pages load quickly without freezing

**Steps:**
1. Open DevTools Network tab
2. Navigate to `/teacher-profile`
3. Verify page loads in < 1 second
4. Click "Curriculum"
5. Verify page loads in < 1 second
6. Repeat for all menu items

**Expected Result:** All pages load quickly without freezing

### Test 9: Responsive Design - Desktop
**Objective:** Verify layout works on desktop (1920x1080)

**Steps:**
1. Set browser to 1920x1080 resolution
2. Navigate to `/teacher-dashboard`
3. Verify sidebar is fully visible on left
4. Verify main content area is properly sized
5. Verify all menu items are visible without scrolling
6. Click each menu item and verify layout remains correct

**Expected Result:** Layout works correctly on desktop

### Test 10: Responsive Design - Tablet
**Objective:** Verify layout works on tablet (768x1024)

**Steps:**
1. Set browser to 768x1024 resolution (or use DevTools tablet view)
2. Navigate to `/teacher-dashboard`
3. Verify sidebar is visible
4. Verify main content area is properly sized
5. Verify menu items may need scrolling
6. Scroll sidebar and verify all items are accessible
7. Click each menu item and verify navigation works

**Expected Result:** Layout works correctly on tablet with scrolling

### Test 11: Responsive Design - Mobile
**Objective:** Verify layout works on mobile (375x667)

**Steps:**
1. Set browser to 375x667 resolution (or use DevTools mobile view)
2. Navigate to `/teacher-dashboard`
3. Verify sidebar is visible (may be narrower)
4. Verify main content area is properly sized
5. Verify menu items need scrolling
6. Scroll sidebar and verify all items are accessible
7. Click each menu item and verify navigation works
8. Verify text is readable without zooming

**Expected Result:** Layout works correctly on mobile with proper scrolling

### Test 12: Browser Compatibility
**Objective:** Verify routing works in different browsers

**Browsers to Test:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Steps for Each Browser:**
1. Navigate to `/teacher-dashboard`
2. Click 5 random menu items
3. Verify navigation works
4. Verify active highlighting works
5. Check console for errors

**Expected Result:** Routing works in all major browsers

## Troubleshooting Guide

### Issue: Button doesn't navigate
**Symptoms:** Click button but page doesn't change

**Diagnosis:**
1. Check console for errors
2. Verify path in menuItems array matches Router.tsx
3. Verify user is logged in as teacher
4. Check browser DevTools Network tab for failed requests

**Solutions:**
1. Verify path spelling matches exactly (case-sensitive)
2. Verify route exists in Router.tsx
3. Verify user role is 'teacher'
4. Clear browser cache and reload

### Issue: Active highlight not working
**Symptoms:** Menu item not highlighted when on that page

**Diagnosis:**
1. Check location.pathname in DevTools
2. Verify path matches menuItems array
3. Check if page title updates correctly

**Solutions:**
1. Verify exact path match (including leading slash)
2. Check Router.tsx for correct path
3. Verify component is using TeacherPortalLayout

### Issue: Console errors
**Symptoms:** Red errors appear in console

**Diagnosis:**
1. Read error message carefully
2. Check if error is related to navigation
3. Check if error is related to imports

**Solutions:**
1. Verify all imports are correct
2. Verify Router.tsx has all routes
3. Verify component exports are correct
4. Clear cache and reload

### Issue: Sidebar not visible
**Symptoms:** Sidebar doesn't appear on page

**Diagnosis:**
1. Check if page is using TeacherPortalLayout
2. Check CSS classes
3. Check browser zoom level

**Solutions:**
1. Verify page component uses TeacherPortalLayout
2. Verify CSS classes are correct
3. Reset browser zoom to 100%
4. Check if sidebar is off-screen (check width)

### Issue: Logout doesn't work
**Symptoms:** Click logout but stay on page

**Diagnosis:**
1. Check console for errors
2. Verify logout function is called
3. Check authStore for logout method

**Solutions:**
1. Verify authStore has logout method
2. Verify navigate('/') is called
3. Check if user data is cleared

## Performance Metrics

### Expected Performance
- Page load time: < 1 second
- Navigation time: < 500ms
- Active highlight update: < 100ms
- Console log time: < 50ms

### How to Measure
1. Open DevTools Performance tab
2. Record while navigating
3. Check timeline for bottlenecks
4. Verify metrics are within expected ranges

## Sign-Off Checklist

### Navigation Testing
- [ ] All 13 menu items navigate correctly
- [ ] Active menu highlighting works
- [ ] ChevronRight icon appears on active item
- [ ] No buttons freeze or become unresponsive
- [ ] No blank pages appear

### Functionality Testing
- [ ] Sidebar remains visible after navigation
- [ ] Page content loads correctly
- [ ] Logout button works
- [ ] User profile section displays correctly
- [ ] Role protection works

### Console Testing
- [ ] No console errors
- [ ] Navigation logs show correct paths
- [ ] Role validation logs appear
- [ ] Active menu detection logs appear

### Responsive Testing
- [ ] Desktop layout works (1920x1080)
- [ ] Tablet layout works (768x1024)
- [ ] Mobile layout works (375x667)
- [ ] All buttons clickable on all sizes

### Browser Testing
- [ ] Chrome works
- [ ] Firefox works
- [ ] Safari works
- [ ] Edge works

### Performance Testing
- [ ] Pages load in < 1 second
- [ ] Navigation is smooth
- [ ] No lag or freezing
- [ ] Console logs don't impact performance

## Final Verification

Once all tests pass, the Teacher Portal routing is ready for production:

✅ **All 13 menu items navigate correctly**
✅ **Active menu item highlighting works**
✅ **No console errors**
✅ **No buttons freeze or show blank pages**
✅ **Sidebar works from all teacher portal pages**
✅ **Role protection works**
✅ **Responsive design works on all devices**
✅ **Works in all major browsers**

## Sign-Off

**Tested By:** [Your Name]
**Date:** [Date]
**Status:** ✅ PASSED / ❌ FAILED

**Notes:**
[Add any notes or issues found]

---

**Ready for Production:** ✅ YES / ❌ NO
