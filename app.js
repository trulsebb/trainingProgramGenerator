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

//const movementsMap = new Map(movements.map(group => group.movements.map(mov => [mov.mid, mov.label])).flat());

const b62Chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const decToB62 = decValue => {
    let newValue = '';
    while (decValue > 0) {
        newValue = b62Chars[decValue % 62] + newValue;
        decValue = (decValue - (decValue % 62)) / 62;
    }
    return newValue;
};
const b62ToDec = b62Value => b62Value.split('').map(c => b62Chars.findIndex(s => s == c)).reverse().map((v, i) => v*62**i).reduce((acc, val) => acc + val);

class IdCreator {
    static latestId = 1000;
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
    let serializedKey = new Date().toISOString().slice(0,16);
    let stringToSave = getShareString();
    if (stringToSave != '') {
        localStorage.setItem(`${serializedKey}(autosave)`, getShareString());
    }
}

const importFromShareString = () => {
    autosave();
    removeStoredInputKeys();
    parseShareString(window.location.search.slice(1)).map(row => saveSetting(row[0])(row[1]));
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
                .filter(skey => skey.match(/\d{4}-\d{2}-\d{2}T/g))
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
                        window.location.href = `${location.protocol}//${window.location.host}${window.location.pathname}?${textBoxWithString.value}`;
                    };
                    shareStringContainer.append(removeButton, textBoxWithString, copyLinkButton, restoreButton);
                    return shareStringContainer;
                }
            )
        );
        let shareStringContainer = getBrilliantElement('div', ['shareStringContainer']);
        const saveSerializedButton = getBrilliantElement('a', ['sharelink'], 'Save current');
        saveSerializedButton.onclick = () => {
            let serializedKey = new Date().toISOString().slice(0,16);
            localStorage.setItem(serializedKey, getShareString());
            hiddenShareLinkContainer.dispatchEvent(new Event('toggleVisibility'));
        }
        shareStringContainer.append(saveSerializedButton);
        hiddenShareLinkContainer.append(shareStringContainer);
    });
    return hiddenShareLinkContainer;
};

const getBrilliantAnchorLinkList = programScheme => {
    const iterations = [...Array(programScheme.numberOfIterations).keys()];
    const linkList = getBrilliantElement('div', ['stickylinks'], iterations.map(iteration => {
        const link = getBrilliantElement('a', ['cyclelink'], `Week ${iteration + 1}`);
        link.href = `#cycle${iteration}`;
        return link;
    }));
    const shareLink = getBrilliantElement('a', ['sharelink'], '💾');
    const hiddenShareLinkContainer = getShareContainer();
    shareLink.onclick = () => {
        hiddenShareLinkContainer.dispatchEvent(new Event('toggleVisibility'));
        hiddenShareLinkContainer.hidden = !hiddenShareLinkContainer.hidden;
    }
    const cleanSlate = getBrilliantElement('a', ['clearlink'], '🗑');
    cleanSlate.onclick = () => {
        removeStoredInputKeys();
        window.location.href = `${location.protocol}//${window.location.host}${window.location.pathname}`;
    };
    linkList.append(shareLink, cleanSlate, hiddenShareLinkContainer);
    
    return linkList;
};

