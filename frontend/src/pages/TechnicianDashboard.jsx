import UploadForm from '../components/UploadForm';

export default function TechnicianDashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Technician — Upload Scan</h1>
      <UploadForm onUploaded={()=>alert('Uploaded!')}/>
      <p className="text-sm text-gray-600">Only technicians can upload. Dentists can view scans and download reports.</p>
    </div>
  );
}
