import { useState, useEffect } from 'react';
import { 
    getStandardFrequencies, 
    calculateYagiDL6WU, 
    formatYagiResults,
    formatYagiResultsHTML, 
    validateYagiInputs,
    getUnitLabel,
    formatLength
} from '@site/src/utils/calculatorUtils';
import '@site/src/css/calculators.css';

export default function YagiCalculator({ image }) {
    // Основні стани
    const [frequency, setFrequency] = useState('144');
    const [centerFrequency, setCenterFrequency] = useState('');
    const [elements, setElements] = useState('5');
    const [elementDiameter, setElementDiameter] = useState('8');
    const [elementThickness, setElementThickness] = useState('2');
    const [boomDiameter, setBoomDiameter] = useState('15');
    const [measurementUnit, setMeasurementUnit] = useState('mm');
    
    // Налаштування антени
    const [dipoleForm, setDipoleForm] = useState('1'); // 0-розрізний, 1-петльовий
    const [elementShape, setElementShape] = useState('0'); // 0-круглий, 1-плоский
    const [boomForm, setBoomForm] = useState('square'); // round/square
    const [mountingType, setMountingType] = useState('0'); // 0,1,2
    
    // Результати
    const [results, setResults] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [detailedResults, setDetailedResults] = useState('');
    const [structuredResults, setStructuredResults] = useState(null);

    // Стандартні частоти
    const standardFrequencies = getStandardFrequencies();

    // Обробка зміни стандартної частоти
    const handleCenterFrequencyChange = (value) => {
        setCenterFrequency(value);
        if (value !== '') {
            setFrequency(value);
        }
    };

    // Функція для вибору зображення
    const getAntennaImage = () => {
        const baseUrl = '/img/';
        let imageName = 'yagi4';
        
        if (elementShape === '1') {
            imageName = 'yagi4flat';
        }
        
        if (dipoleForm === '1') {
            imageName += '-folded';
        }
        
        return baseUrl + imageName + '.png';
    };

    // Розрахунок антени
    const calculate = () => {
        setAlertMessage('');
        setResults(null);
        setDetailedResults('');
        
        const freq = parseFloat(frequency);
        const elem = parseInt(elements);
        const boomDiam = parseFloat(boomDiameter);
        const elemDiam = parseFloat(elementDiameter);
        const elemThick = parseFloat(elementThickness);
        
        // Валідація
        const errors = validateYagiInputs(freq, elem, boomDiam, elemDiam);
        if (errors.length > 0) {
            setAlertMessage(errors.join('; '));
            return;
        }
        
        try {
            // Розрахунок
            const yagiResults = calculateYagiDL6WU(
                freq,
                elem,
                boomDiam,
                elemDiam,
                parseInt(mountingType),
                parseInt(dipoleForm),
                boomForm,
                elementShape === '0' ? 'round' : 'flat',
                elemThick
            );
            
            yagiResults.frequency = freq;
            
            setResults(yagiResults);
            
            // Форматований вивід
            const formatted = formatYagiResults(yagiResults, measurementUnit);
            const structured = formatYagiResultsHTML(yagiResults, measurementUnit);
            setDetailedResults(formatted);
            setStructuredResults(structured);
            
        } catch (error) {
            setAlertMessage('Помилка розрахунку: ' + error.message);
        }
    };

    // Перерахунок при зміні одиниць
    useEffect(() => {
        if (results) {
            const formatted = formatYagiResults(results, measurementUnit);
            const structured = formatYagiResultsHTML(results, measurementUnit);
            setDetailedResults(formatted);
            setStructuredResults(structured);
        }
    }, [measurementUnit, results]);

    // Обробники зміни кількості елементів
    const increaseElements = () => {
        const current = parseInt(elements);
        if (current < 20) {
            setElements((current + 1).toString());
        }
    };

    const decreaseElements = () => {
        const current = parseInt(elements);
        if (current > 3) {
            setElements((current - 1).toString());
        }
    };

    return (
        <>
            {/* Зображення антени */}
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <img 
                    src={getAntennaImage()} 
                    alt="Yagi Antenna" 
                    style={{ 
                        height: 'auto', 
                        border: '1px solid var(--ifm-color-emphasis-300)', 
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        padding: '15px',
                        boxShadow: '0 2px 8px var(--ifm-color-emphasis-200)',
                        maxWidth: '100%'
                    }}
                />
                <p style={{ 
                    fontSize: '14px', 
                    color: 'var(--ifm-color-emphasis-700)', 
                    marginTop: '10px' 
                }}>
                    Схема Yagi антени: {dipoleForm === '1' ? 'петльовий' : 'розрізний'} диполь, {elementShape === '0' ? 'круглі' : 'плоскі'} елементи
                </p>
            </div>

            <div className="calculator-container">
                <table className="calculator-table">
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
                                    
                                    {/* Кількість елементів */}
                                    <tr>
                                        <td>Кількість елементів</td>
                                        <td>
                                            <div style={{display: 'flex', alignItems: 'center'}}>
                                                <button type="button" onClick={decreaseElements} style={{width: '30px'}}>-</button>
                                                <input
                                                    value={elements}
                                                    onChange={e => setElements(e.target.value)}
                                                    style={{textAlign: 'center', margin: '0 5px', flex: 1}}
                                                />
                                                <button type="button" onClick={increaseElements} style={{width: '30px'}}>+</button>
                                            </div>
                                        </td>
                                        <td>шт</td>
                                    </tr>
                                    
                                    {/* Форма активного вібратора */}
                                    <tr>
                                        <td>Форма активного вібратора</td>
                                        <td colSpan={2}>
                                            <select 
                                                value={dipoleForm} 
                                                onChange={e => setDipoleForm(e.target.value)}
                                                style={{width: '100%'}}
                                            >
                                                <option value="0">Розрізний</option>
                                                <option value="1">Петльовий</option>
                                            </select>
                                        </td>
                                    </tr>
                                    
                                    {/* Вид елементу */}
                                    <tr>
                                        <td>Вид елементу</td>
                                        <td colSpan={2}>
                                            <select 
                                                value={elementShape} 
                                                onChange={e => setElementShape(e.target.value)}
                                                style={{width: '100%'}}
                                            >
                                                <option value="0">Круглий</option>
                                                <option value="1">Плоский</option>
                                            </select>
                                        </td>
                                    </tr>
                                    
                                    {/* Діаметр елемента */}
                                    <tr>
                                        <td>{elementShape === '0' ? 'Діаметр елемента' : 'Ширина елемента'}</td>
                                        <td>
                                            <input
                                                value={elementDiameter}
                                                onChange={e => setElementDiameter(e.target.value)}
                                            />
                                        </td>
                                        <td>мм</td>
                                    </tr>
                                    
                                    {/* Товщина елемента (тільки для плоских) */}
                                    {elementShape === '1' && (
                                        <tr>
                                            <td>Товщина елемента</td>
                                            <td>
                                                <input
                                                    value={elementThickness}
                                                    onChange={e => setElementThickness(e.target.value)}
                                                />
                                            </td>
                                            <td>мм</td>
                                        </tr>
                                    )}
                                    
                                    {/* Форма буму */}
                                    <tr>
                                        <td>Форма буму</td>
                                        <td colSpan={2}>
                                            <div>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        value="round"
                                                        checked={boomForm === 'round'}
                                                        onChange={e => setBoomForm(e.target.value)}
                                                    /> Круглий
                                                </label>
                                                <label style={{marginLeft: '20px'}}>
                                                    <input
                                                        type="radio"
                                                        value="square"
                                                        checked={boomForm === 'square'}
                                                        onChange={e => setBoomForm(e.target.value)}
                                                    /> Квадратний
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                    {/* Діаметр/сторона буму */}
                                    <tr>
                                        <td>{boomForm === 'round' ? 'Діаметр буму' : 'Сторона буму'}</td>
                                        <td>
                                            <input
                                                value={boomDiameter}
                                                onChange={e => setBoomDiameter(e.target.value)}
                                            />
                                        </td>
                                        <td>мм</td>
                                    </tr>
                                    
                                    {/* Монтаж елементів */}
                                    <tr>
                                        <td>Монтаж елементів на бумі</td>
                                        <td colSpan={2}>
                                            <select 
                                                value={mountingType} 
                                                onChange={e => setMountingType(e.target.value)}
                                                style={{width: '100%'}}
                                            >
                                                <option value="0">По центру металічного буму та електрично з'єднані з ним (варіант1)</option>
                                                <option value="1">Ізольовані від буму, або монтуються на бумі зверху (варіант2)</option>
                                                <option value="2">На діелектричному бумі або на металічному, але віддалені від нього (варіант3)</option>
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
                                            <tr>
                                                <td style={{ 
                                                    padding: '8px', 
                                                    border: '1px solid var(--ifm-color-emphasis-300)',
                                                    color: 'var(--ifm-color-emphasis-800)'
                                                }}>
                                                    <strong>Довжина буму</strong>
                                                </td>
                                                <td style={{ 
                                                    padding: '8px', 
                                                    border: '1px solid var(--ifm-color-emphasis-300)',
                                                    color: 'var(--ifm-color-emphasis-700)'
                                                }}>
                                                    {formatLength(results.boomLength, measurementUnit)} {getUnitLabel(measurementUnit)}
                                                </td>
                                            </tr>
                                            <tr style={{ backgroundColor: 'var(--ifm-color-emphasis-100)' }}>
                                                <td style={{ 
                                                    padding: '8px', 
                                                    border: '1px solid var(--ifm-color-emphasis-300)',
                                                    color: 'var(--ifm-color-emphasis-800)'
                                                }}>
                                                    <strong>Підсилення</strong>
                                                </td>
                                                <td style={{ 
                                                    padding: '8px', 
                                                    border: '1px solid var(--ifm-color-emphasis-300)',
                                                    color: 'var(--ifm-color-success)'
                                                }}>
                                                    {results.gain} dBi
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    
                                    <h3 style={{ color: 'var(--ifm-color-emphasis-800)' }}>Розміри елементів:</h3>
                                    <table style={{ 
                                        width: '100%', 
                                        borderCollapse: 'collapse', 
                                        border: '1px solid var(--ifm-color-emphasis-300)',
                                        backgroundColor: 'var(--ifm-background-color)'
                                    }}>
                                        <thead>
                                            <tr style={{ backgroundColor: 'var(--ifm-color-emphasis-200)' }}>
                                                <th style={{ 
                                                    padding: '8px', 
                                                    border: '1px solid var(--ifm-color-emphasis-300)',
                                                    color: 'var(--ifm-color-emphasis-800)'
                                                }}>
                                                    Елемент
                                                </th>
                                                <th style={{ 
                                                    padding: '8px', 
                                                    border: '1px solid var(--ifm-color-emphasis-300)',
                                                    color: 'var(--ifm-color-emphasis-800)'
                                                }}>
                                                    Довжина
                                                </th>
                                                <th style={{ 
                                                    padding: '8px', 
                                                    border: '1px solid var(--ifm-color-emphasis-300)',
                                                    color: 'var(--ifm-color-emphasis-800)'
                                                }}>
                                                    Позиція
                                                </th>
                                                <th style={{ 
                                                    padding: '8px', 
                                                    border: '1px solid var(--ifm-color-emphasis-300)',
                                                    color: 'var(--ifm-color-emphasis-800)'
                                                }}>
                                                    Відстань
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.elements.map((element, index) => (
                                                <tr key={index} style={{ 
                                                    backgroundColor: index % 2 === 0 ? 'var(--ifm-color-emphasis-100)' : 'var(--ifm-background-color)' 
                                                }}>
                                                    <td style={{ 
                                                        padding: '8px', 
                                                        border: '1px solid var(--ifm-color-emphasis-300)', 
                                                        fontWeight: 'bold',
                                                        color: 'var(--ifm-color-emphasis-800)'
                                                    }}>
                                                        {element.name}
                                                    </td>
                                                    <td style={{ 
                                                        padding: '8px', 
                                                        border: '1px solid var(--ifm-color-emphasis-300)',
                                                        color: 'var(--ifm-color-emphasis-700)'
                                                    }}>
                                                        {formatLength(element.length, measurementUnit)} {getUnitLabel(measurementUnit)}
                                                    </td>
                                                    <td style={{ 
                                                        padding: '8px', 
                                                        border: '1px solid var(--ifm-color-emphasis-300)',
                                                        color: 'var(--ifm-color-emphasis-700)'
                                                    }}>
                                                        {formatLength(element.position, measurementUnit)} {getUnitLabel(measurementUnit)}
                                                    </td>
                                                    <td style={{ 
                                                        padding: '8px', 
                                                        border: '1px solid var(--ifm-color-emphasis-300)',
                                                        color: 'var(--ifm-color-emphasis-700)'
                                                    }}>
                                                        {index > 0 ? 
                                                            `${formatLength(element.distance, measurementUnit)} ${getUnitLabel(measurementUnit)}` : 
                                                            '0'
                                                        }
                                                    </td>
                                                </tr>
                                            ))}
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
                                            <div><strong>Форма вібратора:</strong> {structuredResults.header.dipoleForm}</div>
                                            <div><strong>Вид елемента:</strong> {structuredResults.header.elementShape}</div>
                                            <div><strong>Бум:</strong> з {structuredResults.header.boomForm} перерізом</div>
                                        </div>
                                    </div>

                                    {/* Основні параметри */}
                                    <div style={{ marginBottom: '20px' }}>
                                        <h4 style={{ color: 'var(--ifm-color-primary)', marginBottom: '10px' }}>📊 Основні параметри</h4>
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
                                                <span><strong>Частота:</strong></span>
                                                <span>{structuredResults.basicParams.frequency}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ifm-color-emphasis-700)' }}>
                                                <span><strong>Довжина хвилі:</strong></span>
                                                <span>{structuredResults.basicParams.wavelength}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ifm-color-emphasis-700)' }}>
                                                <span><strong>Кількість елементів:</strong></span>
                                                <span>{structuredResults.basicParams.totalElements}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ifm-color-emphasis-700)' }}>
                                                <span><strong>Довжина буму:</strong></span>
                                                <span>{structuredResults.basicParams.boomLength}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ifm-color-emphasis-700)' }}>
                                                <span><strong>Підсилення:</strong></span>
                                                <span style={{ color: 'var(--ifm-color-success)', fontWeight: 'bold' }}>{structuredResults.basicParams.gain}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Елементи антени */}
                                    <div style={{ marginBottom: '20px' }}>
                                        <h4 style={{ color: 'var(--ifm-color-primary)', marginBottom: '10px' }}>📏 Детальні розміри елементів</h4>
                                        {structuredResults.elements.map((element, index) => (
                                            <div key={index} style={{
                                                backgroundColor: element.type === 'reflector' ? 'var(--ifm-color-warning-contrast-background)' : 
                                                              element.type === 'dipole' ? 'var(--ifm-color-info-contrast-background)' : 'var(--ifm-color-success-contrast-background)',
                                                border: `1px solid ${element.type === 'reflector' ? 'var(--ifm-color-warning-contrast-foreground)' : 
                                                                    element.type === 'dipole' ? 'var(--ifm-color-info-contrast-foreground)' : 'var(--ifm-color-success-contrast-foreground)'}`,
                                                borderRadius: '8px',
                                                padding: '15px',
                                                marginBottom: '10px'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                    <span style={{ 
                                                        fontSize: '18px', 
                                                        fontWeight: 'bold',
                                                        marginRight: '10px',
                                                        color: element.type === 'reflector' ? 'var(--ifm-color-warning-dark)' : 
                                                              element.type === 'dipole' ? 'var(--ifm-color-info-dark)' : 'var(--ifm-color-success-dark)'
                                                    }}>
                                                        {element.type === 'reflector' ? '🔄' : 
                                                         element.type === 'dipole' ? '📡' : '➡️'} {element.name}
                                                    </span>
                                                    <span style={{ 
                                                        fontSize: '14px', 
                                                        color: 'var(--ifm-color-emphasis-600)',
                                                        textTransform: 'capitalize'
                                                    }}>
                                                        {element.type === 'reflector' ? 'Рефлектор' : 
                                                         element.type === 'dipole' ? 'Активний диполь' : 'Директор'}
                                                    </span>
                                                </div>
                                                
                                                <div style={{ 
                                                    display: 'grid', 
                                                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                                                    gap: '10px',
                                                    color: 'var(--ifm-color-emphasis-700)'
                                                }}>
                                                    <div>
                                                        <strong>Довжина:</strong><br/>
                                                        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{element.length}</span>
                                                    </div>
                                                    <div>
                                                        <strong>Позиція на бумі:</strong><br/>
                                                        <span style={{ fontSize: '16px' }}>{element.position}</span>
                                                    </div>
                                                    {index > 0 && (
                                                        <div>
                                                            <strong>Відстань від попереднього:</strong><br/>
                                                            <span style={{ fontSize: '16px' }}>{element.distance}</span>
                                                        </div>
                                                    )}
                                                    {element.gap && (
                                                        <div>
                                                            <strong>Проміжок живлення:</strong><br/>
                                                            <span style={{ fontSize: '16px', color: 'var(--ifm-color-danger)' }}>≤ {element.gap}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Примітки */}
                                    <div style={{ 
                                        backgroundColor: 'var(--ifm-color-emphasis-100)', 
                                        padding: '15px', 
                                        borderRadius: '8px',
                                        border: '1px solid var(--ifm-color-emphasis-300)'
                                    }}>
                                        <h4 style={{ color: 'var(--ifm-color-emphasis-800)', marginBottom: '10px' }}>🔧 Примітки до монтажу</h4>
                                        <p style={{ margin: '0', lineHeight: '1.6', color: 'var(--ifm-color-emphasis-700)' }}>
                                            {structuredResults.mounting}
                                        </p>
                                        <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: 'var(--ifm-color-emphasis-600)', fontStyle: 'italic' }}>
                                            Розрахунок ведеться з урахуванням бумкорекції за методикою DL6WU.
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
