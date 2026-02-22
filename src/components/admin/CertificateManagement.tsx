/**
 * Certificate Management Component
 * Admin tool for managing certificate examples in the database
 * Can be added to the admin panel for easy certificate management
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Eye, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { addCertificateExamples, replaceCertificateExamples, previewCertificateExamples } from '@/services/certificateService';

export default function CertificateManagement() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const handleAddCertificates = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const result = await addCertificateExamples();
      setMessage({
        type: result.success ? 'success' : 'error',
        text: result.message
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReplaceCertificates = async () => {
    if (!confirm('This will delete all existing certificates and add new ones. Continue?')) {
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const result = await replaceCertificateExamples();
      setMessage({
        type: result.success ? 'success' : 'error',
        text: result.message
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    const preview = previewCertificateExamples();
    setPreviewData(preview);
    setShowPreview(!showPreview);
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="rounded-lg bg-gradient-to-br from-foreground/5 to-foreground/10 border border-foreground/10 p-8">
        <h2 className="font-heading text-3xl mb-4 text-foreground">Certificate Examples Manager</h2>
        <p className="font-paragraph text-foreground/70 mb-6">
          Manage professional certificate examples for the certificates page. Add, preview, or replace certificate examples with AI-generated professional designs.
        </p>

        {/* Message Display */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
              message.type === 'success'
                ? 'bg-green-500/10 border border-green-500/30 text-green-700'
                : 'bg-red-500/10 border border-red-500/30 text-red-700'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <p className="font-paragraph">{message.text}</p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={handleAddCertificates}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-heading font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
            {loading ? 'Adding...' : 'Add Certificates'}
          </button>

          <button
            onClick={handleReplaceCertificates}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground font-heading font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Trash2 className="w-5 h-5" />
            )}
            {loading ? 'Processing...' : 'Replace All'}
          </button>

          <button
            onClick={handlePreview}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-foreground/10 text-foreground font-heading font-semibold rounded-lg hover:bg-foreground/20 transition-colors border border-foreground/20"
          >
            <Eye className="w-5 h-5" />
            {showPreview ? 'Hide' : 'Preview'}
          </button>
        </div>

        {/* Preview Section */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 p-6 bg-foreground/5 rounded-lg border border-foreground/10"
          >
            <h3 className="font-heading text-xl text-foreground mb-4">Certificate Examples Preview</h3>
            {previewData.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-foreground/5 rounded-lg border-l-4 border-primary"
              >
                <h4 className="font-heading text-lg text-foreground mb-2">
                  {cert.number}. {cert.name}
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm font-paragraph text-foreground/70 mb-2">
                  <div>
                    <span className="font-semibold text-foreground">Awarded For:</span> {cert.awardedFor}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Recipient:</span> {cert.recipientType}
                  </div>
                </div>
                <div className="text-sm font-paragraph text-foreground/70 mb-2">
                  <span className="font-semibold text-foreground">Authority:</span> {cert.issuingAuthority}
                </div>
                <p className="text-sm font-paragraph text-foreground/70 leading-relaxed">
                  {cert.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Info Messages */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h4 className="font-heading font-semibold text-blue-700 mb-2">About These Certificates</h4>
          <ul className="font-paragraph text-blue-700 text-sm space-y-1 list-disc list-inside">
            <li>4 professional certificates showcasing different levels of achievement</li>
            <li>Includes AI-generated professional certificate images</li>
            <li>Perfect for demonstrating the value of your programs</li>
            <li>Each certificate includes detailed descriptions and awarding criteria</li>
            <li>Certificates span all levels from Beginner to Master Roboticist</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
