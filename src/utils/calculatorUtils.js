// Універсальна бібліотека допоміжних функцій для калькуляторів антен

/**
 * Форматування довжини в різних одиницях
 */
export const formatLength = (valueInMm, unit = 'cm', precision = 2) => {
    switch (unit) {
        case 'm':
            return (valueInMm / 1000).toFixed(4);
        case 'cm':
            return (valueInMm / 10).toFixed(precision);
        case 'mm':
        default:
            return valueInMm.toFixed(1);
    }
};

/**
 * Отримання підпису одиниці
 */
export const getUnitLabel = (unit) => {
    switch (unit) {
        case 'm':
            return 'м';
        case 'cm':
            return 'см';
        case 'mm':
        default:
            return 'мм';
    }
};

/**
 * Конвертація значення з сантиметрів в задану одиницю
 */
export const convertFromCm = (valueInCm, unit) => {
    switch (unit) {
        case 'm':
            return (valueInCm / 100).toFixed(4);
        case 'mm':
            return (valueInCm * 10).toFixed(1);
        case 'cm':
        default:
            return parseFloat(valueInCm).toFixed(2);
    }
};

/**
 * Функція для стандартних частот
 */
export const getStandardFrequencies = () => [
    { value: '', label: 'Ввести частоту вручну' },
    { value: '144', label: '144 МГц (2м)' },
    { value: '433.9', label: 'LPD' },
    { value: '446', label: 'PMR' },
    { value: '462.64', label: 'GMRS' },
    { value: '465.135', label: 'FRS' },
    { value: '925', label: 'GSM 900' }
];

/**
 * Функція для стандартних частот Харченко антени
 */
export const getKharchenkoFrequencies = () => [
    { value: '', label: 'Частота вручну' },
    { value: '433.9', label: 'LPD' },
    { value: '446', label: 'PMR' },
    { value: '462.64', label: 'GMRS' },
    { value: '465.135', label: 'FRS' },
    { value: '811', label: 'LTE 800 (band20)' },
    { value: '925', label: 'GSM 900' },
    { value: '1795', label: 'LTE 1800 (band 3)' },
    { value: '2045', label: 'LTE 2100 (band 1)' },
    { value: '2350', label: 'LTE 2300 (band 40)' },
    { value: '2445', label: 'Wi-Fi 2400' },
    { value: '2600', label: 'LTE 2600 (band 7)' }
];

/**
 * Розрахунок довжини хвилі
 */
export const calculateWavelength = (frequency) => {
    return 299792.458 / frequency; // у мм
};

/**
 * Розрахунок коефіцієнта буму для Yagi антени
 */
export const calculateBoomCorrection = (boomDiameter, wavelength, isRound = true, mountingType = 0) => {
    const ratio = boomDiameter / wavelength;
    let correction = ratio * ratio * (630 * ratio * ratio - 164 * ratio + 13.5);
    
    if (!isRound) {
        correction = ratio * ratio * (1221 * ratio * ratio - 269.4 * ratio + 18.8);
    }
    
    if (mountingType === 0) {
        correction *= 2;
    }
    
    return correction;
};

/**
 * Функція DL6WU для розрахунку Yagi антени
 */
export const calculateYagiDL6WU = (frequency, elements, boomDiameter, elementDiameter, mountingType, dipoleForm, boomForm, elementShape, elementThickness = 0) => {
    const wavelength = calculateWavelength(frequency);
    const lambda = wavelength / 1000; // в метрах для розрахунків
    
    // Базові параметри
    const results = {
        wavelength: wavelength,
        totalElements: elements,
        mounting: mountingType,
        dipoleForm: dipoleForm,
        elementShape: elementShape,
        boomForm: boomForm,
        elements: [],
        boomLength: 0,
        gain: 0
    };
    
    // Розрахунок коефіцієнта буму
    const boomCorrection = calculateBoomCorrection(boomDiameter, wavelength, boomForm === 'round', mountingType);
    
    // Базові довжини елементів (приблизні формули DL6WU)
    const reflectorLength = 0.508 * lambda; // 508 мм на метр
    const dipoleLength = dipoleForm === 1 ? 0.505 * lambda : 0.473 * lambda; // петльовий або розрізний
    
    // Рефлектор
    results.elements.push({
        type: 'reflector',
        name: 'R',
        length: (reflectorLength * 1000) + (boomCorrection * wavelength), // мм
        position: 0,
        distance: 0
    });
    
    // Диполь (активний вібратор)
    const dipolePosition = 0.2 * lambda * 1000; // мм
    results.elements.push({
        type: 'dipole',
        name: 'F',
        length: (dipoleLength * 1000) + (boomCorrection * wavelength), // мм
        position: dipolePosition,
        distance: dipolePosition,
        gap: dipoleForm === 1 ? 0.012 * lambda * 1000 : undefined // для петльового
    });
    
    // Директори
    let directorPosition = dipolePosition;
    const directorSpacing = 0.2 * lambda * 1000; // початкова відстань між директорами
    
    for (let i = 1; i <= elements - 2; i++) {
        const spacingMultiplier = 1 + (i - 1) * 0.15; // збільшення відстані
        const lengthReduction = 0.95 - (i - 1) * 0.01; // зменшення довжини
        
        directorPosition += directorSpacing * spacingMultiplier;
        
        results.elements.push({
            type: 'director',
            name: `D${i}`,
            length: (dipoleLength * lengthReduction * 1000) + (boomCorrection * wavelength), // мм
            position: directorPosition,
            distance: directorPosition - results.elements[results.elements.length - 1].position
        });
    }
    
    // Загальна довжина буму
    results.boomLength = directorPosition;
    
    // Приблизне підсилення (емпірична формула)
    results.gain = 10 + 1.5 * Math.log10(elements) + 10 * Math.log10(results.boomLength / wavelength);
    results.gain = Math.round(results.gain * 10) / 10;
    
    return results;
};

