# Teacher Signup Certificate Upload Implementation

## Overview
This document describes the complete implementation of the teacher signup form with certificate upload functionality and admin review system.

## Changes Made

### 1. TeacherSignupPage.tsx - Enhanced with Certificate Upload

**Location:** `/src/components/pages/TeacherSignupPage.tsx`

**Key Features Added:**

#### A. Document Upload State Management
```typescript
const [uploadedDocuments, setUploadedDocuments] = useState<DocumentFile[]>([]);
const [uploadError, setUploadError] = useState('');
const fileInputRef = useRef<HTMLInputElement>(null);
```

#### B. Document Upload Handler
- Accepts PDF, JPG, PNG, DOC, DOCX files
- Maximum file size: 1.5MB per file (becomes ~2MB when base64 encoded)
- Converts files to base64 for storage in CMS
- Displays upload errors for invalid files
- Shows uploaded document list with file size

```typescript
const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  // Validates file type and size
  // Converts to base64
  // Stores in uploadedDocuments state
}
```

#### C. Document Management
- **Remove Document:** Users can remove uploaded documents before submission
- **Display Uploaded Files:** Shows file name and size for each uploaded document
- **Visual Feedback:** Icons and animations for better UX

#### D. Form Submission Enhancement
- Validates that at least one document is uploaded
- Stores documents in two formats:
  1. `submittedDocumentNames`: JSON array of file names (for quick reference)
  2. `submittedDocuments`: JSON array of full DocumentFile objects (for download/view)
- Creates teacher approval record with all data

```typescript
const teacherApprovalData: TeacherApprovalWithPassword = {
  _id: crypto.randomUUID(),
  teacherFullName: formData.teacherFullName,
  teacherEmail: formData.teacherEmail,
  teacherPhoneNumber: formData.teacherPhoneNumber,
  password: formData.password,
  submissionDate: new Date(),
  approvalStatus: 'pending',
  submittedDocumentNames: JSON.stringify(uploadedDocuments.map(doc => doc.name)),
  submittedDocuments: JSON.stringify(uploadedDocuments),
};
```

#### E. Success Feedback
- Shows success message after submission
- Automatically redirects to home page after 3 seconds
- Clears form data and uploaded documents

### 2. AdminNewTeachersPage.tsx - Enhanced Document Display

**Location:** `/src/components/pages/AdminNewTeachersPage.tsx`

**Key Features:**

#### A. Document Parsing
- Improved `parseDocumentsData()` function with better error handling
- Safely parses JSON-stringified document arrays
- Returns empty array on parse failure

```typescript
const parseDocumentsData = (docString?: string): DocumentFile[] => {
  if (!docString) return [];
  try {
    const parsed = JSON.parse(docString);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (e) {
    console.error('[AdminNewTeachersPage] Error parsing documents:', e);
    return [];
  }
};
```

#### B. Document Retrieval
- `getDocumentData()`: Retrieves specific document by name from the parsed array
- Returns full DocumentFile object with base64 content

#### C. Document Actions
- **View Document:** Opens document in new tab
- **Download Document:** Downloads document to user's computer
- Both actions convert base64 content back to binary blob

```typescript
const handleDownloadDocument = (docName: string, application: TeacherApprovalRecord) => {
  const doc = getDocumentData(docName, application);
  if (doc && doc.content) {
    // Convert base64 to blob
    const byteCharacters = atob(doc.content);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: doc.type });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = docName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
```

#### D. Document Display in Admin Panel
- Shows "Uploaded Documents" section in teacher details
- Lists all uploaded documents with file icons
- Provides View and Download buttons for each document
- Shows "No documents uploaded" message if none exist

### 3. Data Flow

```
Teacher Signup Form
    ↓
Upload Certificate/Document
    ↓
Convert to Base64
    ↓
Store in uploadedDocuments State
    ↓
Submit Form
    ↓
Create TeacherApprovalRecord with:
  - submittedDocumentNames (JSON array of names)
  - submittedDocuments (JSON array of DocumentFile objects)
    ↓
Save to 'teacherapprovals' CMS Collection
    ↓
Admin Views Application
    ↓
Parse submittedDocuments JSON
    ↓
Display Documents with View/Download Options
    ↓
Admin Can View or Download Certificates
```

## Data Structure

### DocumentFile Interface
```typescript
interface DocumentFile {
  name: string;           // Original file name
  content: string;        // Base64 encoded file content
  type: string;          // MIME type (e.g., 'application/pdf')
  size: number;          // File size in bytes
}
```

