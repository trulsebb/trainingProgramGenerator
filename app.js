"use strict";

const movements = [
    {
        "group": "Squat",
        "movements": 
            [
                {"mid": 0, "label": "Squats"},
                {"mid": 1, "label": "Highbar squats"},
                {"mid": 2, "label": "Paused squats"},
                {"mid": 3, "label": "Front squats"},
                {"mid": 4, "label": "SSB squats"},
                {"mid": 21, "label": "Highbar paused squats"},
            ]
    }, {
        "group": "Bench",
        "movements": 
            [
                {"mid": 5, "label": "Bench press"},
                {"mid": 6, "label": "Medium grip bench press"},
                {"mid": 7, "label": "Close grip bench press"},
                {"mid": 8, "label": "Larsen press"},
                {"mid": 9, "label": "Close grip Larsen press"},
                {"mid": 10, "label": "Medium grip Larsen pin press"},
                {"mid": 20, "label": "Incline press"},
                {"mid": 22, "label": "Log press"},
                {"mid": 23, "label": "Floor press"}
            ]
    }, {
        "group": "Deadlift",
        "movements": 
            [
                {"mid": 11, "label": "Deadlifts"},
                {"mid": 12, "label": "Deficit deadlifts"},
                {"mid": 13, "label": "Snatch grip deadlifts"},
                {"mid": 14, "label": "Block pulls"},
                {"mid": 25, "label": "Sumo deadlifts"},
            ]
    }, {
        "group": "Other",
        "movements": 
            [
                {"mid": 15, "label": "Sealrow"},
                {"mid": 16, "label": "Standing row"},
                {"mid": 17, "label": "Pullups"},
                {"mid": 18, "label": "Weighted pullups"},
                {"mid": 19, "label": "Weighted dips"},
                {"mid": 24, "label": "Bulgarian split squats"}
            ]
    }
];

const maxFormula = (weight, reps) => weight * (36 / (37 - reps));
const rpeBasedMax = wantedReps => weight => reps => rpe => maxFormula(weight, (reps + (11 - rpe - wantedReps)));
const oneRepMax = rpeBasedMax(1);
const presentableWeightValue = number => {
    const rounded = 2.5 * Math.round(number / 2.5);
    return rounded > 0 ? rounded : '';
};

const b62Chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const decToB62 = decValue => {
    if (decValue == 0) { 
        return 0;
    }
    let newValue = '';
    const appendThis = (decValue < 0) ? '+' : '';
    let absDecValue = Math.abs(decValue);
    while (absDecValue > 0) {
        newValue = b62Chars[absDecValue % 62] + newValue;
        absDecValue = (absDecValue - (absDecValue % 62)) / 62;
    }
    return appendThis + newValue;
};
const b62ToDec = b62Value => {
    const isNegative = (b62Value[0] === '+');
    const absB62Value = (b62Value[0] === '+') ? b62Value.slice(1) : b62Value;
    const decValue = absB62Value.split('').map(c => b62Chars.findIndex(s => s == c)).reverse().map((v, i) => v*62**i).reduce((acc, val) => acc + val);
    return (isNegative) ? decValue * -1 : decValue;
};

class IdCreator {
    static latestId = 1000;
    static resetId() {
        this.latestId = 1000;
    }
    static getUniqueId() {
        return this.latestId++;
    }
}

const getStoredKeys = () => [...Array(localStorage.length).keys()].map(i => localStorage.key(i));

const getB62FromKeyVal = (key, value) => {
    return decToB62([key, value * 4].join(''));
};

const removeStoredInputKeys = () => getStoredKeys()
    .filter(skey => skey.match(/^(?!9999)\d{4}$/g))
    .map(k => { localStorage.removeItem(k)});

const getShareString = () => getStoredKeys()
        .filter(skey => skey.match(/^\d{4}$/g))
        .map(k => getB62FromKeyVal(k, localStorage.getItem(k)))
        .join('-');

const getKeyValFromB62 = b62 => {
    const decimalStr = b62ToDec(b62).toString(10);
    const key = decimalStr.slice(0,4);
    const value = decimalStr.slice(4);
    return [key, value/4];
};

const parseShareString = shareString => shareString.split('-').map(b62 => getKeyValFromB62(b62));

