export default function ScanList({ scans, onViewPdf }) {
  if (!scans?.length) return <p className="text-gray-600">No scans yet.</p>;
  return (
    <div className="space-y-3">
      {scans.map(s => (
        <div key={s.id}>
          {/* reuse inline to avoid import loops */}
          <div className="card flex gap-4">
            <img src={s.image_url} alt="scan" className="w-28 h-28 object-cover rounded-lg border"/>
            <div className="flex-1">
              <h3 className="font-semibold">{s.patient_name} <span className="text-gray-500">({s.patient_id})</span></h3>
              <p className="text-sm text-gray-600">{s.scan_type} · {s.region}</p>
              <p className="text-sm text-gray-600">Uploaded: {new Date(s.uploaded_at).toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <a className="btn" href={s.image_url} target="_blank" rel="noreferrer">View Image</a>
              <button className="btn btn-primary" onClick={()=>onViewPdf?.(s.id)}>PDF Report</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
