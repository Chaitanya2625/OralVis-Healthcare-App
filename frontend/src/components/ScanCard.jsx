export default function ScanCard({ scan, onView }) {
  return (
    <div className="card flex gap-4">
      <img src={scan.image_url} alt="scan" className="w-28 h-28 object-cover rounded-lg border"/>
      <div className="flex-1">
        <h3 className="font-semibold">{scan.patient_name} <span className="text-gray-500">({scan.patient_id})</span></h3>
        <p className="text-sm text-gray-600">{scan.scan_type} · {scan.region}</p>
        <p className="text-sm text-gray-600">Uploaded: {new Date(scan.uploaded_at).toLocaleString()}</p>
      </div>
      <div className="flex items-center gap-2">
        <a className="btn" href={scan.image_url} target="_blank" rel="noreferrer">View Image</a>
        <button className="btn btn-primary" onClick={()=>onView?.(scan)}>PDF Report</button>
      </div>
    </div>
  );
}