const autosave = () => {
    const dateString = new Date().toISOString().slice(0,10);
    const programSelect = document.getElementById('9999');
    const previousSetting = getSetting('9999')(0);
    const serializedKey = programSelect.options[previousSetting].text;
    const stringToSave = getShareString();
    if (stringToSave.split('-').length > 1) {
        localStorage.setItem(`${serializedKey} ${dateString}`, getShareString());
    }
}

const importFromShareString = (shareString) => {
    autosave();
    removeStoredInputKeys();
    parseShareString(shareString).map(row => saveSetting(row[0])(row[1]));
};

const saveSetting = elementId => value => localStorage.setItem(elementId, value);
const getSetting = elementId => defaultValue => {
    if (!localStorage.getItem(elementId)) {
        return defaultValue;
    }
    return localStorage.getItem(elementId);
};


// ui
const getBrilliantElement = (type, classes, content) => {
    let element = document.createElement(type);
    element.classList.add(...classes);
    if (typeof content === 'string') {
        element.textContent = content;
    } else if (Array.isArray(content)) {
        element.append(...content);
    } else if (typeof content === 'object') {
        element.appendChild(content);
    }
    return element;
};

const getBrilliantRow = headerCellsContent => getBrilliantElement('tr', [], headerCellsContent.map(content => getBrilliantElement('td', [], content)));
const getBrilliantHeaderRow = headerCellsContent => getBrilliantElement('tr', [], headerCellsContent.map(content => getBrilliantElement('th', [], content)));

const getBrilliantCheckBox = () => {
    let element = document.createElement('input');
    element.id = IdCreator.getUniqueId();
    element.onchange = () => saveSetting(element.id)(element.checked ? 1 : 0);
    element.setAttribute('type', 'checkBox');
    element.checked = getSetting(element.id)(0) === '1';
    return element;
}

const getBrilliantNumberInput = (min, max, step, value) => {
    let element = document.createElement('input');
    if (max < 100 && step == 1) {
        element.classList.add('smallInput');
    }
    element.id = IdCreator.getUniqueId();
    element.onchange = () => saveSetting(element.id)(element.value);
    element.setAttribute('type', 'number'); 
    element.value = getSetting(element.id)(value);
    element.min = min;
    element.max = max;
    element.step = step;
    return element;
};

const getBrilliantDisabledInput = (value) => {
    let element = document.createElement('input');
    element.setAttribute('type', 'text');
    element.value = value;
    element.disabled = true;
    return element;
};

const getShareContainer = () => {
    const hiddenShareLinkContainer = getBrilliantElement('div', ['shareLinkContainer']);
    hiddenShareLinkContainer.hidden = true;
    hiddenShareLinkContainer.addEventListener('toggleVisibility', () => { 
        while (hiddenShareLinkContainer.firstChild) {
            hiddenShareLinkContainer.removeChild(hiddenShareLinkContainer.firstChild);
        }
        hiddenShareLinkContainer.append(
            ...getStoredKeys()
                .filter(skey => skey.match(/\d{4}-\d{2}-\d{2}$/g))
                .sort()
                .map(k => {
                    let shareStringContainer = getBrilliantElement('div', ['shareStringContainer'], getBrilliantElement('label', ['shareStringLabel'], k));
                    const removeButton = getBrilliantElement('a', ['clearlink'], '🗑');
                    removeButton.onclick = () => {
                        localStorage.removeItem(k);
                        hiddenShareLinkContainer.dispatchEvent(new Event('toggleVisibility'));
                    };
                    let textBoxWithString = getBrilliantElement('input', ['presentedlink'], '');
                    textBoxWithString.type = 'text';
                    textBoxWithString.value = localStorage.getItem(k);
                    const copyLinkButton = getBrilliantElement('a', ['sharelink'], 'Copy');
                    copyLinkButton.onclick = () => {
                        textBoxWithString.select();
                        document.execCommand("copy");
                    };
                    const restoreButton = getBrilliantElement('a', ['sharelink'], 'Restore');
                    restoreButton.onclick = () => {
                        importFromShareString(textBoxWithString.value);
                        ProgramContainer.renderProgram();
                        //window.location.href = `${location.protocol}//${window.location.host}${window.location.pathname}?${textBoxWithString.value}`;
                    };
                    shareStringContainer.append(removeButton, textBoxWithString, copyLinkButton, restoreButton);
                    return shareStringContainer;
                }
            )
        );
        let shareStringContainer = getBrilliantElement('div', ['shareStringContainer']);
        const saveSerializedButton = getBrilliantElement('a', ['sharelink'], 'Save current');
        saveSerializedButton.onclick = () => {
            autosave();
            hiddenShareLinkContainer.dispatchEvent(new Event('toggleVisibility'));
        }
        const hideSettingsButton = getBrilliantElement('button', ['closebutton'], '▲ ▲ ▲');
        hideSettingsButton.onclick = () => { hiddenShareLinkContainer.hidden = !hiddenShareLinkContainer.hidden; };
        shareStringContainer.append(saveSerializedButton);
        hiddenShareLinkContainer.append(shareStringContainer, hideSettingsButton);
    });
    return hiddenShareLinkContainer;
};

