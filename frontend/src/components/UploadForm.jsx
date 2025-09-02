import { useState } from "react";
import api from "../services/api";

export default function UploadForm({ onUploaded }) {
  const [form, setForm] = useState({
    patient_name: "",
    patient_id: "",
    scan_type: "RGB",      // ✅ default to RGB
    region: "Frontal",     // ✅ default to Frontal
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const update = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return setErr("Please choose an image");
    setLoading(true);
    setErr("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("image", file);

      const { data } = await api.post("/scans", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // callback to parent if provided
      onUploaded?.(data);

      // ✅ reset form with defaults
      setForm({
        patient_name: "",
        patient_id: "",
        scan_type: "RGB",
        region: "Frontal",
      });
      setFile(null);
    } catch (e) {
      console.error("Upload failed:", e);
      setErr(
        e.response?.data?.message ||
          e.message ||
          "Upload failed, please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="label">Patient Name</label>
          <input
            className="input"
            value={form.patient_name}
            onChange={(e) => update("patient_name", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">Patient ID</label>
          <input
            className="input"
            value={form.patient_id}
            onChange={(e) => update("patient_id", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">Scan Type</label>
          <select
            className="input"
            value={form.scan_type}
            onChange={(e) => update("scan_type", e.target.value)}
          >
            <option value="RGB">RGB</option>
            <option value="X-Ray">X-Ray</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="label">Region</label>
          <select
            className="input"
            value={form.region}
            onChange={(e) => update("region", e.target.value)}
          >
            <option value="Frontal">Frontal</option>
            <option value="Upper Arch">Upper Arch</option>
            <option value="Lower Arch">Lower Arch</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="label">Upload Scan Image (JPG/PNG)</label>
          <input
            type="file"
            accept="image/png,image/jpeg"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>
      </div>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <button disabled={loading} className="btn btn-primary">
        {loading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
}
