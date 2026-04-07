import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";

interface CertificateTemplateProps {
  studentName: string;
  courseTitle: string;
  completionDate: string;
  certificateId: string;
  instructorName?: string;
}

export function CertificateTemplate({
  studentName,
  courseTitle,
  completionDate,
  certificateId,
  instructorName = "EduLearn Team",
}: CertificateTemplateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const element = certificateRef.current;
    if (!element) return;

    // Create canvas from HTML
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Draw certificate background
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, 1200, 800);

    // Draw decorative border
    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, 1120, 720);

    // Draw inner border
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 60, 1080, 680);

    // Draw title
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Certificate of Completion", 600, 150);

    // Draw decorative line
    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(300, 200);
    ctx.lineTo(900, 200);
    ctx.stroke();

    // Draw "This is to certify that"
    ctx.fillStyle = "#475569";
    ctx.font = "20px Arial";
    ctx.fillText("This is to certify that", 600, 280);

    // Draw student name
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 36px Arial";
    ctx.fillText(studentName, 600, 360);

    // Draw "has successfully completed"
    ctx.fillStyle = "#475569";
    ctx.font = "18px Arial";
    ctx.fillText("has successfully completed the course", 600, 420);

    // Draw course title
    ctx.fillStyle = "#4f46e5";
    ctx.font = "bold 28px Arial";
    ctx.fillText(courseTitle, 600, 480);

    // Draw completion details
    ctx.fillStyle = "#64748b";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`Completed on: ${completionDate}`, 600, 560);
    ctx.fillText(`Certificate ID: ${certificateId}`, 600, 590);

    // Draw signatures area
    ctx.fillStyle = "#475569";
    ctx.font = "14px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Instructor", 200, 700);
    ctx.fillText("Platform Director", 900, 700);

    // Draw signature lines
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(150, 680);
    ctx.lineTo(350, 680);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(850, 680);
    ctx.lineTo(1050, 680);
    ctx.stroke();

    // Download canvas as image
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `certificate-${certificateId}.png`;
    link.click();
  };

  const handlePrint = () => {
    const element = certificateRef.current;
    if (!element) return;

    const printWindow = window.open("", "", "height=600,width=900");
    if (!printWindow) return;

    printWindow.document.write(element.innerHTML);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-4">
      {/* Certificate Preview */}
      <div
        ref={certificateRef}
        className="bg-gradient-to-br from-slate-50 to-slate-100 border-8 border-indigo-600 rounded-lg p-12 shadow-2xl aspect-video flex flex-col items-center justify-center relative overflow-hidden"
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full opacity-20 -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-100 rounded-full opacity-20 -ml-16 -mb-16"></div>

        <div className="relative z-10 text-center">
          {/* Logo/Badge */}
          <div className="mb-4 text-4xl">🎓</div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Certificate of Completion
          </h1>

          {/* Decorative line */}
          <div className="w-32 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-6"></div>

          {/* Body text */}
          <p className="text-slate-600 text-lg mb-2">This is to certify that</p>

          {/* Student name */}
          <h2 className="text-3xl font-bold text-indigo-600 mb-4 underline decoration-wavy">
            {studentName}
          </h2>

          {/* Achievement text */}
          <p className="text-slate-600 text-lg mb-2">
            has successfully completed the course
          </p>

          {/* Course title */}
          <p className="text-2xl font-bold text-slate-900 mb-6">
            {courseTitle}
          </p>

          {/* Details */}
          <div className="text-sm text-slate-600 space-y-1 mb-8">
            <p>Completed on: {completionDate}</p>
            <p>Certificate ID: {certificateId}</p>
          </div>

          {/* Signature area */}
          <div className="flex justify-around w-full mt-12 pt-8 border-t-2 border-slate-300">
            <div className="text-center">
              <div className="h-12 mb-2"></div>
              <p className="text-xs text-slate-600">Instructor</p>
            </div>
            <div className="text-center">
              <div className="h-12 mb-2"></div>
              <p className="text-xs text-slate-600">Platform Director</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <Button
          onClick={handleDownload}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Certificate
        </Button>
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          Print Certificate
        </Button>
      </div>
    </div>
  );
}