/**
 * Форматування результатів Yagi в структурованому HTML вигляді
 */
export const formatYagiResultsHTML = (results, unit = 'mm') => {
    const mountingTexts = [
        'Елементи монтуються по центру металічного буму та електрично з\'єднані з ним.',
        'Елементи ізольовані від буму, або монтуються на бумі зверху.',
        'Елементи на діелектричному бумі або на металічному, але віддалені від нього.'
    ];

    return {
        header: {
            title: 'Волновий канал Long-yagi DL6WU',
            subtitle: 'Javascript Version 2025-09-10 by UARO (based on DL6WU.BAS source code)',
            dipoleForm: results.dipoleForm === 1 ? 'Петльовий' : 'Розрізний',
            elementShape: results.elementShape === 'round' ? 'Круглий' : 'Плоский',
            boomForm: results.boomForm === 'round' ? 'круглим' : 'квадратним'
        },
        basicParams: {
            frequency: `${results.frequency} МГц`,
            wavelength: `${formatLength(results.wavelength, unit)} ${getUnitLabel(unit)}`,
            totalElements: results.totalElements,
            boomLength: `${formatLength(results.boomLength, unit)} ${getUnitLabel(unit)}`,
            gain: `${results.gain} dBi (прибл.)`
        },
        elements: results.elements.map((element, index) => ({
            name: element.name,
            type: element.type,
            length: `${formatLength(element.length, unit)} ${getUnitLabel(unit)}`,
            position: `${formatLength(element.position, unit)} ${getUnitLabel(unit)}`,
            distance: index > 0 ? `${formatLength(element.distance, unit)} ${getUnitLabel(unit)}` : '0',
            gap: element.gap ? `${formatLength(element.gap, unit)} ${getUnitLabel(unit)}` : null
        })),
        mounting: mountingTexts[results.mounting]
    };
};

/**
 * Форматування результатів Yagi в текстовому вигляді
 */
export const formatYagiResults = (results, unit = 'mm') => {
    let output = `Javascript Version 2025-09-10 by UARO\n`;
    output += `based on DL6WU.BAS source code\n`;
    output += `Волновий канал Long-yagi DL6WU\n`;
    output += `-------------------------------------------------------------\n`;
    output += `Форма активного вібратора: ${results.dipoleForm === 1 ? 'Петльовий' : 'Розрізний'}\n`;
    output += `Вид елемента: ${results.elementShape === 'round' ? 'Круглий' : 'Плоский'}\n`;
    output += `Бум з ${results.boomForm === 'round' ? 'круглим' : 'квадратним'} поперечним перерізом.\n`;
    output += `-------------------------------------------------------------\n`;
    output += `Частота f: ${results.frequency} МГц\n`;
    output += `Довжина хвилі λ: ${formatLength(results.wavelength, unit)} ${getUnitLabel(unit)}\n`;
    output += `-------------------------------------------------------------\n`;
    output += `Загальне число елементів: ${results.totalElements}\n`;
    output += `Довжина стріли: ${formatLength(results.boomLength, unit)} ${getUnitLabel(unit)}\n`;
    output += `Підсилення: ${results.gain} dBi (прибл.)\n`;
    output += `-------------------------------------------------------------\n`;
    
    results.elements.forEach((element, index) => {
        output += `Довжина ${element.name}: ${formatLength(element.length, unit)} ${getUnitLabel(unit)}\n`;
        output += `Позиція ${element.name}: ${formatLength(element.position, unit)} ${getUnitLabel(unit)}\n`;
        
        if (element.gap) {
            output += `Проміжок в місці підключення g <= ${formatLength(element.gap, unit)} ${getUnitLabel(unit)}\n`;
        }
        
        if (index > 0) {
            output += `Відстань ${results.elements[index-1].name}-${element.name}: ${formatLength(element.distance, unit)} ${getUnitLabel(unit)}\n`;
        }
        
        output += `-------------------------------------------------------------\n`;
    });
    
    const mountingTexts = [
        'Елементи монтуються по центру металічного буму та електрично з\'єднані з ним.',
        'Елементи ізольовані від буму, або монтуються на бумі зверху.',
        'Елементи на діелектричному бумі або на металічному, але віддалені від нього.'
    ];
    
    output += mountingTexts[results.mounting] + '\n';
    output += `Розрахунок ведеться з урахуванням бумкорекції.\n`;
    
    return output;
};