const getBrilliantAnchorLinkList = programScheme => {
    const iterations = [...Array(programScheme.numberOfIterations).keys()];
    const linkList = getBrilliantElement('div', ['stickylinks']);
    const programSettingsLink = getBrilliantElement('a', ['settingsLink'], '🛠');
    programSettingsLink.onclick = () => {
        ProgramSettingsContainer.toggleVisibility();
    }
    const weekLinks = iterations.map(iteration => {
        const link = getBrilliantElement('a', ['cyclelink'], `Week ${iteration + 1}`);
        link.href = `#cycle${iteration}`;
        return link;
    });
    const shareLink = getBrilliantElement('a', ['sharelink'], '💾');
    const hiddenShareLinkContainer = getShareContainer();
    shareLink.onclick = () => {
        hiddenShareLinkContainer.dispatchEvent(new Event('toggleVisibility'));
        hiddenShareLinkContainer.hidden = !hiddenShareLinkContainer.hidden;
    }
    
    linkList.append(
        ...weekLinks, 
        programSettingsLink,
        shareLink, 
        ProgramSettingsContainer.programSettingsContainer, 
        hiddenShareLinkContainer
    );
    
    return linkList;
};

// +------------+----------+----+------------------+----+--------------------+
// |     .      |  Week1   | -> |      Week2       | -> |       Week3        |
// +------------+----------+----+------------------+----+--------------------+
// | Movement 1 | squat    | -> | squat            | -> | squat              |
// | Movement 2 | bench    | -> | larsen (changed) | -> | larsen             |
// | Movement 3 | deadlift | -> | deadlift         | -> | stiffleg (changed) |
// +------------+----------+----+------------------+----+--------------------+
// changes on movement on week2 cascades to week3, week4 etc.
const getMovementSelect = (defaultvalue, cascadeId) => {
    const selectElement = getBrilliantElement('select', ['movementselect']);
    selectElement.setAttribute('cascade', cascadeId);
    selectElement.id = IdCreator.getUniqueId(); //identifier;
    const selectedvalue = getSetting(selectElement.id)(defaultvalue);
    selectElement.onchange = () => {
        saveSetting(selectElement.id)(selectElement.value);
        const cascadingElements = document.querySelectorAll(`select[cascade$=${CSS.escape(cascadeId.slice(1))}]`);
        [...cascadingElements].filter(cElement => cElement.getAttribute('cascade')[0] > cascadeId[0]).map(cElement => {
            cElement.value = selectElement.value;
            saveSetting(cElement.id)(selectElement.value);
        });
    };
    const optGroups = movements.map(group => {
        const optGroup = getBrilliantElement('optgroup', [], group.movements.map(movement => {
            const moption = getBrilliantElement('option', [], movement.label);
            moption.value = movement.mid;
            if (movement.mid == selectedvalue) {
                moption.selected = true;
            }
            return moption;
        }));
        optGroup.label = group.group;
        return optGroup;
    });
    selectElement.append(...optGroups);
    return selectElement;
};

