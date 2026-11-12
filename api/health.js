export default function handler(req, res) {
  res.status(200).json({
    status: "ok",
    service: "BranchTone Studio API",
    version: "0.4.0",
    timestamp: new Date().toISOString(),
    compliance_note: "BranchTone narrative audio QA studio deployed baseline on Vercel."
  });
}