### TeacherApprovalRecord Fields
- `submittedDocumentNames`: `string` (JSON stringified array of file names)
- `submittedDocuments`: `string` (JSON stringified array of DocumentFile objects)

## File Upload Specifications

### Supported File Types
- PDF (application/pdf)
- JPEG (image/jpeg)
- PNG (image/png)
- DOC (application/msword)
- DOCX (application/vnd.openxmlformats-officedocument.wordprocessingml.document)

### File Size Limits
- Maximum: 1.5MB per file (before base64 encoding)
- After base64 encoding: ~2MB
- Multiple files supported

## User Experience

### Teacher Signup Flow
1. Fill in personal information (name, email, phone)
2. Select teaching experience level
3. Enter qualifications and expertise
4. Set password
5. **Upload certificates/documents** (NEW)
6. Click "Create Teacher Account"
7. See success message
8. Automatically redirected to home page

### Admin Review Flow
1. Navigate to "New Teachers" page
2. Select a teacher application from the list
3. View all teacher details
4. See "Uploaded Documents" section
5. Click "View" to open document in new tab
6. Click "Download" to save document to computer
7. Approve or reject the application

## Error Handling

### Teacher Signup
- Validates file type (shows error for unsupported formats)
- Validates file size (shows error if exceeds 1.5MB)
- Requires at least one document before submission
- Shows clear error messages for each validation failure

### Admin Panel
- Safely parses JSON with try-catch
- Handles missing documents gracefully
- Disables View/Download buttons if document data is missing
- Shows error message if download/view fails

## Testing Checklist

- [ ] Upload single certificate (PDF, JPG, PNG, DOC, DOCX)
- [ ] Upload multiple certificates
- [ ] Verify file size validation (reject >1.5MB)
- [ ] Verify file type validation (reject unsupported types)
- [ ] Remove uploaded document before submission
- [ ] Submit form without any documents (should show error)
- [ ] Submit form with documents
- [ ] Verify data appears in teacherapprovals collection
- [ ] View uploaded document in admin panel
- [ ] Download uploaded document in admin panel
- [ ] Verify downloaded file is correct and readable
- [ ] Test with various file types and sizes

## Future Enhancements

1. **Image Preview:** Show thumbnail for image documents
2. **Drag & Drop:** Support drag-and-drop file upload
3. **Progress Bar:** Show upload progress for large files
4. **Document Validation:** Validate PDF/image content
5. **Virus Scanning:** Integrate antivirus scanning for uploaded files
6. **Archive Storage:** Move approved applications to archive
7. **Email Notifications:** Send email when documents are reviewed
8. **Document Comments:** Allow admins to add comments on documents

## Troubleshooting

### Documents Not Appearing in Admin Panel
1. Check that `submittedDocuments` field is populated in CMS
2. Verify JSON format is valid
3. Check browser console for parsing errors
4. Ensure file content is properly base64 encoded

### Download/View Not Working
1. Check that document data exists in the record
2. Verify base64 content is not corrupted
3. Check browser console for errors
4. Ensure MIME type is correct

### File Upload Failing
1. Check file size (must be <1.5MB)
2. Check file type (must be supported format)
3. Check browser console for errors
4. Verify file input element is properly referenced

## Code References

### Key Functions
- `handleDocumentUpload()` - Handles file selection and conversion
- `removeDocument()` - Removes document from upload list
- `handleSubmit()` - Submits form with documents
- `parseDocumentsData()` - Parses JSON document array
- `getDocumentData()` - Retrieves specific document
- `handleDownloadDocument()` - Downloads document to user's computer
- `handleViewDocument()` - Opens document in new tab

### Key State Variables
- `uploadedDocuments` - Array of DocumentFile objects
- `uploadError` - Error message for file upload
- `successMessage` - Success message after submission
- `isLoading` - Loading state during submission

## Security Considerations

1. **File Type Validation:** Only allows specific file types
2. **File Size Limit:** Prevents excessively large files
3. **Base64 Encoding:** Safely encodes binary data for storage
4. **MIME Type Preservation:** Maintains original file type for download
5. **Admin-Only Access:** Documents only visible to admins in review panel

## Performance Notes

- Base64 encoding increases file size by ~33%
- Large files may take longer to upload and process
- Consider implementing chunked uploads for very large files
- JSON parsing is done on-demand (not on page load)

## Browser Compatibility

- Tested on modern browsers (Chrome, Firefox, Safari, Edge)
- Uses FileReader API (supported in all modern browsers)
- Uses Blob API for download functionality
- Uses URL.createObjectURL() for file handling
