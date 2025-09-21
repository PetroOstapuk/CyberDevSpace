import { useState, useEffect } from 'react';
import { 
    getKharchenkoFrequencies, 
    calculateKharchenko, 
    formatKharchenkoResults,
    formatKharchenkoResultsHTML, 
    validateKharchenkoInputs,
    getUnitLabel,
    formatLength
} from '@site/src/utils/calculatorUtils';
import '@site/src/css/calculators.css';

export default function KharchenkoCalculator({ image }) {
    // Основні стани
    const [frequency, setFrequency] = useState('2445');
    const [centerFrequency, setCenterFrequency] = useState('');
    const [impedance, setImpedance] = useState('50');
    const [measurementUnit, setMeasurementUnit] = useState('mm');
    
    // Результати
    const [results, setResults] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [detailedResults, setDetailedResults] = useState('');
    const [structuredResults, setStructuredResults] = useState(null);

    // Стандартні частоти
    const standardFrequencies = getKharchenkoFrequencies();

    // Обробка зміни стандартної частоти
    const handleCenterFrequencyChange = (value) => {
        setCenterFrequency(value);
        if (value !== '') {
            setFrequency(value);
        }
    };

    // Функції для вибору зображень
    const getAntennaImage1 = () => {
        return '/img/BiRombFig2.png'; // перше зображення (зверху)
    };
    
    const getAntennaImage2 = () => {
        return '/img/BiRombFig3.png'; // друге зображення (знизу)
    };

    // Розрахунок антени
    const calculate = () => {
        setAlertMessage('');
        setResults(null);
        setDetailedResults('');
        
        const freq = parseFloat(frequency);
        const imp = parseInt(impedance);
        
        // Валідація
        const errors = validateKharchenkoInputs(freq, imp);
        if (errors.length > 0) {
            setAlertMessage(errors.join('; '));
            return;
        }
        
        try {
            // Розрахунок
            const kharchenkoResults = calculateKharchenko(freq, imp, measurementUnit);
            
            setResults(kharchenkoResults);
            
            // Форматований вивід
            const formatted = formatKharchenkoResults(kharchenkoResults, measurementUnit);
            const structured = formatKharchenkoResultsHTML(kharchenkoResults, measurementUnit);
            setDetailedResults(formatted);
            setStructuredResults(structured);
            
        } catch (error) {
            setAlertMessage('Помилка розрахунку: ' + error.message);
        }
    };

    // Перерахунок при зміні одиниць
    useEffect(() => {
        if (results) {
            const formatted = formatKharchenkoResults(results, measurementUnit);
            const structured = formatKharchenkoResultsHTML(results, measurementUnit);
            setDetailedResults(formatted);
            setStructuredResults(structured);
        }
    }, [measurementUnit, results]);

    return (
        <>
            {/* Зображення антени */}
            <div style={{ margin: '20px 0' }}>
                {/* Перше зображення - конструкція */}
                <div style={{ marginBottom: '20px' }}>
                    <img 
                        src={getAntennaImage1()} 
                        alt="Kharchenko BiQuad Antenna Construction" 
                        style={{ 
                            width: '50%',
                            height: 'auto', 
                            border: '1px solid var(--ifm-color-emphasis-300)', 
                            borderRadius: '8px',
                            backgroundColor: '#ffffff',
                            padding: '15px',
                            boxShadow: '0 2px 8px var(--ifm-color-emphasis-200)',
                            display: 'block',
                            margin: '0 auto'
                        }}
                    />
                </div>
                
                {/* Друге зображення - схема розмірів */}
                <div style={{ marginBottom: '20px' }}>
                    <img 
                        src={getAntennaImage2()} 
                        alt="Kharchenko BiQuad Antenna Dimensions" 
                        style={{ 
                            width: '50%',
                            height: 'auto', 
                            border: '1px solid var(--ifm-color-emphasis-300)', 
                            borderRadius: '8px',
                            backgroundColor: '#ffffff',
                            padding: '15px',
                            boxShadow: '0 2px 8px var(--ifm-color-emphasis-200)',
                            display: 'block',
                            margin: '0 auto'
                        }}
                    />
                </div>
                
                <p style={{ 
                    fontSize: '14px', 
                    color: 'var(--ifm-color-emphasis-700)', 
                    textAlign: 'center',
                    margin: '0'
                }}>
                    Конструкція та схема розмірів антени Харченко (зигзагоподібна BiQuad антена)
                </p>
            </div>

            <div className="yagi-calculator-container">
                <table className="yagi-calculator-table">
                    <tbody>
                        <tr>
                            <td>
                                <table className="yagi-calculator-inner-table">
                                    <tbody>
                                    {/* Стандартні частоти */}
                                    <tr>
                                        <td>Стандартні частоти</td>
                                        <td colSpan={2}>
                                            <select 
                                                className="calculator-select"
                                                value={centerFrequency} 
                                                onChange={e => handleCenterFrequencyChange(e.target.value)}
                                            >
                                                {standardFrequencies.map(freq => (
                                                    <option key={freq.value} value={freq.value}>
                                                        {freq.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                    
                                    {/* Робоча частота */}
                                    <tr>
                                        <td>Робоча частота</td>
                                        <td>
                                            <input
                                                className="calculator-input"
                                                value={frequency}
                                                onChange={e => {
                                                    setFrequency(e.target.value);
                                                    setCenterFrequency('');
                                                }}
                                                style={{backgroundColor: centerFrequency !== '' ? 'var(--ifm-color-emphasis-100)' : undefined}}
                                                readOnly={centerFrequency !== ''}
                                            />
                                        </td>
                                        <td>МГц</td>
                                    </tr>
                                    
                                    {/* Вхідний імпеданс */}
                                    <tr>
                                        <td>Вхідний імпеданс</td>
                                        <td colSpan={2}>
                                            <select 
                                                value={impedance} 
                                                onChange={e => setImpedance(e.target.value)}
                                                style={{width: '100%'}}
                                            >
                                                <option value="50">50 Ω</option>
                                                <option value="75">75 Ω</option>
                                            </select>
                                        </td>
                                    </tr>
                                    
                                    {/* Одиниці вимірювання */}
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
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    
                    {/* Повідомлення про помилки */}
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
                    
                    {/* Кнопка розрахунку */}
                    <tr>
                        <td align="center">
                            <button 
                                onClick={calculate} 
                                style={{ width: "300px", height: "75px", fontSize: "20pt", margin: "20px" }}
                            >
                                Порахувати
                            </button>
                        </td>
                    </tr>
                    
                    {/* Результати */}
                    {results && (
                        <tr>
                            <td>
                                <div style={{ margin: '20px 0' }}>
                                    <h3 style={{ color: 'var(--ifm-color-emphasis-800)' }}>Основні параметри:</h3>
                                    <table style={{ 
                                        width: '100%', 
                                        borderCollapse: 'collapse', 
                                        border: '1px solid var(--ifm-color-emphasis-300)',
                                        backgroundColor: 'var(--ifm-background-color)'
                                    }}>
                                        <tbody>
                                            <tr style={{ backgroundColor: 'var(--ifm-color-emphasis-100)' }}>
                                                <td style={{ 
                                                    padding: '8px', 
                                                    border: '1px solid var(--ifm-color-emphasis-300)',
                                                    color: 'var(--ifm-color-emphasis-800)'
                                                }}>
                                                    <strong>Частота</strong>
                                                </td>
                                                <td style={{ 
                                                    padding: '8px', 
                                                    border: '1px solid var(--ifm-color-emphasis-300)',
                                                    color: 'var(--ifm-color-emphasis-700)'
                                                }}>
                                                    {results.frequency} МГц
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ 
                                                    padding: '8px', 
                                                    border: '1px solid var(--ifm-color-emphasis-300)',
                                                    color: 'var(--ifm-color-emphasis-800)'
                                                }}>
                                                    <strong>Вхідний імпеданс</strong>
                                                </td>
                                                <td style={{ 
                                                    padding: '8px', 
                                                    border: '1px solid var(--ifm-color-emphasis-300)',
                                                    color: 'var(--ifm-color-emphasis-700)'
                                                }}>
                                                    {results.impedance} Ω
                                                </td>
                                            </tr>
                                            <tr style={{ backgroundColor: 'var(--ifm-color-emphasis-100)' }}>
                                                <td style={{ 
                                                    padding: '8px', 
                                                    border: '1px solid var(--ifm-color-emphasis-300)',
                                                    color: 'var(--ifm-color-emphasis-800)'
                                                }}>
                                                    <strong>Довжина хвилі</strong>
                                                </td>
                                                <td style={{ 
                                                    padding: '8px', 
                                                    border: '1px solid var(--ifm-color-emphasis-300)',
                                                    color: 'var(--ifm-color-emphasis-700)'
                                                }}>
                                                    {formatLength(results.wavelength, measurementUnit)} {getUnitLabel(measurementUnit)}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    )}
                    
                    {/* Детальний звіт */}
                    {structuredResults && (
                        <tr>
                            <td>
                                <div style={{ margin: '20px 0' }}>
                                    <h3 style={{ color: 'var(--ifm-color-emphasis-800)' }}>Детальний звіт:</h3>
                                    
                                    {/* Заголовок */}
                                    <div style={{ 
                                        backgroundColor: 'var(--ifm-color-primary-contrast-background)', 
                                        padding: '15px', 
                                        borderRadius: '8px', 
                                        marginBottom: '20px',
                                        border: '1px solid var(--ifm-color-primary-contrast-foreground)'
                                    }}>
                                        <h4 style={{ margin: '0 0 10px 0', color: 'var(--ifm-color-primary)' }}>
                                            {structuredResults.header.title}
                                        </h4>
                                        <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--ifm-color-emphasis-600)' }}>
                                            {structuredResults.header.subtitle}
                                        </p>
                                        <div style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                                            gap: '10px',
                                            color: 'var(--ifm-color-emphasis-700)'
                                        }}>
                                            <div><strong>Частота:</strong> {structuredResults.header.frequency}</div>
                                            <div><strong>Імпеданс:</strong> {structuredResults.header.impedance}</div>
                                            <div><strong>Довжина хвилі:</strong> {structuredResults.header.wavelength}</div>
                                        </div>
                                    </div>

                                    {/* Параметри BiQuad */}
                                    <div style={{ marginBottom: '20px' }}>
                                        <h4 style={{ color: 'var(--ifm-color-primary)', marginBottom: '10px' }}>📐 Розміри BiQuad рамок</h4>
                                        <div style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                                            gap: '15px',
                                            backgroundColor: 'var(--ifm-color-emphasis-100)',
                                            padding: '15px',
                                            borderRadius: '8px',
                                            border: '1px solid var(--ifm-color-emphasis-300)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ifm-color-emphasis-700)' }}>
                                                <span><strong>Розмір W (загальна довжина):</strong></span>
                                                <span>{structuredResults.biquadParams.W}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ifm-color-emphasis-700)' }}>
                                                <span><strong>Розмір H (ширина рамок):</strong></span>
                                                <span>{structuredResults.biquadParams.H}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ifm-color-emphasis-700)' }}>
                                                <span><strong>Загальна довжина дроту:</strong></span>
                                                <span>{structuredResults.biquadParams.totalWireLength}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ifm-color-emphasis-700)' }}>
                                                <span><strong>Відстань до рефлектора D:</strong></span>
                                                <span>{structuredResults.biquadParams.D}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Параметри рефлектора */}
                                    <div style={{ marginBottom: '20px' }}>
                                        <h4 style={{ color: 'var(--ifm-color-primary)', marginBottom: '10px' }}>🔲 Розміри рефлектора</h4>
                                        <div style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                                            gap: '15px',
                                            backgroundColor: 'var(--ifm-color-warning-contrast-background)',
                                            padding: '15px',
                                            borderRadius: '8px',
                                            border: '1px solid var(--ifm-color-warning-contrast-foreground)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ifm-color-emphasis-700)' }}>
                                                <span><strong>Розмір B (ширина):</strong></span>
                                                <span>{structuredResults.reflectorParams.width}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ifm-color-emphasis-700)' }}>
                                                <span><strong>Розмір A (довжина):</strong></span>
                                                <span>{structuredResults.reflectorParams.length}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Параметри конструкції */}
                                    <div style={{ marginBottom: '20px' }}>
                                        <h4 style={{ color: 'var(--ifm-color-primary)', marginBottom: '10px' }}>🔧 Параметри конструкції</h4>
                                        <div style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                                            gap: '15px',
                                            backgroundColor: 'var(--ifm-color-info-contrast-background)',
                                            padding: '15px',
                                            borderRadius: '8px',
                                            border: '1px solid var(--ifm-color-info-contrast-foreground)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ifm-color-emphasis-700)' }}>
                                                <span><strong>Діаметр дроту:</strong></span>
                                                <span>{structuredResults.constructionParams.wireDiameter} ({structuredResults.constructionParams.awgSize} AWG#)</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ifm-color-emphasis-700)' }}>
                                                <span><strong>Довжина сторони qs1:</strong></span>
                                                <span>{structuredResults.constructionParams.qs1}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ifm-color-emphasis-700)' }}>
                                                <span><strong>Довжина сторони qs2:</strong></span>
                                                <span>{structuredResults.constructionParams.qs2}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ifm-color-emphasis-700)' }}>
                                                <span><strong>Радіус згину R:</strong></span>
                                                <span>{structuredResults.constructionParams.bendRadius}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ifm-color-emphasis-700)' }}>
                                                <span><strong>Проміжок gap:</strong></span>
                                                <span>{structuredResults.constructionParams.gap}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Параметри направляючих */}
                                    <div style={{ marginBottom: '20px' }}>
                                        <h4 style={{ color: 'var(--ifm-color-primary)', marginBottom: '10px' }}>📏 Відстані між направляючими</h4>
                                        <div style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                                            gap: '15px',
                                            backgroundColor: 'var(--ifm-color-success-contrast-background)',
                                            padding: '15px',
                                            borderRadius: '8px',
                                            border: '1px solid var(--ifm-color-success-contrast-foreground)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ifm-color-emphasis-700)' }}>
                                                <span><strong>G0:</strong></span>
                                                <span>{structuredResults.guidesParams.G0}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ifm-color-emphasis-700)' }}>
                                                <span><strong>G1:</strong></span>
                                                <span>{structuredResults.guidesParams.G1}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ifm-color-emphasis-700)' }}>
                                                <span><strong>G2:</strong></span>
                                                <span>{structuredResults.guidesParams.G2}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ifm-color-emphasis-700)' }}>
                                                <span><strong>G3:</strong></span>
                                                <span>{structuredResults.guidesParams.G3}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ifm-color-emphasis-700)' }}>
                                                <span><strong>Діаметр GD:</strong></span>
                                                <span>{structuredResults.guidesParams.diameter}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Примітки */}
                                    <div style={{ 
                                        backgroundColor: 'var(--ifm-color-emphasis-100)', 
                                        padding: '15px', 
                                        borderRadius: '8px',
                                        border: '1px solid var(--ifm-color-emphasis-300)'
                                    }}>
                                        <h4 style={{ color: 'var(--ifm-color-emphasis-800)', marginBottom: '10px' }}>📝 Примітки</h4>
                                        <p style={{ margin: '0', lineHeight: '1.6', color: 'var(--ifm-color-emphasis-700)' }}>
                                            BiQuad антена Харченко є направленою антеною з високим підсиленням. 
                                            Рефлектор виготовляється з металевого листа або сітки. 
                                            Рамки виготовляються з мідного дроту відповідного діаметра.
                                        </p>
                                        <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: 'var(--ifm-color-emphasis-600)', fontStyle: 'italic' }}>
                                            Розрахунок базується на методиці 3G-Aerial з адаптацією для українських радіоаматорів.
                                        </p>
                                    </div>

                                    {/* Текстова версія для копіювання */}
                                    <details style={{ marginTop: '20px' }}>
                                        <summary style={{ 
                                            cursor: 'pointer', 
                                            padding: '10px', 
                                            backgroundColor: 'var(--ifm-color-emphasis-200)', 
                                            borderRadius: '4px',
                                            fontWeight: 'bold',
                                            color: 'var(--ifm-color-emphasis-800)',
                                            border: '1px solid var(--ifm-color-emphasis-300)'
                                        }}>
                                            📋 Текстова версія для копіювання
                                        </summary>
                                        <textarea
                                            className="calculator-textarea"
                                            value={detailedResults}
                                            readOnly
                                            style={{
                                                width: '100%',
                                                height: '300px',
                                                fontFamily: 'monospace',
                                                fontSize: '12px',
                                                marginTop: '10px',
                                                resize: 'vertical'
                                            }}
                                        />
                                    </details>
                                </div>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