/**
 * Перевірка валідності вхідних даних
 */
export const validateYagiInputs = (frequency, elements, boomDiameter, elementDiameter) => {
    const errors = [];
    
    if (!frequency || frequency <= 0) {
        errors.push('Некоректна частота');
    }
    
    if (!elements || elements < 3) {
        errors.push('Мінімальна кількість елементів - 3');
    }
    
    if (!boomDiameter || boomDiameter <= 0) {
        errors.push('Некоректний діаметр буму');
    }
    
    if (!elementDiameter || elementDiameter <= 0) {
        errors.push('Некоректний діаметр елемента');
    }
    
    if (frequency && boomDiameter) {
        const wavelength = calculateWavelength(frequency);
        if (boomDiameter / wavelength > 0.09) {
            errors.push('Діаметр буму занадто великий для цієї частоти');
        }
    }
    
    return errors;
};

/**
 * Розрахунок антени Харченко (BiQuad)
 */
export const calculateKharchenko = (frequency, impedance = 50, measurementUnit = 'mm') => {
    const wavelength = calculateWavelength(frequency); // в мм
    
    // Коефіцієнти з оригінального коду (точна копія)
    const n = [1.02632601918224, 0.180628960318941]; // для 75Ω
    const L = [1.02632601918224, 0.147486031820053]; // для рефлектора 75Ω
    const a = [0.138647917553682, 0.218190945951014, 0.452953356151472, 0.671144302102486]; // для 75Ω
    const i = [0.138647917553682, 0.204381392409811, 0.452953356151472, 0.662858569977764]; // для 50Ω
    
    const K = 0.12033644955805;
    const wireThickness = 0.0099;
    const bendAngle = 1.3962634015954636; // радіани
    
    // Основні розрахунки
    const wireRadius = K * wavelength;
    const wireDiameter = getActualWireDiameter(wireThickness * wavelength);
    
    let W, H, D, G0, G1, G2, G3;
    
    // Розрахунки залежно від імпедансу (точно як в оригіналі)
    if (impedance === 50) {
        W = (i[3] + K) * wavelength; // загальна довжина рамок
        H = (i[1] + K) * wavelength; // ширина рамок
        D = L[1] * wavelength - 0.4; // відстань до рефлектора
        G0 = i[0] * wavelength;
        G1 = i[1] * wavelength;
        G2 = i[2] * wavelength;
        G3 = i[3] * wavelength;
    } else { // 75Ω
        W = (a[3] + K) * wavelength; // загальна довжина рамок
        H = (a[1] + K) * wavelength; // ширина рамок
        D = n[1] * wavelength - 0.4; // відстань до рефлектора
        G0 = a[0] * wavelength;
        G1 = a[1] * wavelength;
        G2 = a[2] * wavelength;
        G3 = a[3] * wavelength;
    }
    
    // Розміри рефлектора
    const reflectorSize = n[0] * wavelength;
    
    // Розрахунок довжин сторін рамок (точно як в оригіналі)
    const qs1Length = Math.sqrt(
        Math.pow(G0/2 - wireRadius*Math.cos(bendAngle/2)/2 - (G1/2 + wireRadius*Math.cos(bendAngle/2)/2), 2) +
        Math.pow(wireRadius*Math.sin(bendAngle/2)/2 - (G2/2 - wireRadius*Math.sin(bendAngle/2)/2), 2)
    );
    
    const qs2Length = Math.sqrt(
        Math.pow(G1/2 + wireRadius*Math.cos(bendAngle/2)/2 - wireRadius*Math.cos(bendAngle/2)/2, 2) +
        Math.pow(G2/2 + wireRadius*Math.sin(bendAngle/2)/2 - (G3/2 + wireRadius*Math.sin(bendAngle/2)/2), 2)
    );
    
    // Додаткові параметри
    const arcLength1 = Math.PI * wireRadius / 3;
    const arcLength2 = 5 * Math.PI * wireRadius / 36;
    const totalWireLength = 4 * (qs1Length + qs2Length + arcLength1 + arcLength2);
    const bendRadius = wireRadius / 2;
    const gap = G0 - wireRadius - wireDiameter;
    const guidesDiameter = wireRadius - wireDiameter;
    
    return {
        frequency: frequency,
        impedance: impedance,
        wavelength: wavelength,
        W: W, // загальна довжина рамок
        H: H, // ширина рамок
        D: D, // відстань до рефлектора
        reflectorWidth: reflectorSize, // B
        reflectorLength: reflectorSize, // A
        wireDiameter: wireDiameter,
        qs1: qs1Length + 2*arcLength1/3,
        qs2: qs2Length + arcLength2 + arcLength1/3,
        bendRadius: bendRadius,
        gap: gap,
        totalWireLength: totalWireLength,
        G0: G0,
        G1: G1,
        G2: G2,
        G3: G3,
        guidesDiameter: guidesDiameter
    };
};

