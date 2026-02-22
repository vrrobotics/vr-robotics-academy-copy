/**
 * Add Certificates Button Component
 * 
 * A simple, standalone component that can be added to any admin page
 * to add professional certificate examples with one click.
 * 
 * Usage:
 * import AddCertificatesButton from '@/components/admin/AddCertificatesButton';
 * 
 * <AddCertificatesButton />
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ChevronDown } from 'lucide-react';
import { addCertificateExamples, previewCertificateExamples } from '@/services/certificateService';

export default function AddCertificatesButton() {
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const handleAddCertificates = async () => {
    setLoading(true);
    try {
      const result = await addCertificateExamples();
      setResult(result);
      if (result.success) {
        // Reload page to show new certificates
        setTimeout(() => window.location.reload(), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShowPreview = () => {
    if (!previewData.length) {
      setPreviewData(previewCertificateExamples());
    }
    setExpanded(!expanded);
  };

  return (
    <motion.div
      className="inline-block"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="space-y-2">
        <motion.button
          onClick={handleAddCertificates}
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-heading font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 transition-all"
        >
          <Award className="w-5 h-5" />
          {loading ? 'Adding Certificates...' : 'Add Professional Certificates'}
        </motion.button>

        <motion.button
          onClick={handleShowPreview}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-foreground/10 text-foreground font-heading rounded-lg hover:bg-foreground/20 transition-colors cursor-pointer border border-foreground/20"
        >
          Show Preview
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </motion.button>
      </div>

      {/* Result Message */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-4 p-4 rounded-lg text-sm font-paragraph ${
              result.success
                ? 'bg-green-500/20 border border-green-500/50 text-green-700'
                : 'bg-red-500/20 border border-red-500/50 text-red-700'
            }`}
          >
            {result.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-6 bg-foreground/5 rounded-lg border border-foreground/20 space-y-4"
          >
            <h3 className="font-heading text-lg text-foreground">Certificates to be added:</h3>
            {previewData.map((cert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-3 bg-foreground/5 rounded border-l-4 border-primary"
              >
                <h4 className="font-semibold text-foreground">{cert.name}</h4>
                <p className="text-sm text-foreground/70 mt-1">{cert.description}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
