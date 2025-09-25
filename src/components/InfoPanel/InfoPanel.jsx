import "./InfoPanel.css";

export default function InfoPanel(){
  return (
    <div className="info-panel">
      <ul>
        <li>Rent stabilization caps annual increases and grants renewal rights.</li>
        <li>Request your apartment’s rent history via NYS HCR (Tenant Protection Unit).</li>
        <li>If you suspect overcharge, file a complaint and keep documentation.</li>
      </ul>
      <p>Helpful: NYC RGB, NYS HCR Rent Info Request, NYC Tenant Protection Portal.</p>
    </div>
  );
}