const getSessionMovementTable = (currentIteration, dayIndex, movements) => {
    const dayContainer = getBrilliantElement('fieldset', ['dayContainer'], getBrilliantElement('legend', [], `Day ${dayIndex + 1}`));
    dayContainer.append(...movements.map(((movement, movementIndex) => {
        const _setRefs = [];
        const sets = movement.sets.map(s => Array(s.repeat(currentIteration)).fill(s)).flat(); // [1,3,2] => [1,3,3,3,2,2]
        const movementTable = getBrilliantElement('table', ['movementContainer'], [
            getBrilliantElement('caption', [], getMovementSelect(movement.movementId, `${currentIteration}-${dayIndex}${movementIndex}`)),
            getBrilliantHeaderRow(['', 'Reps', 'Goal RPE', '% of e1RM', 'Weight', 'Actual RPE', 'e1RM']),
            ...sets.map((set, setIndex) => {
                const reps = getBrilliantNumberInput(0, 10, 1, set.reps(currentIteration));
                const perc = getBrilliantDisabledInput((set.perc(currentIteration) !== null) ? `${set.perc(currentIteration)}%` : null);
                const weight = (set.perc(currentIteration) !== null) 
                    ? getBrilliantDisabledInput(set.weight(currentIteration)) 
                    : getBrilliantNumberInput(75, 1000, 2.5, set.weight(currentIteration));
                const actualRpe = (set.rpe(currentIteration) == null)
                    ? getBrilliantDisabledInput(set.rpe(currentIteration))
                    : getBrilliantNumberInput(5, 11, 0.25, set.rpe(currentIteration));
                const plannedRpe = getBrilliantDisabledInput(set.rpe(currentIteration));
                const e1rm = getBrilliantDisabledInput('...');
                if (set.perc(currentIteration) !== null) {
                    const updateByHighestE1rm = () => {
                            const settingsMax = ProgramSettingsContainer.movementsMaxMap.get(movement.movementId) ?? 0;
                            const highestE1rm = 
                                _setRefs.reduce((cMax, s) => Math.max(Number(cMax), Number(s.value)), settingsMax);
                            const percentage = (typeof set.perc === 'function') ? set.perc(currentIteration) : Number(set.perc);
                            weight.value = presentableWeightValue((percentage * highestE1rm)/100);
                    };
                    updateByHighestE1rm();
                    _setRefs.map(setRef => setRef.addEventListener('change', updateByHighestE1rm))
                    if (ProgramSettingsContainer.movementsMaxInputMap.has(movement.movementId)) {
                        ProgramSettingsContainer.movementsMaxInputMap.get(movement.movementId).addEventListener('change', updateByHighestE1rm);
                    }
                };
                _setRefs.push(e1rm);
                const session1rm = () => (weight.value && reps.value && actualRpe.value) ? oneRepMax(Number(weight.value))(Number(reps.value))(Number(actualRpe.value)) : null;
                e1rm.value = presentableWeightValue(session1rm());
                [reps, weight, actualRpe].map(inputElement => inputElement.addEventListener('input', () => {
                    e1rm.value = presentableWeightValue(session1rm());
                    e1rm.dispatchEvent(new Event('change'));
                }));
                
                return getBrilliantRow([getBrilliantCheckBox(), reps, plannedRpe, perc, weight, actualRpe, e1rm]);
            }).flat()
        ]);
        
        return movementTable;
    })));
    return dayContainer;
};

