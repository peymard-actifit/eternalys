import './CentralDisplay.css';

interface CentralDisplayData {
  type: 'attack' | 'damage';
  result: string;
  details?: string;
  isHit?: boolean;
  isCritical?: boolean;
  damage?: number;
}

interface CentralDisplayProps {
  centralDisplay: CentralDisplayData | null;
}

export function CentralDisplay({ centralDisplay }: CentralDisplayProps) {
  return (
    <div className="versus-area">
      {centralDisplay ? (
        <div className={`central-roll-display ${centralDisplay.type} ${centralDisplay.isHit ? 'hit' : 'miss'} ${centralDisplay.isCritical ? 'critical' : ''}`}>
          <div className="roll-result">{centralDisplay.result}</div>
          {centralDisplay.details && <div className="roll-details">{centralDisplay.details}</div>}
        </div>
      ) : (
        <div className="versus">VS</div>
      )}
    </div>
  );
}