// +------------+----------+----+------------------+----+--------------------+
// |     .      |  Week1   | -> |      Week2       | -> |       Week3        |
// +------------+----------+----+------------------+----+--------------------+
// | Movement 1 | squat    | -> | squat            | -> | squat              |
// | Movement 2 | bench    | -> | larsen (changed) | -> | larsen             |
// | Movement 3 | deadlift | -> | deadlift         | -> | stiffleg (changed) |
// +------------+----------+----+------------------+----+--------------------+
// The movement setting works like this: 2-2-8 meaning week2-day2-'Larsen' then that change
// cascades to week3, week4 etc.
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
    let dayContainer = getBrilliantElement('fieldset', ['dayContainer'], getBrilliantElement('legend', [], `Day ${dayIndex + 1}`));
    dayContainer.append(...movements.map(((movement, movementIndex) => {
        let _setRefs = [];
        let sets = movement.sets.map(s => Array(s.repeat(currentIteration)).fill(s)).flat(); // [1,3,2] => [1,3,3,3,2,2]
        let movementTable = getBrilliantElement('table', ['movementContainer'], [
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
                    let updateByHighestE1rm = () => {
                            let highestE1rm = _setRefs.reduce((cMax, s) => Math.max(Number(cMax), Number(s.value)), 0);
                            let percentage = (typeof set.perc === 'function') ? set.perc(currentIteration) : Number(set.perc);
                            weight.value = presentableWeightValue((percentage * highestE1rm)/100);
                    };
                    updateByHighestE1rm();
                    _setRefs.map(setRef => setRef.addEventListener('change', updateByHighestE1rm))};
                _setRefs.push(e1rm);
                let session1rm = () => (weight.value && reps.value && actualRpe.value) ? oneRepMax(Number(weight.value))(Number(reps.value))(Number(actualRpe.value)) : null;
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



// TODO
// make movements deletable and addable
// add big always-visible "PIVOT!"-button
// pivot button cuts current week/cycle off and inserts a pivot week

const getProgramSelect = (programSchemes) => {
    const selectElement = getBrilliantElement('select', ['programselect']);
    selectElement.id = 9999; //'9-9-9-9-9';
    const selectedvalue = getSetting(selectElement.id)(0);
    selectElement.onchange = () => {
        autosave();
        removeStoredInputKeys();
        saveSetting(selectElement.id)(selectElement.value);
        window.location.href = `${location.protocol}//${window.location.host}${window.location.pathname}`;
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

// import settings from sharestring
if (window.location.search.slice(1)) {
    importFromShareString();
}

const PROGRESSION_LINEAR = 'linear';
const PROGRESSION_CONSTANT = 'constant';
const PROGRESSION_NONE = 'none';
const PROGRESSION_STEPS = 'steps';
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

let brilliantProgramRaw = {
    numberOfIterations: 5,
    title: "Brilliant program 1.0",
    days: [0,8,2,9,11,10].map(movId => [{
        movementId: movId,
        sets: [
            {
                reps: {type: 'linear', params: [5, -1]},
                rpe: {type: 'constant', params: [9]},
            },
            {
                reps: {type: 'linear', params: [7, -1]},
                perc: {type: 'linear', params: [61, 5]},
                repeat: {type: 'constant', params: [4]},
            }
        ]
    }])
};
let brilliantProgram = readyProgram(brilliantProgramRaw);

let heliosProgramRaw = {
    numberOfIterations: 5,
    title: "Brilliant Helios remix",
    days: [
        [ // day 
            { // movement 
                movementId: 0,
                sets: [
                    {
                        reps: {type: 'linear', params: [5, -1]},
                        rpe: {type: 'constant', params: [9]},
                    },
                    {
                        reps: {type: 'linear', params: [7, -1]},
                        perc: {type: 'linear', params: [61, 5]},
                        repeat: {type: 'constant', params: [4]},
                    }
                ]
            }, { // movement 
                movementId: 20,
                sets: [
                    {
                        reps: {type: 'linear', params: [8, -1]},
                        rpe: {type: 'constant', params: [8]},
                    },
                    {
                        reps: {type: 'linear', params: [10, -1]},
                        perc: {type: 'linear', params: [61, 5]},
                        repeat: {type: 'constant', params: [4]},
                    }
                ]
            }
        ],[ // day 
            { // movement 
                movementId: 5,
                sets: [
                    {
                        reps: {type: 'linear', params: [5, -1]},
                        rpe: {type: 'constant', params: [9]},
                    },
                    {
                        reps: {type: 'linear', params: [7, -1]},
                        perc: {type: 'linear', params: [61, 5]},
                        repeat: {type: 'constant', params: [4]},
                    }
                ]
            }, { // movement 
                movementId: 21,
                sets: [
                    {
                        reps: {type: 'linear', params: [5, -1]},
                        rpe: {type: 'constant', params: [9]},
                    },
                    {
                        reps: {type: 'linear', params: [7, -1]},
                        perc: {type: 'linear', params: [61, 5]},
                        repeat: {type: 'constant', params: [4]},
                    }
                ]
            }
        ],[ // day 
            { // movement 
                movementId: 11,
                sets: [
                    {
                        reps: {type: 'linear', params: [5, -1]},
                        rpe: {type: 'constant', params: [9]},
                    },
                    {
                        reps: {type: 'linear', params: [7, -1]},
                        perc: {type: 'linear', params: [61, 5]},
                        repeat: {type: 'constant', params: [4]},
                    }
                ]
            }, { // movement 
                movementId: 7,
                sets: [
                    {
                        reps: {type: 'linear', params: [8, -1]},
                        rpe: {type: 'constant', params: [8]},
                    },
                    {
                        reps: {type: 'linear', params: [10, -1]},
                        perc: {type: 'linear', params: [61, 5]},
                        repeat: {type: 'constant', params: [4]},
                    }
                ]
            }
        ],[ // day 
            { // movement 
                movementId: 23,
                sets: [
                    {
                        reps: {type: 'linear', params: [5, -1]},
                        rpe: {type: 'constant', params: [9]},
                    },
                    {
                        reps: {type: 'linear', params: [7, -1]},
                        perc: {type: 'linear', params: [61, 5]},
                        repeat: {type: 'constant', params: [4]},
                    }
                ]
            }, { // movement 
                movementId: 22,
                sets: [
                    {
                        reps: {type: 'linear', params: [5, -1]},
                        rpe: {type: 'constant', params: [8]},
                    },
                    {
                        reps: {type: 'linear', params: [7, -1]},
                        perc: {type: 'linear', params: [61, 5]},
                        repeat: {type: 'constant', params: [4]},
                    }
                ]
            }
        ],[ // day 
            { // movement 
                movementId: 25,
                sets: [
                    {
                        reps: {type: 'linear', params: [8, -1]},
                        rpe: {type: 'constant', params: [8]},
                    },
                    {
                        reps: {type: 'linear', params: [10, -1]},
                        perc: {type: 'linear', params: [61, 5]},
                        repeat: {type: 'constant', params: [4]},
                    }
                ]
            }, { // movement 
                movementId: 23,
                sets: [
                    {
                        reps: {type: 'linear', params: [8, -1]},
                        rpe: {type: 'constant', params: [8]},
                    },
                    {
                        reps: {type: 'linear', params: [10, -1]},
                        perc: {type: 'linear', params: [61, 5]},
                        repeat: {type: 'constant', params: [4]},
                    }
                ]
            }
        ],
]};
let heliosProgram = readyProgram(heliosProgramRaw);

let oldSchoolProgramRaw = {
    numberOfIterations: 6,
    title: "Old school linear",
    days: [0,8,2,9,11,10].map(movId => [{
        movementId: movId,
        sets: [
            {
                reps: {type: 'constant', params: [10]},
                perc: {type: 'constant', params: [58]},
                repeat: {type: 'linear', params: [10, -1]},
            }
        ]
    }])
};
let oldSchoolProgram = readyProgram(oldSchoolProgramRaw);

// add stuff to document
const renderProgram = (programSchemes) => {
    const programContainer = getBrilliantElement('div', ['programContainer']);
    programContainer.addEventListener('render', event => {
        while (programContainer.firstChild) {
            programContainer.removeChild(programContainer.firstChild);
        }
        const actualProgram = event.detail.actualProgram;
        var iterations = [...Array(actualProgram.numberOfIterations).keys()];
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

    const programSetUp = programSchemes[getSetting('9999')(0)];
    programContainer.dispatchEvent(new CustomEvent('render', {detail: {actualProgram: programSetUp}}));

    const headerContainer = getBrilliantElement('div', ['headerContainer']);
    headerContainer.addEventListener('render', event => {
        while (headerContainer.firstChild) {
            headerContainer.removeChild(headerContainer.firstChild);
        }
        headerContainer.append(
            getProgramSelect(programSchemes),
            getBrilliantAnchorLinkList(programSetUp)
        );
    });
    headerContainer.dispatchEvent(new Event('render'));
    
    return getBrilliantElement('div', ['appContainer'], [headerContainer, programContainer]);
};

document.body.append(renderProgram([brilliantProgram, heliosProgram, oldSchoolProgram]));