class ProgramSettingsContainer {
    static programSettingsContainer = getBrilliantElement('div', ['programSettingsContainer']);
    static toggleVisibility = () => {
        this.programSettingsContainer.hidden = !this.programSettingsContainer.hidden;
    }
    static movementsMaxMap = new Map();
    static movementsTitleMap = new Map(movements.map(group => group.movements.map(mov => [mov.mid, mov.label])).flat());
    static movementsMaxInputMap = new Map();
    static initProgramSettingsContainer = programSetUp  => {
        // whipe program maps
        this.movementsMaxInputMap = new Map();
        this.movementsMaxMap = new Map();
        const settingsHeader = getBrilliantElement('h2', [], `Program settings`);
        const programSettingsContainer = getBrilliantElement('div', ['programSettingsContainer']);
        programSettingsContainer.id = 'programSettings';
        programSettingsContainer.append(settingsHeader);
        const cleanSlate = getBrilliantElement('a', ['clearlink'], '🗑');
        cleanSlate.onclick = () => {
            removeStoredInputKeys();
            ProgramContainer.renderProgram();
        };
        programSettingsContainer.append("Reset program completely:", cleanSlate);
        const movementsWithoutRPE = programSetUp.days.map(day => day
            .filter(movement => movement.sets.reduce((previous, current) => !current.hasOwnProperty('rpe')), false)
            .map(movement => movement.movementId))
            .flat();
        if (movementsWithoutRPE.length > 0) {
            programSettingsContainer.append(
                getBrilliantElement('table', ['settingsTable'], [
                    getBrilliantHeaderRow([
                    'Movment', 'e1RM'
                    ]),
                    ...movementsWithoutRPE.map(movementId => {
                        const maxWeightInput = getBrilliantNumberInput(75, 1000, 2.5);
                        maxWeightInput.addEventListener('change', () => {
                            this.movementsMaxMap.set(movementId, maxWeightInput.value);
                        })
                        this.movementsMaxInputMap.set(movementId, maxWeightInput);
                        maxWeightInput.dispatchEvent(new Event('change'));
                        return getBrilliantRow([
                            this.movementsTitleMap.get(movementId),
                            maxWeightInput
                        ]);
                    })
                ])
            );
        }
        if ([...this.movementsMaxInputMap.values()].every(maxInput => maxInput.value > 0)) {
            programSettingsContainer.hidden = true;
        }
        const hideSettingsButton = getBrilliantElement('button', ['closebutton'], '▲ ▲ ▲');
        hideSettingsButton.onclick = this.toggleVisibility;
        programSettingsContainer.append(hideSettingsButton);

        this.programSettingsContainer = programSettingsContainer;
    }
}

const getProgramSelect = (programSchemes) => {
    const selectElement = getBrilliantElement('select', ['programselect']);
    selectElement.id = 9999; //'9-9-9-9-9';
    const selectedvalue = getSetting(selectElement.id)(0);
    selectElement.onchange = () => {
        autosave();
        removeStoredInputKeys();
        saveSetting(selectElement.id)(selectElement.value);
        ProgramContainer.renderProgram();
        //window.location.href = `${location.protocol}//${window.location.host}${window.location.pathname}`;
    };
    selectElement.append(...programSchemes.map((programScheme, index) => {
        const option = getBrilliantElement('option', [], programScheme.title);
            option.value = index;
            if (index == selectedvalue) {
                option.selected = true;
            }
            return option;
    }));
    return selectElement;
}

const PROGRESSION_LINEAR = 1;
const PROGRESSION_CONSTANT = 2;
const PROGRESSION_NONE = 3;
const PROGRESSION_STEPS = 4;
const progressions = {
    linear: (...params) => iteration => params[0] + params[1] * iteration,
    constant: (...params) => iteration => params[0],
    none: (...params) => iteration => null,
    steps: (...params) => iteration => params[iteration % params.length]
};

const getProgressionFormula = progressionTemplate => {
    if (typeof progressionTemplate === 'function') {
        return progressionTemplate;
    }
    if (typeof progressionTemplate === "undefined") {
        return progressions.none();
    }
    if (progressionTemplate == null) {
        return progressions.none();
    }
    if (typeof progressionTemplate === "number") {
        return progressions.constant(progressionTemplate);
    }
    if (typeof progressionTemplate === "object") {
        if (progressionTemplate.type === PROGRESSION_LINEAR) {
            return progressions.linear(...progressionTemplate.params);
        }
        if (progressionTemplate.type === PROGRESSION_CONSTANT) {
            return progressions.constant(...progressionTemplate.params);
        }
        if (progressionTemplate.type === PROGRESSION_NONE) {
            return progressions.none();
        }
        if (progressionTemplate.type === PROGRESSION_STEPS) {
            return progressions.steps(...progressionTemplate.params);
        }
    }
    return progressions.none();
}

const readyProgram = rawProg => ({
    numberOfIterations: rawProg.numberOfIterations,
    title: rawProg.title,
    days: rawProg.days.map(day => day.map(movement => ({
        movementId: movement.movementId,
        sets: movement.sets.map(set => ({
            reps: getProgressionFormula(set.reps),
            rpe: getProgressionFormula(set.rpe),
            perc: getProgressionFormula(set.perc),
            weight: getProgressionFormula(set.weight),
            repeat: (set.repeat == null || typeof set.repeat == "undefined") ? progressions.constant(1) : getProgressionFormula(set.repeat)
        }))
    })))
});

