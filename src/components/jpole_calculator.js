import { useState, useEffect } from 'react';
import AntennaImage from '@site/static/img/j-pole-antenna.png';
import '@site/src/css/calculators.css';

export default function JpoleCalculator({ image }) {
    const [workingFrequency, setWorkingFrequency] = useState('145');
    const [centerFrequency, setCenterFrequency] = useState('');
    const [wireDiameter, setWireDiameter] = useState('4');
    const [measurementUnit, setMeasurementUnit] = useState('cm');
    const [lambdaValue, setLambdaValue] = useState(0);
    const [dimensionA, setDimensionA] = useState(0);
    const [dimensionB, setDimensionB] = useState(0);
    const [dimensionC, setDimensionC] = useState(0);
    const [dimensionD, setDimensionD] = useState(0);
    const [shorteningFactor, setShorteningFactor] = useState(0);
    const [alertMessage, setAlertMessage] = useState('');
    
    // Recalculate when measurement unit changes
    useEffect(() => {
        if (workingFrequency && wireDiameter && lambdaValue) {
            calculate(workingFrequency, wireDiameter);
        }
    }, [measurementUnit]);
    
    // Handle center frequency dropdown change
    const handleCenterFrequencyChange = (value) => {
        setCenterFrequency(value);
        if (value !== '') {
            setWorkingFrequency(value);
        }
    };

    // Convert values based on measurement unit
    const convertToUnit = (valueInCm) => {
        switch (measurementUnit) {
            case 'm':
                return (valueInCm / 100).toFixed(4);
            case 'mm':
                return (valueInCm * 10).toFixed(1);
            case 'cm':
            default:
                return valueInCm;
        }
    };

    // Get unit label
    const getUnitLabel = () => {
        switch (measurementUnit) {
            case 'm':
                return 'м';
            case 'mm':
                return 'мм';
            case 'cm':
            default:
                return 'см';
        }
    };

    // Velocity factor calculation based on frequency
    const vfMonopole = (frequency) => {
        const freqPoints = [2, 4, 6, 10, 20, 100, 10000];
        const vfPoints = [0.72, 0.86, 0.9, 0.92, 0.94, 0.96, 0.98];
        let vf = 0;
        
        if (frequency < 2) {
            vf = 0.7;
        } else if (frequency > 10000) {
            vf = 0.99;
        } else {
            let i = 0;
            while (frequency >= freqPoints[i] && i < freqPoints.length - 1) {
                i++;
            }
            if (i > 0) {
                vf = (vfPoints[i] - vfPoints[i-1]) / (freqPoints[i] - freqPoints[i-1]) * (frequency - freqPoints[i-1]) + vfPoints[i-1];
            }
        }
        return vf;
    };
    
    const calculate = (frequency, diameter) => {
        setAlertMessage('');
        
        if (frequency > 0 && diameter > 0) {
            const lambda = 299792.458 / frequency; // wavelength in mm
            const ratio = lambda / diameter;
            const vf = vfMonopole(ratio);
            
            const dimA = 0.75 * lambda * vf;
            const dimB = 0.25 * lambda * vf;
            const dimC = 0.02175 * lambda * vf;
            const dimD = 0.025 * lambda * vf;
            
            // Check if diameter is acceptable
            if (dimC < 1.5 * diameter) {
                setAlertMessage('Діаметр дроту перевищує допустимий');
                return;
            }
            
            const lambdaCm = lambda / 10; // convert to cm
            const dimACm = dimA / 10; // convert to cm
            const dimBCm = dimB / 10; // convert to cm
            const dimCCm = dimC / 10; // convert to cm
            const dimDCm = dimD / 10; // convert to cm
            
            setLambdaValue(convertToUnit(lambdaCm.toFixed(2)));
            setDimensionA(convertToUnit(dimACm.toFixed(2)));
            setDimensionB(convertToUnit(dimBCm.toFixed(2)));
            setDimensionC(convertToUnit(dimCCm.toFixed(2)));
            setDimensionD(convertToUnit(dimDCm.toFixed(2)));
            setShorteningFactor((Math.round(100 * vf) / 100).toFixed(2));
        } else {
            setAlertMessage('Введіть коректні дані!');
        }
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
                                        <td>Стандартні частоти</td>
                                        <td colSpan={2}>
                                            <select 
                                                value={centerFrequency} 
                                                onChange={e => handleCenterFrequencyChange(e.target.value)}
                                                style={{width: '100%'}}
                                            >
                                                <option value="">Ввести частоту вручну</option>
                                                <option value="145">144 МГц (2 м)</option>
                                                <option value="435">440 МГц (70 см)</option>
                                                <option value="433.9">LPD</option>
                                                <option value="446">PMR</option>
                                                <option value="462.64">GMRS</option>
                                                <option value="465.135">FRS</option>
                                            </select>
                                        </td>
                                        <td rowSpan={11}>
                                            <img 
                                                src={AntennaImage} 
                                                alt="J-pole Antenna" 
                                                height="400pt" 
                                                width="300pt"
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
                                        <td>Робоча частота</td>
                                        <td>
                                            <input
                                                value={workingFrequency}
                                                onChange={e => {
                                                    setWorkingFrequency(e.target.value);
                                                    setCenterFrequency(''); // reset dropdown when manually entering
                                                }}
                                                style={{backgroundColor: centerFrequency !== '' ? '#eeeeee' : '#ffffff'}}
                                                readOnly={centerFrequency !== ''}
                                            />
                                        </td>
                                        <td>МГц</td>
                                    </tr>
                                    <tr>
                                        <td>Діаметр дроту</td>
                                        <td>
                                            <input
                                                value={wireDiameter}
                                                onChange={e => setWireDiameter(e.target.value)}
                                            />
                                        </td>
                                        <td>мм</td>
                                    </tr>
                                    <tr>
                                        <td>Одиниці вимірювання</td>
                                        <td colSpan={2}>
                                            <select 
                                                value={measurementUnit} 
                                                onChange={e => setMeasurementUnit(e.target.value)}
                                                style={{width: '100%'}}
                                            >
                                                <option value="mm">Міліметри (мм)</option>
                                                <option value="cm">Сантиметри (см)</option>
                                                <option value="m">Метри (м)</option>
                                            </select>
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
                                        <td>{getUnitLabel()}</td>
                                    </tr>
                                    <tr>
                                        <td>Розмір A</td>
                                        <td>
                                            <input value={dimensionA} readOnly />
                                        </td>
                                        <td>{getUnitLabel()}</td>
                                    </tr>
                                    <tr>
                                        <td>Розмір B</td>
                                        <td>
                                            <input value={dimensionB} readOnly />
                                        </td>
                                        <td>{getUnitLabel()}</td>
                                    </tr>
                                    <tr>
                                        <td>Відстань C</td>
                                        <td>
                                            <input value={dimensionC} readOnly />
                                        </td>
                                        <td>{getUnitLabel()}</td>
                                    </tr>
                                    <tr>
                                        <td>Розмір D</td>
                                        <td>
                                            <input value={dimensionD} readOnly />
                                        </td>
                                        <td>{getUnitLabel()}</td>
                                    </tr>
                                    <tr>
                                        <td>Коефіцієнт укорочення</td>
                                        <td>
                                            <input value={shorteningFactor} readOnly />
                                        </td>
                                        <td>-</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                                    {alertMessage && (
                        <tr>
                            <td align="center" style={{
                                color: 'var(--ifm-color-danger)', 
                                padding: '10px',
                                backgroundColor: 'var(--ifm-color-danger-contrast-background)',
                                borderRadius: '4px',
                                border: '1px solid var(--ifm-color-danger-contrast-foreground)'
                            }}>
                                <strong>{alertMessage}</strong>
                            </td>
                        </tr>
                    )}
                    <tr>
                        <td align="center">
                            <button 
                                onClick={() => calculate(workingFrequency, wireDiameter)} 
                                style={{ width: "300px", height: "75px", fontSize: "20pt" }}
                            >
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
