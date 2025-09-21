import { useState } from 'react';
import AntennaImage from '@site/static/img/ground_plane.png';
import '@site/src/css/calculators.css';
export default function Calculator({ image }) {
    const [workingFrequency, setWorkingFrequency] = useState('145');
    const [lambdaValue, setLambdaValue] = useState(0);
    const [verticalElement, setVerticalElement] = useState(0);
    const [radialElement, setRadialElement] = useState(0);
    
    const calculate = (workingFrequency) => {
        const lambda = (30000 / workingFrequency).toFixed(2);
        setLambdaValue(lambda);
        setVerticalElement(((lambda * 0.25) * 0.95).toFixed(2));
        setRadialElement(((lambda * 0.28) * 0.95).toFixed(2));
    };
    
    return (
        <>
            <div className="calculator-container">
                <table className="calculator-table">
                    <tbody>
                        <tr>
                            <td>
                                <table className="calculator-inner-table">
                                <tbody>
                                    <tr>
                                        <td>Робоча частота</td>
                                        <td>
                                            <input
                                                value={workingFrequency}
                                                onChange={e => setWorkingFrequency(e.target.value)}
                                            />
                                        </td>
                                        <td>МГц</td>
                                        <td rowSpan={5}>
                                            <img 
                                                src={AntennaImage} 
                                                alt="Ground Plane Antenna" 
                                                height="400pt" 
                                                width="400pt"
                                                style={{
                                                    backgroundColor: '#ffffff',
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: '1px solid var(--ifm-color-emphasis-300)'
                                                }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" colSpan={3}><b>Результат</b></td>
                                    </tr>
                                    <tr>
                                        <td>Довжина хвилі (λ)</td>
                                        <td>
                                            <input value={lambdaValue} readOnly />
                                        </td>
                                        <td>см</td>
                                    </tr>
                                    <tr>
                                        <td>Вертикальний випромінювач</td>
                                        <td>
                                            <input value={verticalElement} readOnly />
                                        </td>
                                        <td>см</td>
                                    </tr>
                                    <tr>
                                        <td>Радіали</td>
                                        <td>
                                            <input value={radialElement} readOnly />
                                        </td>
                                        <td>см</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align="center">
                            <button onClick={() => calculate(workingFrequency)} style={{ width: "300px", height: "75px", fontSize: "20pt" }}>
                                Порахувати
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            </div>
        </>
    );
}