const setParams = {
    reps: 1,
    rpe: 2,
    perc: 3,
    weight: 4,
    repeat: 5,
};

const convertRawProgressionToArray = (typeId, rawProgression) => 
    (typeof rawProgression == 'object') 
    ? [typeId,
        1, // serves as length in parser
        rawProgression.type,
        rawProgression.params.length,
        rawProgression.params]//.map(param => (param < 0) ? `+${Math.abs(param)}`: param)]
    : [];

const getSharableProgram = rawProg => [
    rawProg.numberOfIterations, // serves as id in parser
    rawProg.days.length,
    rawProg.days.map(day => [
        0, // serves as id in parser
        day.length,
        day.map(movement => [
            movement.movementId,
            movement.sets.length,
            movement.sets.map(set => [
                0, // serves as id in parser
                Object.keys(set).length,
                ...convertRawProgressionToArray(setParams.reps, set.reps),
                ...convertRawProgressionToArray(setParams.rpe, set.rpe),
                ...convertRawProgressionToArray(setParams.perc, set.perc),
                ...convertRawProgressionToArray(setParams.weight, set.weight),
                ...convertRawProgressionToArray(setParams.repeat, set.repeat),
            ])
        ])
    ])
].flat(8).map(n => decToB62(n)).map(e => (e.length > 1) ? `-${e.length}${e}` : e).join('');

const parseShortened = d => d.split(/(?=-)/g).map(chunk => (chunk[0] === '-') ? [chunk.slice(2,2+Number(chunk[1])), ...chunk.slice(2+Number(chunk[1])).split('')] : chunk.split('')).flat();

const parseSharableProgram = (title, shareProgram) => {
    const atoms = parseShortened(shareProgram).map(atom => b62ToDec(atom));
    const parseDays = (nrOfDays, data) => {
        let allCounters = [0,0,0,0,0,0,nrOfDays];
        let result = [];
        let findCounter = false;
        let findId = true;
        data.forEach(value => {
            const level = allCounters.findIndex(counter => counter > 0);
            if (findId) { 
                if (level == 6) result.push([value]);
                else if (level == 5) result.at(-1).push([value]);
                else if (level == 4) result.at(-1).at(-1).push([value]);
                else if (level == 3) result.at(-1).at(-1).at(-1).push([value]);
                else if (level == 2) result.at(-1).at(-1).at(-1).at(-1).push([value, []]);
                else if (level == 1) result.at(-1).at(-1).at(-1).at(-1).at(-1).push([value, []]);
                else if (level == 0) result.at(-1).at(-1).at(-1).at(-1).at(-1).at(-1).push([value, []]);
                findId = false;
                findCounter = true;
            } else if (level > -1) {
                if (findCounter) {
                    allCounters[level-1] = value;
                    findCounter = false;
                    findId = level > 2;
                } else {
                    if (level == 6) result.at(-1).push([value]);
                    else if (level == 5) result.at(-1).at(-1).push(value);
                    else if (level == 4) result.at(-1).at(-1).at(-1).push(value);
                    else if (level == 3) result.at(-1).at(-1).at(-1).at(-1).push(value);
                    else if (level == 2) result.at(-1).at(-1).at(-1).at(-1).at(-1).push(value);
                    else if (level == 1) result.at(-1).at(-1).at(-1).at(-1).at(-1).at(-1).push(value);
                    else if (level == 0) result.at(-1).at(-1).at(-1).at(-1).at(-1).at(-1).at(-1).push(value)
                }
                --allCounters[level];
                if (allCounters.slice(0,level+1).every(v => v==0)) {
                    findCounter = true;
                    findId = true;
                }
            }
        });
        return result;
    };
    const parseProgression = data => ({
        type: data[0][0],
        params: data[0].slice(1).flat()
    });
    return {
        numberOfIterations: atoms[0],
        title: title,
        days: parseDays(atoms[1],atoms.slice(2))
            .filter(day => typeof day === 'object' && day.length > 0)
            .map(day => (day.filter(movement => typeof movement === 'object' && movement.length > 0).map(movement => ({
                movementId: movement[0],
                sets: movement.slice(1)
                    .filter(set => typeof set === 'object' && set.length > 0)
                    .map(set => {
                        let setObj = {};
                        set.slice(1).map(setParam => {
                            if (setParam[0] == setParams.reps) setObj.reps = parseProgression(setParam.slice(1));
                            else if (setParam[0] == setParams.rpe) setObj.rpe = parseProgression(setParam.slice(1));
                            else if (setParam[0] == setParams.perc) setObj.perc = parseProgression(setParam.slice(1));
                            else if (setParam[0] == setParams.weight) setObj.weight = parseProgression(setParam.slice(1));
                            else if (setParam[0] == setParams.repeat) setObj.repeat = parseProgression(setParam.slice(1));
                        });
                        return setObj;
                    })
            }))))
    }
}

