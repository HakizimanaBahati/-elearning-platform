import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Award, Download, Share2, Calendar } from "lucide-react";
import { CertificateTemplate } from "@/components/CertificateTemplate";
import { useState } from "react";

export default function MyCertificates() {
  const [, navigate] = useLocation();
  const [selectedCert, setSelectedCert] = useState<number | null>(null);
  const { data: certificates = [], isLoading } = trpc.certificates.list.useQuery();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">My Certificates</h1>
          <p className="text-indigo-100">Showcase your achievements and accomplishments</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <Card className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-2">Total Certificates Earned</p>
                <p className="text-4xl font-bold text-slate-900">{certificates.length}</p>
              </div>
              <Award className="w-16 h-16 text-indigo-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        {/* Certificate Viewer */}
        {selectedCert !== null ? (
          <div>
            <Button
              variant="outline"
              onClick={() => setSelectedCert(null)}
              className="mb-6"
            >
              ← Back to Certificates
            </Button>
            <Card>
              <CardContent className="pt-8">
                <CertificateTemplate
                  studentName="John Doe"
                  courseTitle="Advanced Web Development"
                  completionDate="April 7, 2024"
                  certificateId="CERT-2024-001"
                />
              </CardContent>
            </Card>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : certificates.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-lg text-slate-600 mb-4">No certificates yet</p>
              <p className="text-slate-500 mb-6">Complete courses to earn certificates</p>
              <Button
                onClick={() => navigate("/dashboard")}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Continue Learning
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <Card key={cert.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Certificate Preview */}
                <div className="h-48 bg-gradient-to-br from-yellow-100 to-amber-100 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-400 rounded-full -ml-16 -mb-16"></div>
                  </div>
                  <div className="relative text-center">
                    <Award className="w-12 h-12 text-amber-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-amber-900">Certificate of Completion</p>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-lg">Course #{cert.courseId}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {cert.certificateNumber && (
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Certificate Number</p>
                      <p className="font-mono text-sm text-slate-900">{cert.certificateNumber}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>Issued {new Date(cert.issuedAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedCert(cert.id)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        navigator.clipboard.writeText(cert.certificateUrl || "");
                        // toast.success("Link copied!");
                      }}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Section */}
        {certificates.length > 0 && (
          <Card className="mt-12 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-blue-900 mb-3">💡 About Your Certificates</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Your certificates are digitally signed and verifiable</li>
                <li>• You can download certificates as PDF files</li>
                <li>• Share your certificates on LinkedIn and other social media</li>
                <li>• Each certificate includes a unique verification number</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