/**
 * Отримання фактичного діаметра дроту (з оригінального коду)
 */
export const getActualWireDiameter = (theoreticalDiameter) => {
    const crossSection = Math.PI * theoreticalDiameter * theoreticalDiameter / 4;
    const standardSections = [0.5, 0.75, 1, 1.5, 2, 2.5, 4, 6, 10, 16, 25, 35, 50, 70];
    
    let actualDiameter = 0;
    for (let i = 0; i < standardSections.length - 1; i++) {
        if (crossSection > standardSections[i] && crossSection < standardSections[i + 1]) {
            const targetSection = crossSection > (standardSections[i] + standardSections[i + 1]) / 2 
                ? standardSections[i + 1] 
                : standardSections[i];
            actualDiameter = 2 * Math.sqrt(targetSection / Math.PI);
            break;
        }
    }
    
    // Якщо не знайдено відповідність, повертаємо теоретичний діаметр
    if (actualDiameter === 0) {
        actualDiameter = theoreticalDiameter;
    }
    
    return actualDiameter;
};

/**
 * Конвертація діаметра дроту в AWG (з оригінального коду)
 */
export const convertToAWG = (diameterMm) => {
    let awg = "";
    if (diameterMm <= 12) {
        if (diameterMm >= 11) {
            awg = "0000";
        } else if (diameterMm >= 10) {
            awg = "000";
        } else if (diameterMm >= 8.6) {
            awg = "00";
        } else if (diameterMm >= 0.00785) {
            awg = Math.round(-39 * Math.log(diameterMm / 0.127) / Math.log(92) + 36).toString();
        }
    }
    return awg;
};

/**
 * Форматування результатів Харченко в текстовому вигляді
 */