const standardPrograms = [
    {
        title: "Basic training program",
        shareString: "5601020211125-2+1212190311127-2+13112Z55121401820211125-2+1212190311127-2+13112Z55121401220211125-2+1212190311127-2+13112Z55121401920211125-2+1212190311127-2+13112Z55121401b20211125-2+1212190311127-2+13112Z55121401a20211125-2+1212190311127-2+13112Z551214"
    },
    {
        title: "Swiss program",
        shareString: "5502020211125-2+1212190311127-2+13112Z551214k20211128-2+121218031112a-2+13112Z55121402520211125-2+1212190311127-2+13112Z551214l20211125-2+1212190311127-2+13112Z55121402b20211125-2+1212190311127-2+13112Z551214720211128-2+121218031112a-2+13112Z55121402n20211125-2+1212190311127-2+13112Z551214m20211125-2+1212180311127-2+13112Z55121402p20211128-2+121218031112a-2+13112Z551214n20211128-2+121218031112a-2+13112Z551214"
    },
    {
        title: "Oldschool linear",
        shareString: "660101031112a-2+13112W45112a-2+10181031112a-2+13112W45112a-2+10121031112a-2+13112W45112a-2+10191031112a-2+13112W45112a-2+101b1031112a-2+13112W45112a-2+101a1031112a-2+13112W45112a-2+1"
    },
];

class ProgramContainer {
    static appContainer = getBrilliantElement('div', ['appContainer']);
    static first = true;
    static renderProgram() {
        IdCreator.resetId();
        while (this.appContainer.firstChild) {
            this.appContainer.removeChild(this.appContainer.firstChild);
        }
        const programContainer = getBrilliantElement('div', ['programContainer']);
        programContainer.addEventListener('render', event => {
            while (programContainer.firstChild) {
                programContainer.removeChild(programContainer.firstChild);
            }
            const actualProgram = event.detail.actualProgram;
            var iterations = [...Array(actualProgram.numberOfIterations).keys()];
            ProgramSettingsContainer.initProgramSettingsContainer(actualProgram);
            programContainer.append(
                ...iterations.map(currentIteration => {
                    let cycleHeader = getBrilliantElement('h2', [], `Week ${currentIteration + 1}`)
                    let cycleContainer = getBrilliantElement('div', ['blockContainer'], cycleHeader);
                    cycleContainer.id = `cycle${currentIteration}`;
                    cycleContainer.append(
                        ...actualProgram.days.map((movements, index) => getSessionMovementTable(currentIteration, index, movements))
                    );
                    return cycleContainer;
                })
            );
        });
    
        const rawProgramSetUp = standardPrograms[getSetting('9999')(0)];
        const programSetUp = readyProgram(parseSharableProgram(rawProgramSetUp.title, rawProgramSetUp.shareString));
        programContainer.dispatchEvent(new CustomEvent('render', {detail: {actualProgram: programSetUp}}));
    
        const headerContainer = getBrilliantElement('div', ['headerContainer']);
        headerContainer.addEventListener('render', event => {
            while (headerContainer.firstChild) {
                headerContainer.removeChild(headerContainer.firstChild);
            }
            headerContainer.append(
                getProgramSelect(standardPrograms),
                getBrilliantAnchorLinkList(programSetUp)
            );
        });
        headerContainer.dispatchEvent(new Event('render'));
        this.appContainer.append(headerContainer, programContainer);
        if (this.first) {
            document.body.append(this.appContainer);
            this.first = false;
        }
    }
}

// add stuff to document
ProgramContainer.renderProgram();
