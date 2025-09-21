import { useState, useEffect } from 'react';
import '@site/src/css/calculators.css';

// Дані про кабелі та з'єднувачі з оригінального калькулятора
const ELEMENTS = {
    "Connectors": [
        {"type": "connector", "title": "PL-259 / SO-239", "manufacturer": "Generic", "group": "UHF", "impedance": 50, "losses": {"500": 0.15}},
        {"type": "connector", "title": "BNC", "manufacturer": "Generic", "group": "BNC", "impedance": 50, "losses": {"3000": 0.2}},
        {"type": "connector", "title": "N Type", "manufacturer": "Generic", "group": "N Type", "impedance": 50, "losses": {"10000": 0.15}},
        {"type": "connector", "title": "SMA", "manufacturer": "Generic", "group": "SMA", "impedance": 50, "losses": {"12400": 0.04}}
    ],
    "RG-58": [
        {"type": "cable", "title": "RG-58", "manufacturer": "Generic", "group": "RG-58", "conductors": "stranded", "impedance": 50, "losses": {"100": 14.8, "200": 22.3, "400": 32.8, "700": 48.9, "900": 52.8}},
        {"type": "cable", "title": "TAS-RG58CU", "manufacturer": "Tasker", "group": "RG-58", "conductors": "stranded", "impedance": 50, "losses": {"50": 9.7, "100": 13.9, "200": 20.4, "400": 30, "800": 45.1, "1000": 51.8}},
        {"type": "cable", "title": "RG-58 C/U (4930)", "manufacturer": "Одескабель", "group": "RG-58", "conductors": "stranded", "impedance": 50, "losses": {"10": 5, "100": 17.9, "1000": 75.1}},
        {"type": "cable", "title": "RG-58ТС90", "manufacturer": "FinMark", "group": "RG-58", "conductors": "stranded", "impedance": 50, "losses": {"1": 1.4, "10": 4.9, "50": 10.8, "100": 16.1, "200": 23.9, "400": 37.7, "700": 55.1, "1000": 66.2}},
        {"type": "cable", "title": "RG-58U", "manufacturer": "Eurosat", "group": "RG-58", "conductors": "solid", "impedance": 50, "losses": {"150": 13.4, "450": 24.1, "800": 32.7, "900": 34.8, "1200": 40.6, "1800": 51.1, "1900": 52.6, "2450": 60.4}}
    ],
    "3D-FB": [
        {"type": "cable", "title": "3D-FB", "manufacturer": "HONGSEN CABLE", "group": "3D-FB", "conductors": "solid", "impedance": 50, "losses": {"100": 10.4, "150": 13, "280": 17.5, "350": 19.5, "400": 21.5, "800": 30.5, "900": 31.8, "1200": 37.2, "1500": 41.5, "1800": 45.6, "1900": 46.8, "2000": 48.2, "2200": 50.6, "2500": 54}}
    ],
    "РК 50": [
        {"type": "cable", "title": "РК 50-3 (4693)", "manufacturer": "Одескабель", "group": "РК 50", "conductors": "solid", "impedance": 50, "losses": {"200": 15.3, "1000": 33.5}},
        {"type": "cable", "title": "РК 50-4,8-а90П (4622)", "manufacturer": "Одескабель", "group": "РК 50", "conductors": "solid", "impedance": 50, "losses": {"200": 9.4, "1000": 24}},
        {"type": "cable", "title": "РК 50-7-11 ОКЗ (4178)", "manufacturer": "Одескабель", "group": "РК 50", "conductors": "solid", "impedance": 50, "losses": {"200": 14, "1000": 32.5}},
        {"type": "cable", "title": "РК 50-7,2-а90П (4977)", "manufacturer": "Одескабель", "group": "РК 50", "conductors": "solid", "impedance": 50, "losses": {"10": 1.5, "100": 4.5, "1000": 14.5, "2000": 20.5, "3000": 25.5}}
    ],
    "RG-8": [
        {"type": "cable", "title": "RG-8", "manufacturer": "Pasternack", "group": "RG-8", "conductors": "stranded", "impedance": 50, "losses": {"1": 0.66, "10": 1.97, "50": 4.27, "400": 13.45, "700": 21.33, "900": 24.93, "1000": 26.25}},
        {"type": "cable", "title": "RG-8-49П (4932)", "manufacturer": "Одескабель", "group": "RG-8", "conductors": "solid", "impedance": 50, "losses": {"10": 1.3, "100": 4.1, "1000": 15, "2000": 22.9, "3000": 29.7}}
    ],
    "LMR-400": [
        {"type": "cable", "title": "LMR-400", "manufacturer": "Times Microwave", "group": "LMR-400", "conductors": "solid", "impedance": 50, "losses": {"30": 2.2, "50": 2.9, "150": 5, "220": 6.1, "450": 8.9, "900": 12.8, "1500": 16.8, "1800": 18.6, "2000": 19.6, "2500": 22.2, "5800": 35.5, "8000": 42.7}},
        {"type": "cable", "title": "LMR-400", "manufacturer": "ProSoft", "group": "LMR-400", "conductors": "solid", "impedance": 50, "losses": {"900": 12.8, "2500": 22.2, "5800": 35.5}}
    ],
    "RG-213": [
        {"type": "cable", "title": "RG-213/U (4932)", "manufacturer": "Одескабель", "group": "RG-213", "conductors": "stranded", "impedance": 50, "losses": {"200": 14, "1000": 32.5}}
    ],
    "RG-174": [
        {"type": "cable", "title": "RG-174", "manufacturer": "Generic", "group": "RG-174", "conductors": "stranded", "impedance": 50, "losses": {"100": 27.6, "200": 41, "400": 62.3, "700": 88.6, "900": 101.8}},
        {"type": "cable", "title": "RG-174 (8819034)", "manufacturer": "Одескабель", "group": "RG-174", "conductors": "stranded", "impedance": 50, "losses": {"50": 18.3, "150": 29.8}},
        {"type": "cable", "title": "RG174A/U", "manufacturer": "Pasternack", "group": "RG-174", "conductors": "stranded", "impedance": 50, "losses": {"100": 27.56, "400": 62.34, "1000": 104.99}}
    ],
    "RG-178": [
        {"type": "cable", "title": "RG-178", "manufacturer": "Generic", "group": "RG-178", "conductors": "stranded", "impedance": 50, "losses": {"100": 52.49, "400": 108.27, "1000": 170.61}}
    ],
    "Attenuators": [
        {"type": "attenuator", "title": "0.5 dB", "manufacturer": "Generic", "group": "Attenuator", "impedance": 50, "losses": {"10000": 0.5}},
        {"type": "attenuator", "title": "0.8 dB", "manufacturer": "Generic", "group": "Attenuator", "impedance": 50, "losses": {"10000": 0.8}},
        {"type": "attenuator", "title": "1 dB", "manufacturer": "Generic", "group": "Attenuator", "impedance": 50, "losses": {"10000": 1}},
        {"type": "attenuator", "title": "2 dB", "manufacturer": "Generic", "group": "Attenuator", "impedance": 50, "losses": {"10000": 2}},
        {"type": "attenuator", "title": "3 dB", "manufacturer": "Generic", "group": "Attenuator", "impedance": 50, "losses": {"10000": 3}},
        {"type": "attenuator", "title": "5 dB", "manufacturer": "Generic", "group": "Attenuator", "impedance": 50, "losses": {"10000": 5}}
    ]
};