export const formatKharchenkoResults = (results, unit = 'mm') => {
    let output = `Javascript Version 2025-09-13 by UARO\n`;
    output += `Антенна Харченко (зигзагоподібна)\n`;
    output += `-------------------------------------------------------------\n`;
    output += `Центральна частота f: ${results.frequency} МГц\n`;
    output += `Вхідний імпеданс антени Zo: ${results.impedance} Ω\n`;
    output += `Довжина хвилі λ: ${formatLength(results.wavelength, unit)} ${getUnitLabel(unit)}\n`;
    output += `-------------------------------------------------------------\n`;
    output += `Розмір W (загальна довжина рамок): ${formatLength(results.W, unit)} ${getUnitLabel(unit)}\n`;
    output += `Розмір H (ширина рамок): ${formatLength(results.H, unit)} ${getUnitLabel(unit)}\n`;
    output += `Загальна довжина дроту (периметр 2-х рамок): ${formatLength(results.totalWireLength, unit)} ${getUnitLabel(unit)}\n`;
    output += `Відстань від рефлектора до площини вібратора D: ${formatLength(results.D, unit)} ${getUnitLabel(unit)}\n`;
    output += `-------------------------------------------------------------\n`;
    output += `Розмір B (ширина рефлектора): ${formatLength(results.reflectorWidth, unit)} ${getUnitLabel(unit)}\n`;
    output += `Розмір A (довжина рефлектора): ${formatLength(results.reflectorLength, unit)} ${getUnitLabel(unit)}\n`;
    output += `Діаметр дроту вібратора: ${formatLength(results.wireDiameter, unit)} ${getUnitLabel(unit)} (${convertToAWG(results.wireDiameter)} AWG#)\n`;
    output += `Приблизна довжина сторони рамки qs1: ${formatLength(results.qs1, unit)} ${getUnitLabel(unit)}\n`;
    output += `Приблизна довжина сторони рамки qs2: ${formatLength(results.qs2, unit)} ${getUnitLabel(unit)}\n`;
    output += `Приблизний радіус згину дроту R: ${formatLength(results.bendRadius, unit)} ${getUnitLabel(unit)}\n`;
    output += `Приблизний проміжок у місці підключення gap: ${formatLength(results.gap, unit)} ${getUnitLabel(unit)}\n`;
    output += `-------------------------------------------------------------\n`;
    output += `Відстань між направляючими G0: ${formatLength(results.G0, unit)} ${getUnitLabel(unit)}\n`;
    output += `Відстань між направляючими G1: ${formatLength(results.G1, unit)} ${getUnitLabel(unit)}\n`;
    output += `Відстань між направляючими G2: ${formatLength(results.G2, unit)} ${getUnitLabel(unit)}\n`;
    output += `Відстань між направляючими G3: ${formatLength(results.G3, unit)} ${getUnitLabel(unit)}\n`;
    output += `Діаметр направляючої GD: ${formatLength(results.guidesDiameter, unit)} ${getUnitLabel(unit)}\n`;
    
    return output;
};

/**
 * Форматування результатів Харченко в структурованому HTML вигляді
 */
export const formatKharchenkoResultsHTML = (results, unit = 'mm') => {
    return {
        header: {
            title: 'Антенна Харченко (зигзагоподібна)',
            subtitle: 'Javascript Version 2025-09-13 by UARO',
            frequency: `${results.frequency} МГц`,
            impedance: `${results.impedance} Ω`,
            wavelength: `${formatLength(results.wavelength, unit)} ${getUnitLabel(unit)}`
        },
        biquadParams: {
            W: `${formatLength(results.W, unit)} ${getUnitLabel(unit)}`,
            H: `${formatLength(results.H, unit)} ${getUnitLabel(unit)}`,
            totalWireLength: `${formatLength(results.totalWireLength, unit)} ${getUnitLabel(unit)}`,
            D: `${formatLength(results.D, unit)} ${getUnitLabel(unit)}`
        },
        reflectorParams: {
            width: `${formatLength(results.reflectorWidth, unit)} ${getUnitLabel(unit)}`,
            length: `${formatLength(results.reflectorLength, unit)} ${getUnitLabel(unit)}`
        },
        constructionParams: {
            wireDiameter: `${formatLength(results.wireDiameter, unit)} ${getUnitLabel(unit)}`,
            awgSize: convertToAWG(results.wireDiameter),
            qs1: `${formatLength(results.qs1, unit)} ${getUnitLabel(unit)}`,
            qs2: `${formatLength(results.qs2, unit)} ${getUnitLabel(unit)}`,
            bendRadius: `${formatLength(results.bendRadius, unit)} ${getUnitLabel(unit)}`,
            gap: `${formatLength(results.gap, unit)} ${getUnitLabel(unit)}`
        },
        guidesParams: {
            G0: `${formatLength(results.G0, unit)} ${getUnitLabel(unit)}`,
            G1: `${formatLength(results.G1, unit)} ${getUnitLabel(unit)}`,
            G2: `${formatLength(results.G2, unit)} ${getUnitLabel(unit)}`,
            G3: `${formatLength(results.G3, unit)} ${getUnitLabel(unit)}`,
            diameter: `${formatLength(results.guidesDiameter, unit)} ${getUnitLabel(unit)}`
        }
    };
};

/**
 * Валідація вхідних даних для Харченко антени
 */
export const validateKharchenkoInputs = (frequency, impedance) => {
    const errors = [];
    
    if (!frequency || frequency <= 0) {
        errors.push('Некоректна частота');
    }
    
    if (frequency && (frequency < 400 || frequency > 3000)) {
        errors.push('Робоча частота знаходиться за межами можливостей цього калькулятора (400-3000 МГц)');
    }
    
    if (impedance !== 50 && impedance !== 75) {
        errors.push('Підтримуються тільки імпеданси 50 Ω та 75 Ω');
    }
    
    return errors;
};
