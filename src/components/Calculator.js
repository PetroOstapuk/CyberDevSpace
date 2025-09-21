import { useState} from 'react';
import AntennaImage from '@site/static/img/flower_pot.jpg';
import '@site/src/css/calculators.css';

export default function Calculator({image}) {
    const [workingFrequency, setWorkingFrequency] = useState('145');
    const [resonantFactor, setResonantFactor] = useState('7.5');
    const [cableVFactor, setCableVFactor] = useState('0.66');
    const [age, setAge] = useState('20');
    const [lambdaValue, setLambdaValue] = useState(0);
    const [upperRadiator, setUpperRadiator] = useState(0);
    const [lowerRadiator, setLowerRadiator] = useState(0);
    const [choke, setChoke] = useState(0);
    const calculate = (workingFrequency, resonantFactor, cableVFactor) => {
        const lambda = Math.round(299700/( workingFrequency ))/10;
        const res_freq = workingFrequency-(workingFrequency*(resonantFactor/100));
        const res_lambda = Math.round(299700/( res_freq ))/10;

        setLambdaValue(lambda);
        setUpperRadiator(Math.round(lambda/4)*0.89);
        setLowerRadiator(Math.round(lambda/4)*0.87);
        setChoke(cableVFactor*(res_lambda/2));
    }
    return (
        <>
            <div className="calculator-container">
                <table className="calculator-table">
                    <tbody>
                    <tr style={{borderCollapse: "collapse", border: "none"}}>
                        <td>
                            <table className="calculator-inner-table">
                            <tbody>
                            <tr>
                                <td >Робоча частота</td>
                                <td >
                                    <input
                                        value={workingFrequency}
                                        onChange={e => setWorkingFrequency(e.target.value)}
                                    />
                                </td>
                                <td >МГц</td>
                                <td rowSpan={8}>
                                    <img 
                                        src={AntennaImage} 
                                        alt="Flower Pot Antenna" 
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
                                <td >Резонансний коефіцієнт</td>
                                <td >
                                    <input
                                        value={resonantFactor}
                                        onChange={e => setResonantFactor(e.target.value)}
                                    />
                                </td>
                                <td >%</td>
                            </tr>
                            <tr>
                                <td >Коефіцієнт укорочення кабелю</td>
                                <td >
                                    <input
                                        value={cableVFactor}
                                        onChange={e => setCableVFactor(e.target.value)}
                                    />
                                </td>
                                <td >-</td>
                            </tr>
                            <tr>
                                <td align="center" colSpan={3}><b>Результат</b></td>
                            </tr>
                            <tr>
                                <td >Довжина хвилі ( λ )</td>
                                <td >
                                    <input value={lambdaValue}/>
                                </td>
                                <td >см</td>
                            </tr>
                            <tr>
                                <td >Верхнє плече</td>
                                <td >
                                    <input value={upperRadiator}/>
                                </td>
                                <td >см</td>
                            </tr>
                            <tr>
                                <td >Нижнє плече</td>
                                <td >
                                    <input value={lowerRadiator}/>
                                </td>
                                <td >см</td>
                            </tr>

                            <tr>
                                <td >Довжина кабелю дроселя</td>
                                <td >
                                    <input value={choke}/>
                                </td>
                                <td >см</td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>

                    </td>
                </tr>
                <tr>
                    <td align="center">
                        <button onClick={() => calculate(workingFrequency, resonantFactor, cableVFactor)} style={{width: "300px", height: "75px", fontSize: "20pt"}}>
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