// Стандартні частоти для розрахунків
const BANDS = [1.9, 3.75, 7.15, 14.15, 27.5, 52.0, 145.0, 435.0];

// Генерація UUID
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export default function CoaxLossCalculator() {
    const [nodes, setNodes] = useState([]);
    const [power, setPower] = useState(50);
    const [showModal, setShowModal] = useState(false);
    const [selectedElement, setSelectedElement] = useState('');
    const [quantity, setQuantity] = useState('');
    const [results, setResults] = useState([]);

    // Ініціалізація елементів з UUID
    const initializeElements = () => {
        const elementsWithIds = {};
        Object.keys(ELEMENTS).forEach(groupId => {
            elementsWithIds[groupId] = ELEMENTS[groupId].map(element => ({
                ...element,
                id: generateUUID()
            }));
        });
        return elementsWithIds;
    };

    const [elementsWithIds] = useState(() => initializeElements());

    // Розрахунок втрат
    const calculateLosses = () => {
        const newResults = [];
        
        BANDS.forEach(band => {
            let bandLoss = 0;
            
            nodes.forEach(node => {
                if (node.quantity > 0) {
                    if (node.type === 'attenuator') {
                        bandLoss += node.losses[Object.keys(node.losses)[0]] * node.quantity;
                    } else {
                        const losses = node.losses;
                        const frequencies = Object.keys(losses).map(f => parseFloat(f)).sort((a, b) => a - b);
                        
                        const lowerFreqs = frequencies.filter(f => f < band).sort((a, b) => b - a);
                        const upperFreqs = frequencies.filter(f => f >= band).sort((a, b) => a - b);
                        
                        const lowerFreq = lowerFreqs.length > 0 ? lowerFreqs[0] : 0;
                        const upperFreq = upperFreqs.length > 0 ? upperFreqs[0] : null;
                        
                        if (upperFreq !== null) {
                            const lowerLoss = lowerFreq !== 0 ? losses[lowerFreq.toString()] : 0;
                            const upperLoss = losses[upperFreq.toString()];
                            
                            if (upperLoss !== undefined) {
                                // Лінійна інтерполяція
                                const m = (upperLoss - lowerLoss) / (upperFreq - lowerFreq);
                                const b = upperLoss - m * upperFreq;
                                const loss = m * band + b;
                                
                                if (node.type === 'cable') {
                                    bandLoss += (loss * node.quantity) / 100;
                                } else {
                                    bandLoss += loss * node.quantity;
                                }
                            }
                        }
                    }
                }
            });
            
            if (bandLoss > 0) {
                const bandLossPercent = Math.pow(10, ((-1) * bandLoss) / 10);
                const bandLossPercentValue = (1 - bandLossPercent) * 100;
                const outputPower = power * bandLossPercent;
                
                let backgroundColor = '#bfffac'; // зелений
                if (bandLossPercentValue >= 50 && bandLossPercentValue < 80) {
                    backgroundColor = '#fffeac'; // жовтий
                } else if (bandLossPercentValue >= 80) {
                    backgroundColor = '#ffacac'; // червоний
                }
                
                newResults.push({
                    frequency: band,
                    loss: bandLoss,
                    lossPercent: bandLossPercentValue,
                    outputPower: outputPower,
                    backgroundColor: backgroundColor
                });
            }
        });
        
        setResults(newResults);
    };

    // Додавання нового вузла
    const addNode = () => {
        if (!selectedElement) {
            alert('Виберіть кабель або з\'єднувач');
            return;
        }
        
        const qty = parseFloat(quantity);
        if (!qty || isNaN(qty) || qty <= 0) {
            alert('Введіть коректну довжину/кількість');
            return;
        }
        
        // Знаходимо вибраний елемент
        let foundElement = null;
        Object.keys(elementsWithIds).forEach(groupId => {
            elementsWithIds[groupId].forEach(element => {
                if (element.id === selectedElement) {
                    foundElement = element;
                }
            });
        });
        
        if (!foundElement) {
            alert('Елемент не знайдено');
            return;
        }
        
        const newNode = {
            id: generateUUID(),
            type: foundElement.type,
            title: foundElement.title,
            manufacturer: foundElement.manufacturer,
            group: foundElement.group,
            impedance: foundElement.impedance,
            losses: foundElement.losses,
            quantity: qty
        };
        
        setNodes([...nodes, newNode]);
        setSelectedElement('');
        setQuantity('');
        setShowModal(false);
    };

    // Видалення вузла
    const removeNode = (nodeId) => {
        setNodes(nodes.filter(node => node.id !== nodeId));
    };

    // Оновлення кількості вузла
    const updateNodeQuantity = (nodeId, newQuantity) => {
        const qty = parseFloat(newQuantity) || 0;
        setNodes(nodes.map(node => 
            node.id === nodeId ? { ...node, quantity: qty } : node
        ));
    };

    // Перерахунок при зміні вузлів або потужності
    useEffect(() => {
        calculateLosses();
    }, [nodes, power]);

    // Рендер опцій для селекта
    const renderSelectOptions = () => {
        const options = [
            <option key="empty" value="">Виберіть коаксіальний кабель або з'єднувач</option>
        ];
        
        Object.keys(elementsWithIds).forEach(groupId => {
            let groupTitle = groupId;
            if (groupId === 'Connectors') groupTitle = 'З\'єднувачі';
            if (groupId === 'Attenuators') groupTitle = 'Атенюатори';
            
            const groupOptions = elementsWithIds[groupId].map(element => (
                <option key={element.id} value={element.id}>
                    {element.group} ({element.manufacturer === 'Generic' ? 'Стандартний' : element.manufacturer} {element.title})
                    {element.conductors ? ` [${element.conductors === 'solid' ? 'Моножила' : 'Багатожильний'}]` : ''}
                </option>
            ));
            
            options.push(
                <optgroup key={groupId} label={groupTitle}>
                    {groupOptions}
                </optgroup>
            );
        });
        
        return options;
    };

    return (
        <>
            <div className="coax-calculator-container">
                {/* Кнопка додавання вузла */}
                <div style={{ marginBottom: '20px' }}>
                    <button 
                        onClick={() => setShowModal(true)}
                        style={{
                            backgroundColor: 'var(--ifm-color-success)',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        Додати вузол
                    </button>
                </div>

                {/* Таблиця вузлів */}
                <div style={{ marginBottom: '20px' }}>
                    <table className="coax-calculator-table">
                        <thead>
                            <tr style={{ backgroundColor: 'var(--ifm-color-emphasis-100)' }}>
                                <th style={{ width: '20%' }}>Вузол</th>
                                <th style={{ width: '50%' }}>Заголовок</th>
                                <th style={{ width: '25%' }}>Довжина, м</th>
                                <th style={{ width: '15%' }}>Дії</th>
                            </tr>
                        </thead>
                        <tbody>
                            {nodes.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: 'var(--ifm-color-emphasis-600)' }}>
                                        Жодного вузла не додано.
                                    </td>
                                </tr>
                            ) : (
                                nodes.map(node => (
                                    <tr key={node.id}>
                                        <td>
                                            {node.group}
                                        </td>
                                        <td>
                                            {node.title} ({node.manufacturer})
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                min="0"
                                                step={node.type === 'cable' ? '0.01' : '1'}
                                                value={node.quantity}
                                                onChange={(e) => updateNodeQuantity(node.id, e.target.value)}
                                                placeholder={node.type === 'cable' ? 'Довжина кабелю' : 'Кількість'}
                                            />
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => removeNode(node.id)}
                                                style={{
                                                    backgroundColor: 'var(--ifm-color-danger)',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '5px 10px',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Видалити
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Поле потужності */}
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="power" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Вихідна потужність трансівера, Вт:
                    </label>
                    <input
                        type="number"
                        id="power"
                        min="0"
                        step="0.01"
                        value={power}
                        onChange={(e) => setPower(parseFloat(e.target.value) || 0)}
                        style={{ padding: '8px', fontSize: '16px', width: '200px' }}
                    />
                </div>

                {/* Таблиця результатів */}
                <div>
                    <table className="coax-calculator-table">
                        <thead>
                            <tr style={{ backgroundColor: 'var(--ifm-color-emphasis-100)' }}>
                                <th style={{ width: '40%' }}>Частота</th>
                                <th style={{ width: '25%' }}>Втрати, дБ</th>
                                <th style={{ width: '25%' }}>Втрати, %</th>
                                <th style={{ width: '30%' }}>Вихідна потужність, Вт</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: 'var(--ifm-color-emphasis-600)' }}>
                                        Заповніть форму вище, щоб отримати розрахунки.
                                    </td>
                                </tr>
                            ) : (
                                results.map((result, index) => (
                                    <tr key={index} style={{ backgroundColor: result.backgroundColor }}>
                                        <td>
                                            {result.frequency.toFixed(1)} MHz
                                        </td>
                                        <td>
                                            {result.loss.toFixed(2)} dB
                                        </td>
                                        <td>
                                            {result.lossPercent.toFixed(0)}%
                                        </td>
                                        <td>
                                            {result.outputPower.toFixed(2)} W
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Модальне вікно для додавання вузла */}
            {showModal && (
                <div className="coax-modal-overlay">
                    <div className="coax-modal-content">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, color: 'var(--ifm-color-emphasis-800)' }}>Додати вузол</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: 'var(--ifm-color-emphasis-600)'
                                }}
                            >
                                ×
                            </button>
                        </div>
                        
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Додати вузол
                            </label>
                            <select
                                value={selectedElement}
                                onChange={(e) => setSelectedElement(e.target.value)}
                                style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                            >
                                {renderSelectOptions()}
                            </select>
                        </div>
                        
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                Довжина кабелю (у метрах) або кількість з'єднувачів/атенюаторів
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                            />
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={addNode}
                                style={{
                                    backgroundColor: 'var(--ifm-color-success)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Додати
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    backgroundColor: 'var(--ifm-color-danger)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Закрити
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
